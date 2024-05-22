import * as mssql from "mssql";
import "dotenv/config";

const DB = async (): Promise<mssql.ConnectionPool> => {
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

export default DB;
