import * as passport from "passport";
import { Strategy } from "passport-local";
import * as bcrypt from "bcryptjs";
import TEXTS from "../utils/Texts";
import DB from "./db/SimpleSqlServer";

const userFields = {
  usernameField: "email",
  passwordField: "password",
};

passport.use(
  "signup",
  new Strategy(userFields, async (email, password, done) => {
    try {
      const pool = await DB();

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
          `INSERT INTO [user] (email, password, role, name) VALUES ('${email}', '${hash}', 'user', '${
            email.split("@")[0]
          }')`
        );

      console.log(1111, newUser);

      await pool.close();

      return done(null, { email, password });
    } catch (error) {
      console.log(111111, error);
      done(error);
    }
  })
);

passport.use(
  "sign",
  new Strategy(userFields, async (email, password, done) => {
    try {
      const pool = await DB();

      const user = await pool
        .request()
        .query(`SELECT * FROM [user] WHERE email = '${email}'`);

      if (user.recordset.length === 0)
        return done(TEXTS.error.WRONG_USER, false, {
          message: TEXTS.error.WRONG_USER,
        });

      if (!bcrypt.compareSync(password, user.recordset[0].password))
        return done(TEXTS.error.WRONG_PASSWORD, false, {
          message: TEXTS.error.WRONG_PASSWORD,
        });

      await pool.close();

      return done(null, user.recordset[0], {
        message: TEXTS.success.SUCCESS_LOGIN,
      });
    } catch (error) {
      return done(error);
    }
  })
);
