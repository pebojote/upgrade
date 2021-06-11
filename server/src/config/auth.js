/**
 * @description
 *
 * Passport configuration for Local Strategy
 */
"use strict";

const logger = require("./winston").get();
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const jwtStrategy = require("passport-jwt").Strategy;
const usersRepository = require("../repositories/users.repository");

module.exports = (app, config) => {
  logger.info("Configuring authentication middlewares...");

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    usersRepository.findUserById(id).then((user) => {
      if (!user) {
        return done(null, null);
      }

      if (user.status == "inactive") {
        return done(null, null);
      }

      done(null, user);
    });
  });

  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function localLogin(req, email, password, done) {
        usersRepository.findUserByEmail(email).then((user) => {
          if (!user) {
            return done(null, null, {
              status: "error",
              message: "Account does not exist.",
              email,
            });
          }

          if (user.status != "active") {
            return done(null, user, {
              status: "warn",
              message: "Your account is disabled.",
              email,
            });
          }

          if (!user.validatePassword(password)) {
            return done(null, user, {
              status: "warn",
              message: "Incorrect password",
              email,
            });
          }

          done(null, user, {
            status: "success",
            message: "Login successful",
          });
        });
      }
    )
  );

  var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
      token = req.cookies[config.jwt.name];
    }
    return token;
  };

  passport.use(
    new jwtStrategy(
      {
        secretOrKey: config.jwt.secret,
        jwtFromRequest: cookieExtractor,
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (err) {
          done(error);
        }
      }
    )
  );
};
