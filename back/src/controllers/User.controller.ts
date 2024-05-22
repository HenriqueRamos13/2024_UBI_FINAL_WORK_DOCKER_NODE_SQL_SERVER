import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { Public } from "../utils/decorators/Public.decorator";
import { RequestParams } from "../types";
import { Roles } from "../utils/decorators/Roles.decorator";
import { Role } from "../utils/enums/Roles.enum";
import DB from "../config/db/SimpleSqlServer";
import * as bcrypt from "bcryptjs";
import ErrorHandler from "../utils/Classes/ErrorHandler";

const CONTROLLER_MICROSSERVICE_ID = 1;

class UserController {
  @routeConfig({
    method: METHOD.GET,
    path: "/user",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async get({ req, res, next, user }: RequestParams): Promise<void> {
    res.json({ message: "GET" });
  }

  /**
   * @swagger
   * /user:
   *   post:
   *     summary: Create a new user
   *     parameters:
   *       - in: query
   *         name: owner
   *         required: true
   *         schema:
   *           type: string
   *         description: The owner of the user
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The user ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               model:
   *                 type: string
   *               serialNumber:
   *                 type: string
   *             required:
   *               - name
   *               - model
   *     responses:
   *       201:
   *         description: The created drone
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 model:
   *                   type: string
   *                 serialNumber:
   *                   type: string
   *                 owner:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.POST,
    path: "/user",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles(Role.ADMIN)
  public async post({ req, res, next, user }: RequestParams): Promise<void> {
    const { name, email, password, role } = req.body;

    const { companyId } = user;

    const pool = await DB();

    try {
      const salt = bcrypt.genSaltSync(14);
      const hash = bcrypt.hashSync(password, salt);

      const userExists = await pool
        .request()
        .input("email", email)
        .query("SELECT * FROM [User] WHERE email = @email");

      if (userExists.recordset.length) {
        return ErrorHandler.Unauthorized(
          "User already exists",
          "User already exists",
          next
        );
      }

      const newUser = await pool
        .request()
        .input("name", name)
        .input("email", email)
        .input("password", hash)
        .input("companyId", companyId)
        .input("role", role)
        .query(
          `INSERT INTO [User] (name, email, password, companyId, role) VALUES (@name, @email, @password, @companyId, @role)`
        );

      const userCreated = await pool
        .request()
        .input("email", email)
        .query("SELECT * FROM [User] WHERE email = @email");

      if (userCreated.rowsAffected[0] === 0) {
        return ErrorHandler.Unauthorized(
          "Error creating user",
          "Error creating user",
          next
        );
      }

      res.json({
        user: {
          id: userCreated.recordset[0].id,
          name: userCreated.recordset[0].name,
        },
      });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error creating user",
        "Error creating user",
        next
      );
    } finally {
      await pool.close();
    }
  }

  @routeConfig({
    method: METHOD.PUT,
    path: "/user",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async put({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "PUT" });
  }

  @routeConfig({
    method: METHOD.PATCH,
    path: "/user",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async patch({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "PATCH" });
  }

  @routeConfig({
    method: METHOD.DELETE,
    path: "/user",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async delete({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "DELETE" });
  }
}

export default UserController;
