import { Public } from "../utils/decorators/Public.decorator";
import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { RequestParams } from "../types";
import DB from "../config/db/SimpleSqlServer";
import TEXTS from "../utils/Texts";
import ErrorHandler from "../utils/Classes/ErrorHandler";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const CONTROLLER_MICROSSSERVICE_ID = 1;

class SessionController {
  @routeConfig({
    method: METHOD.POST,
    path: "/login",
    id: CONTROLLER_MICROSSSERVICE_ID,
  })
  @Public()
  public async post({ req, res, next }: RequestParams): Promise<any> {
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

      await pool.close();

      res.json({ token });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        TEXTS.error.WRONG_USER,
        TEXTS.error.WRONG_USER,
        next
      );
    }
  }
}

export default SessionController;
