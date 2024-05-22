import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";

import { Public } from "../utils/decorators/Public.decorator";
import { RequestParams } from "../types";

const CONTROLLER_MICROSSERVICE_ID = 1;

class ProjectKeywordsController {
  @routeConfig({
    method: METHOD.GET,
    path: "/projectkeywords",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async get({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "GET" });
  }

  @routeConfig({
    method: METHOD.POST,
    path: "/projectkeywords",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async post({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "POST" });
  }

  @routeConfig({
    method: METHOD.PUT,
    path: "/projectkeywords",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async put({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "PUT" });
  }

  @routeConfig({
    method: METHOD.PATCH,
    path: "/projectkeywords",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async patch({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "PATCH" });
  }

  @routeConfig({
    method: METHOD.DELETE,
    path: "/projectkeywords",
    id: CONTROLLER_MICROSSERVICE_ID,
  })
  @Public()
  public async delete({ req, res, next }: RequestParams): Promise<void> {
    res.json({ message: "DELETE" });
  }
}

export default ProjectKeywordsController;
