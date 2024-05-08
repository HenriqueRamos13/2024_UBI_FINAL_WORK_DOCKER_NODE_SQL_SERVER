import { Public } from "../utils/decorators/Public.decorator";
import PassportController from "./Passport.controller";
import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import { RequestParams } from "../types";

const CONTROLLER_MICROSSSERVICE_ID = 1;

class SessionController {
  @routeConfig({
    method: METHOD.POST,
    path: "/login",
    id: CONTROLLER_MICROSSSERVICE_ID,
  })
  @Public()
  public post({ req, res, next }: RequestParams): void {
    return new PassportController().signWithLocalStrategy(req, res, next);
  }
}

export default SessionController;
