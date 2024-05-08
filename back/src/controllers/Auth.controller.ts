import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import PassportController from "./Passport.controller";
import { Public } from "../utils/decorators/Public.decorator";
import { RequestParams } from "../types";

const CONTROLLER_MICROSSSERVICE_ID = 1;

class AuthController {
  @routeConfig({
    method: METHOD.POST,
    path: "/auth",
    id: CONTROLLER_MICROSSSERVICE_ID,
  })
  @Public()
  public post({ req, res, next }: RequestParams): void {
    return new PassportController().signup(req, res, next);
  }
}

export default AuthController;
