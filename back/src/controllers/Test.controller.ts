import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import "dotenv/config";
import { RequestParams } from "../types";
import { Roles } from "../utils/decorators/Roles.decorator";
import { Role } from "../utils/enums/Roles.enum";

const CONTROLLER_MICROSSSERVICE_ID = 1;

class TestController {
  @routeConfig({
    method: METHOD.GET,
    path: "/test",
    id: CONTROLLER_MICROSSSERVICE_ID,
  })
  @Roles(Role.USER)
  public get({ req, res, user, noToken }: RequestParams): void {
    res.json({
      message: "GET",
    });
  }
}

export default TestController;
