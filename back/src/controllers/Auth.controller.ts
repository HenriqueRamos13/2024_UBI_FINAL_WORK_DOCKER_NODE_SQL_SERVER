import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { Public } from "../utils/decorators/Public.decorator";
import { RequestParams } from "../types";
import DB from "../config/db/SimpleSqlServer";
import ErrorHandler from "../utils/Classes/ErrorHandler";
import TEXTS from "../utils/Texts";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const CONTROLLER_MICROSSSERVICE_ID = 1;

class AuthController {
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Log in a user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: Successful login
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       401:
   *         description: Unauthorized
   */
  @routeConfig({
    method: METHOD.POST,
    path: "/auth/login",
    id: CONTROLLER_MICROSSSERVICE_ID,
  })
  @Public()
  public async postLogin({ req, res, next }: RequestParams): Promise<any> {
    const { email, password } = req.body;

    const pool = await DB();

    try {
      const userData = await pool
        .request()
        .query(`SELECT * FROM [user] WHERE email = '${email}'`);

      if (userData.recordset.length === 0)
        return ErrorHandler.Unauthorized(
          TEXTS.error.WRONG_USER,
          TEXTS.error.WRONG_USER,
          next
        );

      if (!bcrypt.compareSync(password, userData.recordset[0].password))
        return ErrorHandler.Unauthorized(
          TEXTS.error.WRONG_USER,
          TEXTS.error.WRONG_USER,
          next
        );

      const user = userData.recordset[0];

      const body = {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      };
      const token = jwt.sign(body, process.env.JWT_TOKEN, {
        expiresIn: "8h",
        algorithm: "HS256",
      });

      res.cookie("authorization", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      res.json({ token });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        TEXTS.error.WRONG_USER,
        TEXTS.error.WRONG_USER,
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new company and user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               company:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - company
   *               - email
   *               - password
   *     responses:
   *       201:
   *         description: User created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   */
  @routeConfig({
    method: METHOD.POST,
    path: "/auth/register",
    id: CONTROLLER_MICROSSSERVICE_ID,
  })
  @Public()
  public async postRegister({
    req,
    res,
    next,
  }: RequestParams): Promise<any | void> {
    const companyName = req.body.company;
    const { email, password } = req.body;

    const pool = await DB();

    try {
      const companyExists = await pool
        .request()
        .input("companyName", companyName)
        .query("SELECT * FROM company WHERE name = @companyName");

      if (companyExists.recordset.length) {
        return ErrorHandler.Unauthorized(
          new Error("Company already exists"),
          "Company already exists",
          next
        );
      }

      const user = await pool
        .request()
        .query(`SELECT * FROM [user] WHERE email = '${email}'`);

      if (user.recordset.length > 0)
        throw new Error(TEXTS.error.USER_ALREADY_EXISTS);

      const salt = bcrypt.genSaltSync(14);
      const hash = bcrypt.hashSync(password, salt);

      const newUser = await pool
        .request()
        .query(
          `INSERT INTO [user] (email, password, role, name) VALUES ('${email}', '${hash}', 'admin', '${
            email.split("@")[0]
          }')`
        );

      await pool
        .request()
        .input("companyName", companyName)
        .query("INSERT INTO company (name) VALUES (@companyName)");

      const company = await pool
        .request()
        .input("companyName", companyName)
        .query("SELECT * FROM company WHERE name = @companyName");

      await pool
        .request()
        .input("companyId", company.recordset[0].id)
        .input("email", email)
        .query("UPDATE [user] SET companyId = @companyId WHERE email = @email");

      res.json({ message: "User created" });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        error,
        "Ocorreu um erro ao cadastrar",
        next
      );
    } finally {
      await pool.close();
    }
  }
}

export default AuthController;
