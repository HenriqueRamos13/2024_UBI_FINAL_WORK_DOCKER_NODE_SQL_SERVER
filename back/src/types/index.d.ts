import { Request, Response, NextFunction } from "express";
import { Role } from "../utils/enums/Roles.enum";

declare global {
  namespace Express {
    export interface Request {
      noToken?: boolean;
      user?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}

type RequestParams = {
  req: Request;
  res: Response;
  next: NextFunction;
  query: Request["query"];
  body: Request["body"];
  params: Request["params"];
  user: Request["user"];
  noToken: Request["noToken"];
};

export { RequestParams };
