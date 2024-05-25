import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { RequestParams } from "../types";
import DB from "../config/db/SimpleSqlServer";
import ErrorHandler from "../utils/Classes/ErrorHandler";
import { Roles } from "../utils/decorators/Roles.decorator";

const CONTROLLER_MICROSSERVICE_ID = 1;

class KeywordsController {
  @routeConfig({
    method: METHOD.GET,
    path: "/keywords/:id?",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async get({ req, res, next }: RequestParams): Promise<void> {
    const { id } = req.params;
    const pool = await DB();

    try {
      if (id) {
        const result = await pool
          .request()
          .input("id", id)
          .query(`SELECT * FROM keywords WHERE id = @id`);

        if (result.recordset.length === 0) {
          return ErrorHandler.Unauthorized(
            "Keyword not found",
            "Keyword not found",
            next
          );
        }

        res.json({ keyword: result.recordset[0] });
      } else {
        const result = await pool.request().query(`SELECT * FROM keywords`);
        res.json({ keywords: result.recordset });
      }
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error fetching keywords",
        "Error fetching keywords",
        next
      );
    } finally {
      await pool.close();
    }
  }

  @routeConfig({
    method: METHOD.POST,
    path: "/keywords",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async post({ req, res, next }: RequestParams): Promise<void> {
    const { name } = req.body;
    const pool = await DB();

    try {
      const keywordResult = await pool
        .request()
        .input("name", name)
        .query("INSERT INTO keywords (name) OUTPUT inserted.* VALUES (@name)");

      res.status(201).json({ keyword: keywordResult.recordset[0] });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error creating keyword",
        "Error creating keyword",
        next
      );
    } finally {
      await pool.close();
    }
  }

  @routeConfig({
    method: METHOD.PUT,
    path: "/keywords/:id",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async put({ req, res, next }: RequestParams): Promise<void> {
    const { id } = req.params;
    const { name } = req.body;
    const pool = await DB();

    try {
      const result = await pool
        .request()
        .input("id", id)
        .input("name", name)
        .query(
          "UPDATE keywords SET name = @name OUTPUT inserted.* WHERE id = @id"
        );

      if (result.recordset.length === 0) {
        return ErrorHandler.Unauthorized(
          "Keyword not found",
          "Keyword not found",
          next
        );
      }

      res.json({ keyword: result.recordset[0] });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error updating keyword",
        "Error updating keyword",
        next
      );
    } finally {
      await pool.close();
    }
  }

  @routeConfig({
    method: METHOD.PATCH,
    path: "/keywords/:id",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async patch({ req, res, next }: RequestParams): Promise<void> {
    const { id } = req.params;
    const { name } = req.body;
    const pool = await DB();

    try {
      const result = await pool
        .request()
        .input("id", id)
        .input("name", name)
        .query(
          "UPDATE keywords SET name = @name OUTPUT inserted.* WHERE id = @id"
        );

      if (result.recordset.length === 0) {
        return ErrorHandler.Unauthorized(
          "Keyword not found",
          "Keyword not found",
          next
        );
      }

      res.json({ keyword: result.recordset[0] });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error updating keyword",
        "Error updating keyword",
        next
      );
    } finally {
      await pool.close();
    }
  }

  @routeConfig({
    method: METHOD.DELETE,
    path: "/keywords/:id",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async delete({ req, res, next }: RequestParams): Promise<void> {
    const { id } = req.params;
    const pool = await DB();

    try {
      const result = await pool
        .request()
        .input("id", id)
        .query("DELETE FROM keywords WHERE id = @id");

      if (result.rowsAffected[0] === 0) {
        return ErrorHandler.Unauthorized(
          "Keyword not found",
          "Keyword not found",
          next
        );
      }

      res.json({ message: "Keyword deleted" });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error deleting keyword",
        "Error deleting keyword",
        next
      );
    } finally {
      await pool.close();
    }
  }
}

export default KeywordsController;
