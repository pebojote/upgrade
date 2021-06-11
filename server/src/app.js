/**
 * @description
 *
 * The entry point of the backend service
 * for Core Courses
 */
"use strict";
const express = require("express");
const app = express();
const env = process.env.NODE_ENV || "development";
const config = require("./config/config")[env];

const winston = require("./config/winston");
winston.init(config.logging.level);
const logger = winston.get();

const http = require("http").Server(app);
const database = require("./config/database");
const cache = require("./config/cache");

process.on("uncaughtException", (err) => {
  logger.error(err);
});

if (!config) {
  logger.error("Unknown environment config: %s", env);
  process.exit(-1);
}

logger.info("Setting up environment for: %s", env);
const port = config.PORT || "8888";

database.init(config, () => {
  cache.init(config, () => {
    require("./config/middleware")(app, config);
    require("./config/auth")(app, config);
    require("./config/routes")(app, config);
    http.listen(port, () => {
      logger.info("App listening to port: %s", port);
    });
  });
});
