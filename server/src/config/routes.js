/**
 * @description
 *
 * Routes config
 */

const logger = require("./winston").get();
const HttpException = require("../utilities/httpException");
const errorMiddleware = require("../middlewares/error.middleware");

module.exports = function (app, config) {
  require("../routers/auth.router")(app);
  require("../routers/user.router")(app);

  app.all("*", (req, res, next) => {
    const err = new HttpException(404, "Endpoint not found");
    logger.error("Route error: Endpoint not found");
    next(err);
  });

  app.use(errorMiddleware);
};
