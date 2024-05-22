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
      const { req, next } = args;

      if (!req.user) {
        ErrorHandler.Unauthorized(
          new Error(
            "User not authorized to access this resource - Roles Decorator"
          ),
          "Você não tem permissão suficiente para acessar este recurso.",
          next
        );
        return; // Return early to prevent further execution
      }

      const { role: userRole }: { role: Role } = req.user as any;

      if (userRole.length === 0 || !roles.includes(userRole)) {
        ErrorHandler.Unauthorized(
          new Error(
            "User not authorized to access this resource - Roles Decorator"
          ),
          "Você não tem permissão suficiente para acessar este recurso.",
          next
        );
        return; // Return early to prevent further execution
      }

      return originalMethod.call(this, args); // Ensure this is the only place the original method is called
    };
  };
}
