const HttpException = require("../utilities/httpException");
const passport = require("passport");
const logger = require("../config/winston").get();

const auth = () => {
  return async function (req, res, next) {
    try {
      return passport.authenticate(
        "jwt",
        { session: false },
        function (err, user, info) {
          if (!user) {
            throw new HttpException(401, "Authentication failed!", { info });
          }

          req.currentUser = user;
          next();
        }
      )(req, res, next);
    } catch (err) {
      logger.error("Login failed: %s", err);
      err.status = 401;
      next(err);
    }
  };
};

module.exports = auth;
