import * as mssql from "mssql";
import "dotenv/config";
import express = require("express");

class SqlServer {
  public app: express.Application;

  private config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: true, // change to true for local dev / self-signed certs
    },
  } as mssql.config;

  constructor(app: express.Application | null) {
    this.app = app;
    this.connect();
  }

  private async connect(): Promise<void> {
    const appPool = new mssql.ConnectionPool(this.config);

    console.log("mssqlServer connected");

    appPool
      .connect()
      .then((pool) => {
        this.app.locals.db = pool;
      })
      .catch((err) => {
        console.error("Error creating connection pool", err);
      });
  }
}

export const simpleDBConnection = async (): Promise<mssql.ConnectionPool> => {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: true, // change to true for local dev / self-signed certs
    },
  } as mssql.config;

  return await mssql.connect(config);
};

export default SqlServer;
