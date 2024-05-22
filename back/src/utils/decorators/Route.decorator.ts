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

    route[method](path, response);

    const existingSwaggerMetadata = Reflect.getMetadata(
      "swagger",
      target.constructor
    );
    if (existingSwaggerMetadata) {
      const swaggerMetadata = existingSwaggerMetadata || [];
      swaggerMetadata.push({ method, path, handler: descriptor.value });
      Reflect.defineMetadata("swagger", swaggerMetadata, target.constructor);
    }
  };
}

export { route, routeConfig };
