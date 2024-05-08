import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { Public } from "../utils/decorators/Public.decorator";
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

  @routeConfig({
    method: METHOD.POST,
    path: "/test",
    id: CONTROLLER_MICROSSSERVICE_ID,
  })
  @Public()
  public post({ req, res }: RequestParams): void {
    res.json({
      message: "POST",
    });
  }

  @routeConfig({
    method: METHOD.PUT,
    path: "/test",
    id: CONTROLLER_MICROSSSERVICE_ID,
  })
  public put({ req, res }: RequestParams): void {
    res.json({
      message: "PUT",
    });
  }

  @routeConfig({
    method: METHOD.PATCH,
    path: "/test",
    id: CONTROLLER_MICROSSSERVICE_ID,
  })
  public patch({ req, res }: RequestParams): void {
    res.json({
      message: "PATCH",
    });
  }

  @routeConfig({
    method: METHOD.DELETE,
    path: "/test",
    id: CONTROLLER_MICROSSSERVICE_ID,
  })
  public delete({ req, res }: RequestParams): void {
    res.json({
      message: "DELETE",
    });
  }
}

export default TestController;
