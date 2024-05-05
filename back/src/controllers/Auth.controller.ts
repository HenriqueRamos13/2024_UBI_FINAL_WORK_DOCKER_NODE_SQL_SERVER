import { Request, Response } from "express";
import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import PassportController from "./Passport.controller";
import { Public } from "../utils/decorators/Public.decorator";

class AuthController {
  @routeConfig({
    method: METHOD.POST,
    path: "/auth",
  })
  @Public()
  public post(req: Request, res: Response, next): void {
    return new PassportController().signup(req, res, next);
  }

  @routeConfig({
    method: METHOD.DELETE,
    path: "/auth",
  })
  public delete(req: Request, res: Response): void {
    res.json({
      message: "DELETE",
    });
  }
}

export default AuthController;
