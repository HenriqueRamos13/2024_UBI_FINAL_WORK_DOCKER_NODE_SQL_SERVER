import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { RequestParams } from "../types";
import DB from "../config/db/SimpleSqlServer";
import ErrorHandler from "../utils/Classes/ErrorHandler";
import { Roles } from "../utils/decorators/Roles.decorator";

const CONTROLLER_MICROSSERVICE_ID = 1;

class CompanyController {
  /**
   * @swagger
   * /company/{id}:
   *   get:
   *     summary: Retrieve a company by ID or list all companies
   *     parameters:
   *       - in: path
   *         name: id
   *         required: false
   *         schema:
   *           type: string
   *         description: The company ID
   *         default: all
   *     responses:
   *       200:
   *         description: A list of companies or a single company
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 company:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     name:
   *                       type: string
   *                 companies:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       name:
   *                         type: string
   */
  @routeConfig({
    method: METHOD.GET,
    path: "/company/:id?",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async get({ req, res, next }: RequestParams): Promise<void> {
    const { id } = req.params;
    const pool = await DB();

    try {
      if (id !== "all") {
        const company = await pool
          .request()
          .input("id", id)
          .query("SELECT * FROM company WHERE id = @id");

        if (company.recordset.length === 0) {
          return ErrorHandler.Unauthorized(
            "Company not found",
            "Company not found",
            next
          );
        }

        res.json({ company: company.recordset[0] });
      } else {
        const companies = await pool.request().query("SELECT * FROM company");

        res.json({ companies: companies.recordset });
      }
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error fetching company",
        "Error fetching company",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /company/{id}:
   *   put:
   *     summary: Update an existing company
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The company ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: The updated company
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.PUT,
    path: "/company/:id",
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
        .query("UPDATE company SET name = @name WHERE id = @id");

      if (result.rowsAffected[0] === 0) {
        return ErrorHandler.Unauthorized(
          "Error updating company",
          "Company not found",
          next
        );
      }

      res.json({ message: "Company updated" });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error updating company",
        "Error updating company",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /company/{id}:
   *   patch:
   *     summary: Partially update an existing company
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The company ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: The updated company
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.PATCH,
    path: "/company/:id",
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
        .query("UPDATE company SET name = @name WHERE id = @id");

      if (result.rowsAffected[0] === 0) {
        return ErrorHandler.Unauthorized(
          "Error updating company",
          "Company not found",
          next
        );
      }

      res.json({ message: "Company updated" });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error updating company",
        "Error updating company",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /company/{id}:
   *   delete:
   *     summary: Delete a company
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The company ID
   *     responses:
   *       200:
   *         description: The deleted company
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.DELETE,
    path: "/company/:id",
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
        .query("DELETE FROM company WHERE id = @id");

      if (result.rowsAffected[0] === 0) {
        return ErrorHandler.Unauthorized(
          "Error deleting company",
          "Company not found",
          next
        );
      }

      res.json({ message: "Company deleted" });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error deleting company",
        "Error deleting company",
        next
      );
    } finally {
      await pool.close();
    }
  }
}

export default CompanyController;
