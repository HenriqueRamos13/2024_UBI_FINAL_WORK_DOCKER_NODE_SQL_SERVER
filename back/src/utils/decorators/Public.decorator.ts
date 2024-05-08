import { RequestParams } from "../../types";
import ErrorHandler from "../Classes/ErrorHandler";

export function Public(blockAuthUsers = false) {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value;

    descriptor.value = function (args: RequestParams) {
      const { req, next } = args;

      if (req?.noToken) return original.apply(this, [args]);

      if (blockAuthUsers) {
        return ErrorHandler.Unauthorized(
          new Error(
            "User not authorized to access this resource - Public Decorator"
          ),
          "Ocorreu um erro ao verificar seu token de acesso. Faça logout ou tente novamente.",
          next
        );
      }

      return original.apply(this, [args]);
    };
  };
}
