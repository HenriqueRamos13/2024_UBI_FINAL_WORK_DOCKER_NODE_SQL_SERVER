import "../config/passport";
import "dotenv/config";
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import ErrorHandler from "../utils/Classes/ErrorHandler";
import TEXTS from "../utils/Texts";

class PassportController {
  public signWithLocalStrategy(req, res, next) {
    return passport.authenticate("sign", async (err, user, info) => {
      if (err || !user) {
        return ErrorHandler.Unauthorized(err, TEXTS.error.WRONG_USER, next);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) {
          return next(error);
        }

        const body = { id: user.id, email: user.email, role: user.role };
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

        return res.json({ token });
      });
    })(req, res, next);
  }

  public signup(req, res, next) {
    return passport.authenticate(
      "signup",
      { session: false },
      async (err, user, info) => {
        console.log(22222, err, user, info);
        if (err || !user) {
          return ErrorHandler.Unauthorized(err, TEXTS.error.SIGNUP_FAIL, next);
        }

        return res.json({
          message: TEXTS.success.USER_CREATED,
        });
      }
    )(req, res, next);
  }
}

export default PassportController;
