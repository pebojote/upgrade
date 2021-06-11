/**
 * @description
 *
 * Logger Wrapper using Winston
 */
"use strict";

const winston = require("winston");
const moment = require("moment");
let logger = null;

module.exports.init = function init(level) {
  const dateFormat = "YYYY-MM-DD HH:mm:ss";

  logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.simple()
    ),
    transports: [
      new winston.transports.Console({
        name: "info-console",
        level: level || "info",
        colorize: true,
        timestamp: function () {
          return moment.utc().format(dateFormat);
        },
      }),
    ],
  });
  logger.info("Logging service started...");
};

module.exports.get = function get() {
  return logger;
};
