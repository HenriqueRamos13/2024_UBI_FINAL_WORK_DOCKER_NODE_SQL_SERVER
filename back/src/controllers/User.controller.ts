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
    path: "/user/:id?",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles(Role.ADMIN, Role.USER, Role.PROJECT_CREATOR)
  public async get({ req, res, next, user }: RequestParams): Promise<void> {
    const { id } = req.params;
    const pool = await DB();

    try {
      if (id) {
        const user = await pool
          .request()
          .input("id", id)
          .query("SELECT * FROM [User] WHERE id = @id");

        if (user.recordset.length === 0) {
          return ErrorHandler.Unauthorized(
            "User not found",
            "User not found",
            next
          );
        }

        res.json({
          user: {
            id: user.recordset[0].id,
            name: user.recordset[0].name,
            email: user.recordset[0].email,
            role: user.recordset[0].role,
          },
        });
      } else {
        const { id } = user;

        const users = await pool
          .request()
          .input("id", id)
          .query("SELECT * FROM [User] WHERE id = @id");

        res.json({
          user: {
            id: users.recordset[0].id,
            name: users.recordset[0].name,
            email: users.recordset[0].email,
            role: users.recordset[0].role,
          },
        });
      }
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "User not found",
        "User not found",
        next
      );
    } finally {
      await pool.close();
    }
  }

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
    path: "/user/:id?",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async put({ req, res, next, user }: RequestParams): Promise<void> {
    const { id } = req.params;
    const { name, password } = req.body;

    const pool = await DB();

    try {
      const salt = bcrypt.genSaltSync(14);
      const hash = bcrypt.hashSync(password, salt);

      if (id) {
        await pool
          .request()
          .input("id", id)
          .input("name", name)
          .input("password", hash)
          .query(
            "UPDATE [User] SET name = @name, password = @password WHERE id = @id"
          );
      } else {
        const { id } = user;

        await pool
          .request()
          .input("id", id)
          .input("name", name)
          .input("password", hash)
          .query(
            "UPDATE [User] SET name = @name, password = @password WHERE id = @id"
          );
      }

      res.json({ message: "User updated" });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error updating user",
        "Error updating user",
        next
      );
    } finally {
      await pool.close();
    }
  }

  @routeConfig({
    method: METHOD.DELETE,
    path: "/user",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async delete({ req, res, next, user }: RequestParams): Promise<void> {
    const { id } = user;

    const pool = await DB();

    try {
      await pool
        .request()
        .input("id", id)
        .query("DELETE FROM [User] WHERE id = @id");

      res.json({ message: "User deleted" });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error deleting user",
        "Error deleting user",
        next
      );
    } finally {
      await pool.close();
    }
  }
}

export default UserController;
