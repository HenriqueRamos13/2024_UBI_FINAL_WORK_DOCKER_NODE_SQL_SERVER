import { NextFunction } from "express";
import "dotenv/config";

export default class ErrorHandler {
  public static Unauthorized(error: any, message: string, next: NextFunction) {
    process.env.LOG_REAL_ERRORS && console.log(error);

    const errorObject = new Error(message);
    errorObject["status"] = 401;
    if (process.env.LOG_REAL_ERRORS === "true") {
      errorObject["originalError"] = error;
    }

    next(errorObject);
  }
}
