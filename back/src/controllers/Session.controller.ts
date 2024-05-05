import { Request, Response } from "express";
import { Public } from "../utils/decorators/Public.decorator";
import PassportController from "./Passport.controller";
import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";

class SessionController {
  @routeConfig({
    method: METHOD.POST,
    path: "/login",
  })
  @Public()
  public post(req: Request, res: Response, next): void {
    return new PassportController().signWithLocalStrategy(req, res, next);
  }
}

export default SessionController;
