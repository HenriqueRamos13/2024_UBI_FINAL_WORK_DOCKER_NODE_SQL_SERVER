import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { Public } from "../utils/decorators/Public.decorator";
import { RequestParams } from "../types";

const CONTROLLER_MICROSSERVICE_ID = 1;

class DroneController {
  /**
   * @swagger
   * /drone:
   *   get:
   *     summary: Retrieve a list of drones
   *     responses:
   *       200:
   *         description: A list of drones
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   */
  @routeConfig({
    method: METHOD.GET,
    path: "/drone",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async get({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "GET" });
  }

  /**
   * @swagger
   * /drone:
   *   post:
   *     summary: Create a new drone
   *     parameters:
   *       - in: query
   *         name: owner
   *         required: true
   *         schema:
   *           type: string
   *         description: The owner of the drone
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
   *               name:
   *                 type: string
   *               model:
   *                 type: string
   *               serialNumber:
   *                 type: string
   *             required:
   *               - name
   *               - model
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
   *                 name:
   *                   type: string
   *                 model:
   *                   type: string
   *                 serialNumber:
   *                   type: string
   *                 owner:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.POST,
    path: "/drone",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async post({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "POST" });
  }

  @routeConfig({
    method: METHOD.PUT,
    path: "/drone",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async put({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "PUT" });
  }

  @routeConfig({
    method: METHOD.PATCH,
    path: "/drone",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async patch({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "PATCH" });
  }

  @routeConfig({
    method: METHOD.DELETE,
    path: "/drone",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async delete({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "DELETE" });
  }
}

export default DroneController;
