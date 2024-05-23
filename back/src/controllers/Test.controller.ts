import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import "dotenv/config";
import { RequestParams } from "../types";
import { Roles } from "../utils/decorators/Roles.decorator";
import { Role } from "../utils/enums/Roles.enum";

const CONTROLLER_MICROSSSERVICE_ID = 1;

class TestController {
  /**
   * @swagger
   * /test:
   *   get:
   *     summary: Test endpoint
   *     responses:
   *       200:
   *         description: A successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  @routeConfig({
    method: METHOD.GET,
    path: "/test",
    id: CONTROLLER_MICROSSSERVICE_ID,
  })
  @Roles(Role.USER, Role.ADMIN)
  public get({ req, res, user, noToken }: RequestParams): void {
    res.json({
      message: "GET",
    });
  }
}

export default TestController;
