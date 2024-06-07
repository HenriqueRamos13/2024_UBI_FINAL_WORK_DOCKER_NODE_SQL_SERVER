import * as swaggerJsdoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import { Express } from "express";
import "reflect-metadata";
import TestController from "./controllers/Test.controller";
import AuthController from "./controllers/Auth.controller";
import UserController from "./controllers/User.controller";
import UserProjectsController from "./controllers/UserProjects.controller";
import DroneController from "./controllers/Drone.controller";
import DronePartsController from "./controllers/DroneParts.controller";
import DroneHasPartsController from "./controllers/DroneHasParts.controller";
import CompanyController from "./controllers/Company.controller";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API Information",
      contact: {
        name: "Developer",
        email: "developer@example.com",
      },
      servers: [
        {
          url: "http://localhost:3001", // Update this to match the port mapping for your `back` service
        },
      ],
    },
  },
  apis: ["./src/controllers/*.ts"], // Adjust path as per your project structure
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

function generateSwaggerDocFromRoutes(app: Express) {
  const controllers = [
    TestController,
    AuthController,
    UserController,
    UserProjectsController,
    DroneController,
    DronePartsController,
    DroneHasPartsController,
    CompanyController,
  ];

  controllers.forEach((controller) => {
    const instance = new controller();
    const routes = Reflect.getMetadata("swagger", instance.constructor) || [];
    routes.forEach((route: any) => {
      const { method, path, handler } = route;
      // Add your Swagger JSDoc annotation logic here
      // For example, you could manually add routes to the swagger docs here
    });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

export function setupSwagger(app: Express) {
  generateSwaggerDocFromRoutes(app);
}
