const { check } = require("express-validator");

exports.createUserValidator = [
  check("firstName")
    .exists()
    .withMessage("First name is required")
    .notEmpty()
    .withMessage("First name is required"),
  check("lastName")
    .exists()
    .withMessage("Last name is required")
    .notEmpty()
    .withMessage("Last name is required"),
  check("email")
    .exists()
    .withMessage("Email is required")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  check("phoneNumber")
    .exists()
    .withMessage("Phone number is required")
    .notEmpty()
    .withMessage("Phone number is required"),
  check("password")
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters in length"),
  check("confirmPassword")
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords don't match"),
];
