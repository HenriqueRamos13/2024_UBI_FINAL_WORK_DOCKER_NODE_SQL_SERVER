import { Request, Response, Router, NextFunction } from "express";
import METHOD from "../enums/methods.enum";
import "reflect-metadata";
import "dotenv/config";

interface RouteConfigProps {
  method: METHOD;
  path: string;
  id?: number;
}

const route = Router();

function routeConfig({
  method,
  path,
  id = 1,
}: RouteConfigProps): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    if (id !== Number(process.env.MICROSSERVICE_ID)) {
      return;
    }

    console.log(`Configuring route ${method} ${path}`);
    // Modificação para passar um objeto unificado para a função original
    const response = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const args = {
        req,
        res,
        next,
        query: req.query,
        body: req.body,
        params: req.params,
        user: req.user,
        noToken: req.noToken,
      };

      try {
        const original = await descriptor.value(args);
        if (original !== undefined) {
          res.status(200).json(original);
        } else {
          next();
        }
      } catch (error: any) {
        next(error);
      }
    };

    // Registrando o handler modificado na rota especificada
    route[method](path, response);

    // Adicionando metadados para o Swagger
    const swaggerMetadata =
      Reflect.getMetadata("swagger", target.constructor) || [];
    swaggerMetadata.push({ method, path, handler: descriptor.value });
    Reflect.defineMetadata("swagger", swaggerMetadata, target.constructor);
  };
}

export { route, routeConfig };
