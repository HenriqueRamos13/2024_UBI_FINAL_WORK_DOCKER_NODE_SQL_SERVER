import * as swaggerJsdoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import { Express } from "express";
import "reflect-metadata";
import TestController from "./controllers/Test.controller";
import AuthController from "./controllers/Auth.controller";
import SessionController from "./controllers/Session.controller";
import UserController from "./controllers/User.controller";
import UserProjectsController from "./controllers/UserProjects.controller";
import ProjectController from "./controllers/Project.controller";
import ProjectInfosController from "./controllers/ProjectInfos.controller";
import ProjectInfoController from "./controllers/ProjectInfo.controller";
import ProjectKeywordsController from "./controllers/ProjectKeywords.controller";
import KeywordsController from "./controllers/Keywords.controller";
import ProjectScientificDomainsController from "./controllers/ProjectScientificDomains.controller";
import ScientificDomainController from "./controllers/ScientificDomain.controller";
import ProjectScientificAreasController from "./controllers/ProjectScientificAreas.controller";
import ScientificAreaController from "./controllers/ScientificArea.controller";
import EntityController from "./controllers/Entity.controller";
import EntityContactPointsController from "./controllers/EntityContactPoints.controller";
import ContactPointController from "./controllers/ContactPoint.controller";
import ContactPointInfoController from "./controllers/ContactPointInfo.controller";
import FundingController from "./controllers/Funding.controller";
import EntityFundingsController from "./controllers/EntityFundings.controller";
import ProgramController from "./controllers/Program.controller";
import ProgramsFundingsController from "./controllers/ProgramsFundings.controller";
import ProjectFundingsController from "./controllers/ProjectFundings.controller";
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
    SessionController,
    UserController,
    UserProjectsController,
    ProjectController,
    ProjectInfosController,
    ProjectInfoController,
    ProjectKeywordsController,
    KeywordsController,
    ProjectScientificDomainsController,
    ScientificDomainController,
    ProjectScientificAreasController,
    ScientificAreaController,
    EntityController,
    EntityContactPointsController,
    ContactPointController,
    ContactPointInfoController,
    FundingController,
    EntityFundingsController,
    ProgramController,
    ProgramsFundingsController,
    ProjectFundingsController,
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
