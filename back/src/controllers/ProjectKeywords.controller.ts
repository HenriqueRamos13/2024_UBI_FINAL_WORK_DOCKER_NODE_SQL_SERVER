import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { RequestParams } from "../types";
import DB from "../config/db/SimpleSqlServer";
import ErrorHandler from "../utils/Classes/ErrorHandler";
import { Roles } from "../utils/decorators/Roles.decorator";

const CONTROLLER_MICROSSERVICE_ID = 1;

class ProjectKeywordsController {
  @routeConfig({
    method: METHOD.GET,
    path: "/projectkeywords/:projectId?",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async get({ req, res, next }: RequestParams): Promise<void> {
    const { projectId } = req.params;
    const pool = await DB();

    try {
      const result = await pool
        .request()
        .input("projectId", projectId)
        .query(
          `SELECT pk.id, pk.projectId, pk.keywordId, k.name as keywordName
             FROM project_keywords pk
             JOIN keywords k ON pk.keywordId = k.id
             WHERE pk.projectId = @projectId`
        );
      res.json({ projectKeywords: result.recordset });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error fetching project keywords",
        "Error fetching project keywords",
        next
      );
    } finally {
      await pool.close();
    }
  }

  @routeConfig({
    method: METHOD.POST,
    path: "/projectkeywords",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async post({ req, res, next }: RequestParams): Promise<void> {
    const { projectId, keywordId } = req.body;
    const pool = await DB();

    try {
      const result = await pool
        .request()
        .input("projectId", projectId)
        .input("keywordId", keywordId)
        .query(
          "INSERT INTO project_keywords (id, projectId, keywordId) VALUES (NEWID(), @projectId, @keywordId) OUTPUT inserted.*"
        );

      res.status(201).json({ projectKeyword: result.recordset[0] });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error adding keyword to project",
        "Error adding keyword to project",
        next
      );
    } finally {
      await pool.close();
    }
  }

  @routeConfig({
    method: METHOD.PUT,
    path: "/projectkeywords/:id",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async put({ req, res, next }: RequestParams): Promise<void> {
    const { id } = req.params;
    const { projectId, keywordId } = req.body;
    const pool = await DB();

    try {
      const result = await pool
        .request()
        .input("id", id)
        .input("projectId", projectId)
        .input("keywordId", keywordId)
        .query(
          "UPDATE project_keywords SET projectId = @projectId, keywordId = @keywordId OUTPUT inserted.* WHERE id = @id"
        );

      if (result.recordset.length === 0) {
        return ErrorHandler.Unauthorized(
          "Project keyword not found",
          "Project keyword not found",
          next
        );
      }

      res.json({ projectKeyword: result.recordset[0] });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error updating project keyword",
        "Error updating project keyword",
        next
      );
    } finally {
      await pool.close();
    }
  }

  @routeConfig({
    method: METHOD.PATCH,
    path: "/projectkeywords/:id",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async patch({ req, res, next }: RequestParams): Promise<void> {
    const { id } = req.params;
    const { projectId, keywordId } = req.body;
    const pool = await DB();

    try {
      const result = await pool
        .request()
        .input("id", id)
        .input("projectId", projectId)
        .input("keywordId", keywordId)
        .query(
          "UPDATE project_keywords SET projectId = @projectId, keywordId = @keywordId OUTPUT inserted.* WHERE id = @id"
        );

      if (result.recordset.length === 0) {
        return ErrorHandler.Unauthorized(
          "Project keyword not found",
          "Project keyword not found",
          next
        );
      }

      res.json({ projectKeyword: result.recordset[0] });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error updating project keyword",
        "Error updating project keyword",
        next
      );
    } finally {
      await pool.close();
    }
  }

  @routeConfig({
    method: METHOD.DELETE,
    path: "/projectkeywords/:id",
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
        .query("DELETE FROM project_keywords WHERE id = @id");

      if (result.rowsAffected[0] === 0) {
        return ErrorHandler.Unauthorized(
          "Project keyword not found",
          "Project keyword not found",
          next
        );
      }

      res.json({ message: "Project keyword deleted" });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error deleting project keyword",
        "Error deleting project keyword",
        next
      );
    } finally {
      await pool.close();
    }
  }
}

export default ProjectKeywordsController;
