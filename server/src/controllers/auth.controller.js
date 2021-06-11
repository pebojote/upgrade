/**
 * @description
 *
 * auth.controller.js
 */
"use strict";

const logger = require("../config/winston").get();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const bcryptjs = require("bcryptjs");
const validationChecker = require("../utilities/validationChecker");
const usersRepository = require("../repositories/users.repository");
const User = require("../models/user.model");

module.exports.login = function login(req, res, next) {
  passport.authenticate("login", (err, user, info) => {
    if (err) {
      logger.error("Login failed: %s", err);
      return res.send({
        status: "error",
        message: err,
      });
    }

    if (!user) {
      logger.debug("Login failed: Unknown user: %s", info.email);
      return res.send({
        status: "error",
        message: info.message,
      });
    }

    if (info.status !== "success") {
      logger.debug("Login failed: %s", info.message);
      return res.send({
        status: "error",
        message: info.message,
      });
    }

    req.login(user, { session: false }, async (err) => {
      if (err) return next(err);

      const body = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      const token = jwt.sign({ user: body }, config.jwt.secret);

      res.cookie(config.jwt.name, token, {
        httpOnly: true,
        maxAge: config.jwt.maxAge,
      });

      return res.send({
        status: "success",
        message: info.message,
        store: user.name,
        name: user.contactPerson,
        id: user.id,
      });
    });
  })(req, res, next);
};

module.exports.getProfile = function getProfile(req, res, next) {
  return res.send(req.currentUser);
};

module.exports.logOut = function logOut(req, res, next) {
  res.clearCookie(config.jwt.name);

  return res.send({ result: "success", message: "Successfully logged out!" });
};

module.exports.createUser = function createUser(req, res, next) {
  validationChecker.validate(req);

  const body = req.body;
  const user = new User({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phoneNumber: body.phoneNumber,
    password: bcryptjs.hashSync(body.password),
  });

  usersRepository.createUser(user).then((response) => {
    if (response.status == "success") {
      return res.send({
        status: "success",
        userId: response.id,
        message: response.message,
      });
    } else {
      return res.send({ status: "error", message: response.message });
    }
  });
};
