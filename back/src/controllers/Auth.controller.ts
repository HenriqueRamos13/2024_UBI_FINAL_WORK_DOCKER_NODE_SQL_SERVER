import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { Public } from "../utils/decorators/Public.decorator";
import { RequestParams } from "../types";
import DB from "../config/db/SimpleSqlServer";
import ErrorHandler from "../utils/Classes/ErrorHandler";
import TEXTS from "../utils/Texts";
import * as bcrypt from "bcryptjs";

const CONTROLLER_MICROSSSERVICE_ID = 1;

class AuthController {
  @routeConfig({
    method: METHOD.POST,
    path: "/auth",
    id: CONTROLLER_MICROSSSERVICE_ID,
  })
  @Public()
  public async post({ req, res, next }: RequestParams): Promise<any | void> {
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

      return res.json({ message: "User created" });
    } catch (error) {
      return ErrorHandler.Unauthorized(error, TEXTS.error.WRONG_USER, next);
    } finally {
      await pool.close();
    }
  }
}

export default AuthController;
