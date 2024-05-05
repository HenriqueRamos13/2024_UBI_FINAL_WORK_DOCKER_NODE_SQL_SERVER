import ErrorHandler from "../Classes/ErrorHandler";

export function Public(blockAuthUsers = false) {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const request = args[0] as any;
      const next = args[2]; // Assumindo que next é o terceiro argumento

      if (request?.noToken) return original.apply(this, args);

      if (blockAuthUsers) {
        // Passando o erro através de next
        return ErrorHandler.Unauthorized(
          new Error(
            "User not authorized to access this resource - Public Decorator"
          ),
          "Ocorreu um erro ao verificar seu token de acesso. Faça logout ou tente novamente.",
          next
        );
      }

      return original.apply(this, args);
    };
  };
}
