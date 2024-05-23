import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { RequestParams } from "../types";
import DB from "../config/db/SimpleSqlServer";
import ErrorHandler from "../utils/Classes/ErrorHandler";
import { Roles } from "../utils/decorators/Roles.decorator";

const CONTROLLER_MICROSSERVICE_ID = 1;

class DroneController {
  /**
   * @swagger
   * /drone/{id}:
   *   get:
   *     summary: Retrieve a list of drones or a single drone by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: false
   *         schema:
   *           type: string
   *         description: The drone ID
   *         default: all
   *     responses:
   *       200:
   *         description: A list of drones or a single drone
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 userId:
   *                   type: string
   *                 finish:
   *                   type: boolean
   *                 createdAt:
   *                   type: string
   *                   format: date
   *                 companyId:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.GET,
    path: "/drone/:id?",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async get({ req, res, next, user }: RequestParams): Promise<void> {
    const { id } = req.params;
    const { companyId, id: userId } = user;
    const pool = await DB();

    try {
      if (id !== "all") {
        const droneResult = await pool
          .request()
          .input("id", id)
          .input("companyId", companyId)
          .query(
            `SELECT d.*, dp.id as partId, dp.name as partName, dp.quantity as partQuantity
             FROM drone d
             LEFT JOIN drone_has_parts dhp ON d.id = dhp.droneId
             LEFT JOIN drone_parts dp ON dhp.partId = dp.id
             WHERE d.id = @id AND d.companyId = @companyId`
          );

        if (droneResult.recordset.length === 0) {
          return ErrorHandler.Unauthorized(
            "Drone not found",
            "Drone not found",
            next
          );
        }

        const drone = {
          id: droneResult.recordset[0].id,
          userId: droneResult.recordset[0].userId,
          finish: droneResult.recordset[0].finish,
          createdAt: droneResult.recordset[0].createdAt,
          companyId: droneResult.recordset[0].companyId,
          parts: droneResult.recordset
            .filter((row) => row.partId)
            .map((row) => ({
              id: row.partId,
              name: row.partName,
              quantity: row.partQuantity,
            })),
        };

        res.json({ drone });
      } else {
        const dronesResult = await pool
          .request()
          .input("companyId", companyId)
          .input("userId", userId)
          .query(
            `SELECT d.*, dp.id as partId, dp.name as partName, dp.quantity as partQuantity
             FROM drone d
             LEFT JOIN drone_has_parts dhp ON d.id = dhp.droneId
             LEFT JOIN drone_parts dp ON dhp.partId = dp.id
             WHERE d.companyId = @companyId AND d.userId = @userId`
          );

        const drones = dronesResult.recordset.reduce((acc, row) => {
          const existingDrone = acc.find((drone) => drone.id === row.id);
          const part = row.partId
            ? { id: row.partId, name: row.partName, quantity: row.partQuantity }
            : null;

          if (existingDrone) {
            if (part) existingDrone.parts.push(part);
          } else {
            acc.push({
              id: row.id,
              userId: row.userId,
              finish: row.finish,
              createdAt: row.createdAt,
              companyId: row.companyId,
              parts: part ? [part] : [],
            });
          }

          return acc;
        }, []);

        res.json({ drones });
      }
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error fetching drones",
        "Error fetching drones",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /drone:
   *   post:
   *     summary: Create a new drone
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               finish:
   *                 type: boolean
   *               createdAt:
   *                 type: string
   *                 format: date
   *     responses:
   *       201:
   *         description: The created drone
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 userId:
   *                   type: string
   *                 finish:
   *                   type: boolean
   *                 createdAt:
   *                   type: string
   *                   format: date
   *                 companyId:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.POST,
    path: "/drone",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async post({ req, res, next, user }: RequestParams): Promise<void> {
    const { finish, createdAt } = req.body;
    const { id: userId, companyId } = user;
    const pool = await DB();

    try {
      const newDrone = await pool
        .request()
        .input("userId", userId)
        .input("finish", finish)
        .input("createdAt", createdAt)
        .input("companyId", companyId)
        .query(
          "INSERT INTO drone (userId, finish, createdAt, companyId) OUTPUT inserted.* VALUES (@userId, @finish, @createdAt, @companyId)"
        );

      res.status(201).json({ drone: newDrone.recordset[0] });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error creating drone",
        "Error creating drone",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /drone/{id}:
   *   put:
   *     summary: Update an existing drone
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The drone ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               finish:
   *                 type: boolean
   *               partIds:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: The updated drone
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 finish:
   *                   type: boolean
   *                 partIds:
   *                   type: array
   *                   items:
   *                     type: string
   */
  @routeConfig({
    method: METHOD.PUT,
    path: "/drone/:id",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Roles()
  public async put({ req, res, next, user }: RequestParams): Promise<void> {
    const { id } = req.params;
    const { finish, partIds } = req.body;
    const { companyId } = user;
    const pool = await DB();

    try {
      const updatedDrone = await pool
        .request()
        .input("id", id)
        .input("finish", finish)
        .input("companyId", companyId)
        .query(
          "UPDATE drone SET finish = @finish, companyId = @companyId OUTPUT inserted.* WHERE id = @id"
        );

      if (updatedDrone.recordset.length === 0) {
        return ErrorHandler.Unauthorized(
          "Drone not found",
          "Drone not found",
          next
        );
      }

      // Recupera todas as partes atualmente associadas ao drone
      const currentPartsResult = await pool
        .request()
        .input("droneId", id)
        .query("SELECT partId FROM drone_has_parts WHERE droneId = @droneId");

      const currentPartIds = currentPartsResult.recordset.map(
        (row) => row.partId
      );

      // Partes a serem adicionadas e removidas
      const partsToAdd = partIds.filter(
        (partId) => !currentPartIds.includes(partId)
      );
      const partsToRemove = currentPartIds.filter(
        (partId) => !partIds.includes(partId)
      );

      // Adiciona novas partes
      for (const partId of partsToAdd) {
        await pool
          .request()
          .input("droneId", id)
          .input("partId", partId)
          .query(
            "IF NOT EXISTS (SELECT 1 FROM drone_has_parts WHERE droneId = @droneId AND partId = @partId) " +
              "INSERT INTO drone_has_parts (droneId, partId) VALUES (@droneId, @partId)"
          );
      }

      // Remove partes não mais associadas
      for (const partId of partsToRemove) {
        await pool
          .request()
          .input("droneId", id)
          .input("partId", partId)
          .query(
            "DELETE FROM drone_has_parts WHERE droneId = @droneId AND partId = @partId"
          );
      }

      res.json({ drone: updatedDrone.recordset[0] });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error updating drone",
        "Error updating drone",
        next
      );
    } finally {
      await pool.close();
    }
  }

  /**
   * @swagger
   * /drone/{id}:
   *   delete:
   *     summary: Delete a drone
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The drone ID
   *     responses:
   *       200:
   *         description: The deleted drone
   */
  @routeConfig({
    method: METHOD.DELETE,
    path: "/drone/:id",
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
        .query("DELETE FROM drone WHERE id = @id");

      if (result.rowsAffected[0] === 0) {
        return ErrorHandler.Unauthorized(
          "Error deleting drone",
          "Drone not found",
          next
        );
      }

      res.json({ message: "Drone deleted" });
    } catch (error) {
      return ErrorHandler.Unauthorized(
        "Error deleting drone",
        "Error deleting drone",
        next
      );
    } finally {
      await pool.close();
    }
  }
}

export default DroneController;
