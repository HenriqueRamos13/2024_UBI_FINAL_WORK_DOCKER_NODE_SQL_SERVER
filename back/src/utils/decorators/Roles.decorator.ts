import ErrorHandler from "../Classes/ErrorHandler";
import { Role } from "../enums/Roles.enum";
import { Request, Response, NextFunction } from "express";

export function Roles(...roles: Role[]) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      if (!req.user) {
        ErrorHandler.Unauthorized(
          new Error(
            "User not authorized to access this resource - Roles Decorator"
          ),
          "Você não tem permissão suficiente para acessar este recurso.",
          next
        );
        return;
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
        return;
      }

      originalMethod.call(this, req, res, next);
    };
  };
}
