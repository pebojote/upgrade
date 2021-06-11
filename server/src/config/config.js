/**
 * @description
 *
 * Configuration
 */
"use strict";

const path = require("path");
const rootPath = path.normalize(__dirname + "/../../");

module.exports = {
  development: {
    dialect: "postgres",
    database: {
      connectionString: process.env.CCC_DATABASE_URL || "postgres://postgres:adminpassword@localhost/core_courses?port=5432",
      dialect: "postgres",
    },
    cache: {
      host: process.env.CCC_REDIS_HOST,
      port: 6379,
      password: process.env.CCC_REDIS_KEY,
    },
    session: {
      name: "cccSessionId",
      secret: process.env.CCC_SESSION_SECRET || "abcdef123456",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
    jwt: {
      name: "cccToken",
      secret: process.env.CCC_JWT_SECRET || "abcdef123456",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
    logging: {
      level: "debug",
    },
    middleware: {
      assets: path.join(rootPath, "public"),
      verbose: true,
      optimized: false,
      trustProxy: false,
    },
    api: {
      url: process.env.CCC_API_URL,
    },
    origin: {
      url: process.env.CCC_API_ORIGIN,
    },
  },
};
