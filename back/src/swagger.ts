import * as swaggerJsdoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import { Express } from "express";
import "reflect-metadata";
import DroneController from "./controllers/Drone.controller"; // Import all your controllers

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
    DroneController,
    // Add all your controllers here
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
