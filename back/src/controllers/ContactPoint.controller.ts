import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { RequestParams } from "../types";
import DB from "../config/db/SimpleSqlServer";
import ErrorHandler from "../utils/Classes/ErrorHandler";
import { Roles } from "../utils/decorators/Roles.decorator";

const CONTROLLER_MICROSSERVICE_ID = 1;

class ContactPointController {
  /**
   * @swagger
   * /contactpoint/{entityId}:
   *   get:
   *     summary: Retrieve contact points for a specific entity
   *     parameters:
   *       - in: path
   *         name: entityId
   *         required: true
   *         schema:
   *           type: string
   *         description: The entity ID
   *     responses:
   *       200:
   *         description: A list of contact points
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   role:
   *                     type: string
   *                   name:
   *                     type: string
   *                   email:
   *                     type: string
   *                   phone:
   *                     type: string
   *                   designation:
   *                     type: string
   */
  @routeConfig({
    method: METHOD.GET,
    path: "/contactpoint/:entityId",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async get({ req, res, next }: RequestParams): Promise<void> {
    const { entityId } = req.params;
    const pool = await DB();

    try {
      const result = await pool.request().input("entityId", entityId).query(`
          SELECT cp.id, cp.role, cpi.name, cpi.email, cpi.phone, cpi.designation
          FROM contact_point cp
          JOIN entity_contact_points ecp ON cp.id = ecp.contactPointId
          JOIN contact_point_info cpi ON cp.id = cpi.contactPointId
          WHERE ecp.entityId = @entityId
        `);

      if (result.recordset.length === 0) {
        return ErrorHandler.Unauthorized(
          "No contact points found for the specified entity",
          "Error deleting contact point",
          next
        );
      }

      res.json({ contactPoints: result.recordset });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error retrieving contact points",
        "Error deleting contact point",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /contactpoint:
   *   post:
   *     summary: Create a new contact point
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               entityId:
   *                 type: string
   *               role:
   *                 type: string
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *               designation:
   *                 type: string
   *             required:
   *               - entityId
   *               - role
   *               - name
   *               - email
   *     responses:
   *       201:
   *         description: The created contact point
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 role:
   *                   type: string
   *                 name:
   *                   type: string
   *                 email:
   *                   type: string
   *                 phone:
   *                   type: string
   *                 designation:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.POST,
    path: "/contactpoint",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async post({ req, res, next }: RequestParams): Promise<void> {
    const { entityId, role, name, email, phone, designation } = req.body;
    const pool = await DB();

    try {
      const result = await pool.request().input("role", role).query(`
          INSERT INTO contact_point (role)
          OUTPUT inserted.*
          VALUES (@role)
        `);

      const contactPointId = result.recordset[0].id;

      await pool
        .request()
        .input("entityId", entityId)
        .input("contactPointId", contactPointId).query(`
          INSERT INTO entity_contact_points (entityId, contactPointId)
          VALUES (@entityId, @contactPointId)
        `);

      const contactPointInfo = await pool
        .request()
        .input("contactPointId", contactPointId)
        .input("name", name)
        .input("email", email)
        .input("phone", phone)
        .input("designation", designation).query(`
          INSERT INTO contact_point_info (contactPointId, name, email, phone, designation)
          OUTPUT inserted.*
          VALUES (@contactPointId, @name, @email, @phone, @designation)
        `);

      res.status(201).json({ contactPoint: contactPointInfo.recordset[0] });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error creating contact point",
        "Error deleting contact point",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /contactpoint/{id}:
   *   put:
   *     summary: Update an existing contact point
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The contact point ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               role:
   *                 type: string
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *               designation:
   *                 type: string
   *     responses:
   *       200:
   *         description: The updated contact point
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 role:
   *                   type: string
   *                 name:
   *                   type: string
   *                 email:
   *                   type: string
   *                 phone:
   *                   type: string
   *                 designation:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.PUT,
    path: "/contactpoint/:id",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async put({ req, res, next }: RequestParams): Promise<void> {
    const { id } = req.params;
    const { role, name, email, phone, designation } = req.body;
    const pool = await DB();

    try {
      const contactPoint = await pool
        .request()
        .input("id", id)
        .input("role", role).query(`
          UPDATE contact_point
          SET role = @role
          OUTPUT inserted.*
          WHERE id = @id
        `);

      const contactPointInfo = await pool
        .request()
        .input("contactPointId", id)
        .input("name", name)
        .input("email", email)
        .input("phone", phone)
        .input("designation", designation).query(`
          UPDATE contact_point_info
          SET name = @name, email = @email, phone = @phone, designation = @designation
          OUTPUT inserted.*
          WHERE contactPointId = @contactPointId
        `);

      res.json({ contactPoint: contactPointInfo.recordset[0] });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error updating contact point",
        "Error deleting contact point",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /contactpoint/{id}:
   *   patch:
   *     summary: Partially update an existing contact point
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The contact point ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               role:
   *                 type: string
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *               designation:
   *                 type: string
   *     responses:
   *       200:
   *         description: The updated contact point
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 role:
   *                   type: string
   *                 name:
   *                   type: string
   *                 email:
   *                   type: string
   *                 phone:
   *                   type: string
   *                 designation:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.PATCH,
    path: "/contactpoint/:id",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async patch({ req, res, next }: RequestParams): Promise<void> {
    const { id } = req.params;
    const { role, name, email, phone, designation } = req.body;
    const pool = await DB();

    try {
      const contactPoint = await pool
        .request()
        .input("id", id)
        .input("role", role).query(`
          UPDATE contact_point
          SET role = COALESCE(@role, role)
          OUTPUT inserted.*
          WHERE id = @id
        `);

      const contactPointInfo = await pool
        .request()
        .input("contactPointId", id)
        .input("name", name)
        .input("email", email)
        .input("phone", phone)
        .input("designation", designation).query(`
          UPDATE contact_point_info
          SET name = COALESCE(@name, name), email = COALESCE(@email, email), phone = COALESCE(@phone, phone), designation = COALESCE(@designation, designation)
          OUTPUT inserted.*
          WHERE contactPointId = @contactPointId
        `);

      res.json({ contactPoint: contactPointInfo.recordset[0] });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error updating contact point",
        "Error deleting contact point",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /contactpoint/{id}:
   *   delete:
   *     summary: Delete an existing contact point
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The contact point ID
   *     responses:
   *       200:
   *         description: The deleted contact point
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
    path: "/contactpoint/:id",
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
        .query("DELETE FROM contact_point WHERE id = @id");

      res.json({ message: "Contact point deleted" });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error deleting contact point",
        "Error deleting contact point",
        next
      );
    } finally {
      await pool.close();
    }
  }
}

export default ContactPointController;
