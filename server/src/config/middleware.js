/**
 * @description
 *
 * Express App config
 */
"use strict";

const logger = require("../config/winston").get();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const cache = require("./cache");
const RedisStore = require("connect-redis")(session);
const passport = require("passport");
const helmet = require("helmet");
const cors = require("cors");

module.exports = function initMiddleware(app, config) {
  logger.info("Initializing middleware");
  app.set("view cache", config.middleware.optimized);
  app.set("trust proxy", config.middleware.trustProxy);
  app.locals.pretty = config.middleware.optimized;

  app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
  app.use(bodyParser.json({ limit: "5mb" }));
  app.use(helmet());
  app.use(express.static(config.middleware.assets));
  app.use(cookieParser());
  app.use(
    session({
      name: config.session.name,
      secret: config.session.secret,
      store: new RedisStore({ client: cache.get() }),
      resave: false,
      cookie: { maxAge: config.session.maxAge },
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(
    morgan(
      ':remote-addr - [:date[clf]] ":method :url HTTP/:http-version" :status' +
        " :res[content-length] - :response-time"
    )
  );
  app.use(initializeModel);
  app.use(
    cors({
      credentials: true,
      origin: config.origin.host + ":" + config.origin.port,
    })
  );
  app.options("*", cors());

  function initializeModel(req, res, next) {
    const baseUrl = req.protocol + "://" + req.get("host");
    const ipAddress =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;
    req.model = {
      baseUrl,
      ipAddress,
      path: req.path,
      hasNavbar: true,
      bodyBackground: null,
      meta: {
        url: baseUrl + req.originalUrl,
        type: "website",
        title: "Core Creations, Inc. - Courses",
        description: "Core Creations, Inc.",
        siteName: "https://corecreations.ph",
      },
      user: req.user,
      verbose: config.middleware.verbose,
    };

    next();
  }

  function csurfError(err, req, res, next) {
    //if not csrf err, do next
    if (err.code !== "EBADCSRFTOKEN") {
      return next(err);
    }

    if (req.path.match(/^\/v1/)) {
      return next();
    }

    // handle CSRF token errors here
    req.model.title = "Forbidden";
    req.model.message = "Your submitted form has been tampered";
    logger.debug("Csurf error %s", err.toString());
    if (req.path.match(/^\/api/)) {
      return res.status(403).send({ status: "error", message: "Forbidden" });
    }
    res.status(403).render("errors/forbidden", req.model);
  }
};
