const { validationResult } = require("express-validator");
const HttpException = require("./httpException");

module.exports.validate = function validate(req) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpException(400, "Validation failed", errors);
  }

  return true;
};
