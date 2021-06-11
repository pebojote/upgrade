/**
 * @description
 *
 * auth.router.js
 */

const authController = require("../controllers/auth.controller");
const {
  createUserValidator,
} = require("../middlewares/validators/auth.validator");
const auth = require("../middlewares/auth.middleware");

/**
 * Set auth routes
 *
 * @param {Express} app
 */
module.exports = function setAuthRoutes(app) {
  app.post("/api/login", authController.login);
  app.post("/api/register", createUserValidator, authController.createUser);
  app.get("/api/profile", auth(), authController.getProfile);
  app.get("/api/logout", auth(), authController.logOut);
};
