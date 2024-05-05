import { Request, Response, Router, NextFunction } from "express";
import METHOD from "../enums/methods.enum";

interface RouteConfigProps {
  method: METHOD;
  path: string;
}

const route = Router();

function routeConfig({ method, path }: RouteConfigProps): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // Adicionando NextFunction ao handler da rota
    const response = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        // Chamando a função original e passando 'next' como argumento
        const original = await descriptor.value(req, res, next);
        if (original !== undefined) {
          res.status(200).json(original);
        }
        // Se 'original' não enviar uma resposta, não fazemos nada aqui
        // pois assumimos que 'next' foi chamado dentro de 'descriptor.value'
      } catch (error: any) {
        // Usando 'next' para passar erros para o middleware de erro
        next(error);
      }
    };

    // Registrando o handler na rota especificada
    route[method](path, response);
  };
}

export { route, routeConfig };
