import { RequestParams } from "../../types";
import ErrorHandler from "../Classes/ErrorHandler";
import { Role } from "../enums/Roles.enum";

export function Roles(...roles: Role[]) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (args: RequestParams) {
      const { req, res, next } = args;

      if (!req.user) {
        return ErrorHandler.Unauthorized(
          new Error(
            "User not authorized to access this resource - Roles Decorator"
          ),
          "Você não tem permissão suficiente para acessar este recurso.",
          next
        );
      }

      const { role: userRole }: { role: Role } = req.user as any;

      if (userRole.length === 0 || !roles.includes(userRole)) {
        return ErrorHandler.Unauthorized(
          new Error(
            "User not authorized to access this resource - Roles Decorator"
          ),
          "Você não tem permissão suficiente para acessar este recurso.",
          next
        );
      }

      originalMethod.call(this, args);
    };
  };
}
