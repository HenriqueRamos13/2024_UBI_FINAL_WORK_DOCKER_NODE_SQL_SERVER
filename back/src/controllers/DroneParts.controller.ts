import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { RequestParams } from "../types";
import DB from "../config/db/SimpleSqlServer";
import ErrorHandler from "../utils/Classes/ErrorHandler";
import { Roles } from "../utils/decorators/Roles.decorator";

const CONTROLLER_MICROSSERVICE_ID = 1;

class DronePartsController {
  /**
   * @swagger
   * /droneparts/{id}:
   *   get:
   *     summary: Retrieve drone parts by ID or all parts for the user's company
   *     parameters:
   *       - in: path
   *         name: id
   *         required: false
   *         schema:
   *           type: string
   *         description: The drone part ID
   *         default: all
   *     responses:
   *       200:
   *         description: A single drone part or a list of drone parts
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 quantity:
   *                   type: integer
   *                 companyId:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.GET,
    path: "/droneparts/:id?",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async get({ req, res, next, user }: RequestParams): Promise<void> {
    const { id } = req.params;
    const pool = await DB();

    try {
      if (id !== "all") {
        const result = await pool
          .request()
          .input("id", id)
          .query("SELECT * FROM drone_parts WHERE id = @id");

        if (result.recordset.length === 0) {
          return ErrorHandler.Unauthorized(
            "Drone part not found",
            "Error retrieving drone part",
            next
          );
        }

        res.json(result.recordset[0]);
      } else {
        const { companyId } = user;

        const result = await pool
          .request()
          .input("companyId", companyId)
          .query("SELECT * FROM drone_parts WHERE companyId = @companyId");

        res.json(result.recordset);
      }
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error retrieving drone parts",
        "Error retrieving drone parts",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /droneparts:
   *   post:
   *     summary: Create a new drone part
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               quantity:
   *                 type: integer
   *             required:
   *               - name
   *               - quantity
   *     responses:
   *       201:
   *         description: The created drone part
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 quantity:
   *                   type: integer
   *                 companyId:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.POST,
    path: "/droneparts",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async post({ req, res, next, user }: RequestParams): Promise<void> {
    const { name, quantity } = req.body;
    const { companyId } = user;
    const pool = await DB();

    try {
      const result = await pool
        .request()
        .input("name", name)
        .input("quantity", quantity)
        .input("companyId", companyId).query(`
          INSERT INTO drone_parts (name, quantity, companyId)
          OUTPUT inserted.*
          VALUES (@name, @quantity, @companyId)
        `);

      res.status(201).json(result.recordset[0]);
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error creating drone part",
        "Error creating drone part",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /droneparts/{id}:
   *   put:
   *     summary: Update an existing drone part
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The drone part ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               quantity:
   *                 type: integer
   *             required:
   *               - name
   *               - quantity
   *     responses:
   *       200:
   *         description: The updated drone part
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 quantity:
   *                   type: integer
   *                 companyId:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.PUT,
    path: "/droneparts/:id",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async put({ req, res, next, user }: RequestParams): Promise<void> {
    const { id } = req.params;
    const { name, quantity } = req.body;
    const { companyId } = user;
    const pool = await DB();

    try {
      const result = await pool
        .request()
        .input("id", id)
        .input("name", name)
        .input("quantity", quantity)
        .input("companyId", companyId).query(`
          UPDATE drone_parts
          SET name = @name, quantity = @quantity, companyId = @companyId
          OUTPUT inserted.*
          WHERE id = @id
        `);

      res.json(result.recordset[0]);
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error updating drone part",
        "Error updating drone part",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /droneparts/{id}:
   *   patch:
   *     summary: Partially update an existing drone part
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The drone part ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               quantity:
   *                 type: integer
   *     responses:
   *       200:
   *         description: The updated drone part
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 quantity:
   *                   type: integer
   *                 companyId:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.PATCH,
    path: "/droneparts/:id",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async patch({ req, res, next, user }: RequestParams): Promise<void> {
    const { id } = req.params;
    const { name, quantity } = req.body;
    const { companyId } = user;
    const pool = await DB();

    try {
      const result = await pool
        .request()
        .input("id", id)
        .input("name", name)
        .input("quantity", quantity)
        .input("companyId", companyId).query(`
          UPDATE drone_parts
          SET name = COALESCE(@name, name), quantity = COALESCE(@quantity, quantity), companyId = @companyId
          OUTPUT inserted.*
          WHERE id = @id
        `);

      res.json(result.recordset[0]);
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error updating drone part",
        "Error updating drone part",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /droneparts/{id}:
   *   delete:
   *     summary: Delete an existing drone part
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The drone part ID
   *     responses:
   *       200:
   *         description: The deleted drone part
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
    path: "/droneparts/:id",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async delete({ req, res, next }: RequestParams): Promise<void> {
    const { id } = req.params;
    const pool = await DB();

    try {
      await pool
        .request()
        .input("id", id)
        .query("DELETE FROM drone_parts WHERE id = @id");

      res.json({ message: "Drone part deleted" });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error deleting drone part",
        "Error deleting drone part",
        next
      );
    } finally {
      await pool.close();
    }
  }
}

export default DronePartsController;
