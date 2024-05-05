import { Request, Response } from "express";
import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { Public } from "../utils/decorators/Public.decorator";
import { Roles } from "../utils/decorators/Roles.decorator";
import { Role } from "../utils/enums/Roles.enum";

class TestController {
  @routeConfig({
    method: METHOD.GET,
    path: "/test",
  })
  @Roles(Role.USER)
  public get(req: Request, res: Response): void {
    res.json({
      message: "GET",
    });
  }

  @routeConfig({
    method: METHOD.POST,
    path: "/test",
  })
  @Public()
  public post(req: Request, res: Response, next): void {
    res.json({
      message: "POST",
    });
  }

  @routeConfig({
    method: METHOD.PUT,
    path: "/test",
  })
  public put(req: Request, res: Response): void {
    res.json({
      message: "PUT",
    });
  }

  @routeConfig({
    method: METHOD.PATCH,
    path: "/test",
  })
  public patch(req: Request, res: Response): void {
    res.json({
      message: "PATCH",
    });
  }

  @routeConfig({
    method: METHOD.DELETE,
    path: "/test",
  })
  public delete(req: Request, res: Response): void {
    res.json({
      message: "DELETE",
    });
  }
}

export default TestController;
