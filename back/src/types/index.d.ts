import { Role } from "../utils/enums/Roles.enum";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}
