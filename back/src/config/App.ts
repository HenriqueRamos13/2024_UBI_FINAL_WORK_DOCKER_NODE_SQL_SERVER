import "reflect-metadata";
import { setupSwagger } from "../swagger";
import express = require("express");
import bodyParser = require("body-parser");
import cors = require("cors");
import hpp = require("hpp");
// import xss = require("xss-clean");
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { AuthMiddleware } from "../utils/middlewares/auth";
import TEXTS from "../utils/Texts";
import "dotenv/config";
import { route } from "../utils/decorators/Route.decorator";
import SqlServer from "./db/SqlServer";
import { Sanitize } from "../utils/functions/sanitize";
import cookieParser = require("cookie-parser");

import TestController from "../controllers/Test.controller";
import AuthController from "../controllers/Auth.controller";
import UserController from "../controllers/User.controller";
import UserProjectsController from "../controllers/UserProjects.controller";
import DroneController from "../controllers/Drone.controller";
import DronePartsController from "../controllers/DroneParts.controller";
import DroneHasPartsController from "../controllers/DroneHasParts.controller";
import CompanyController from "../controllers/Company.controller";

class App {
  public app: any;
  private corsWhitelist: string | string[] = [
    "http://front:3000",
    "http://front-service:3000",
  ];

  constructor() {
    console.log("Starting server...");

    this.app = express();
    this.config();
    this.connectDatabases();
    this.securityConfig();
    this.configureCustomMiddlewares();
    this.configRoutes();
  }

  private connectDatabases(): void {
    console.log("Connecting to databases...");

    new SqlServer(this.app);
  }

  private configRoutes(): void {
    console.log("Configuring routes...");

    new TestController();
    new AuthController();
    new UserController();
    new UserProjectsController();
    new DroneController();
    new DronePartsController();
    new DroneHasPartsController();
    new CompanyController();

    this.app.use(route);
    setupSwagger(this.app);
    this.app.use((err, req, res, next) => {
      const status = err.status || 500;
      const message = err.message || "Something went wrong!";
      res.status(status).json({
        message: message,
        ...(process.env.LOG_REAL_ERRORS === "true" && {
          error: err.originalError,
        }),
      });
    });
  }

  private configureCors(): void {
    console.log("Configuring CORS...");

    this.app.use(
      cors({
        origin: this.corsWhitelist,
        credentials: true,
        allowedHeaders: "Content-Type, Accept, Origin, Timestamp",
        preflightContinue: false,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      })
    );
  }

  private async config(): Promise<void> {
    console.log("Configuring server...");

    this.configureCors();
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(cookieParser());
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: TEXTS.warning.TO_MUCH_REQUESTS,
      })
    );
  }

  private securityConfig(): void {
    console.log("Configuring security...");

    this.app.use(helmet());
    this.app.use(hpp());
    // this.app.use(xss());
  }

  public start(): void {
    this.app.listen(process.env.PORT || 3001, () =>
      console.log("Server started! on Port: " + (process.env.PORT || 3001))
    );
  }

  private configureCustomMiddlewares(): void {
    console.log("Configuring middlewares...");

    this.app.use(AuthMiddleware);

    this.app.use((req, res, next) => {
      Promise.all([
        Sanitize(req.body),
        Sanitize(req.params),
        Sanitize(req.query),
        Sanitize(req.headers),
      ]).then(([body, params, query, headers]) => {
        req.body = body;
        req.params = params as any;
        req.query = query as any;
        req.headers = headers as any;
        next();
      });
    });
  }
}

const app = new App();

export default app;
