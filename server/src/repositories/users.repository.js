/**
 * @description
 *
 * Repository for public.users table
 */
"use strict";

const logger = require("../config/winston").get();
const database = require("../config/database");
const User = require("../models/user.model");

/**
 * findUserById
 *
 * @param {Number} id
 */
module.exports.findUserById = async function findUserById(id) {
  try {
    const result = await database.get().func("public.find_user_by_id", [id]);

    if (result.length === 0) {
      return {};
    }

    return User.mapFromRow(result[0]);
  } catch (err) {
    logger.error(err);
    return {};
  }
};

/**
 * findUserByEmail
 *
 * @param {String} email
 */
module.exports.findUserByEmail = async function findUserByEmail(email) {
  try {
    const result = await database
      .get()
      .func("public.find_user_by_email", [email]);

    if (result.length === 0) {
      return {};
    }

    return User.mapFromRow(result[0]);
  } catch (err) {
    logger.error(err);
    return {};
  }
};

/**
 * createUser
 *
 * @param {User} user
 */
module.exports.createUser = async function createUser(user) {
  try {
    const result = await database
      .get()
      .func("public.create_user", [
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.phoneNumber,
      ]);

    if (result.length == 0) {
      logger.error("[Error] No response from DB");
      return { status: "error", message: "No response" };
    }

    return result[0];
  } catch (err) {
    logger.error(err);
    return { status: "error", message: err };
  }
};
