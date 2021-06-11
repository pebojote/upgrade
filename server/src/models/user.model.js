/**
 * @description
 * User Class (Model)
 */
"use strict";

const bcrypt = require("bcryptjs");

class User {
  constructor(data) {
    data = data || {};
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;
    this.phoneNumber = data.phoneNumber;
    this.status = data.status;
    this.phoneVerified = data.phoneVerified;
    this.emailVerified = data.emailVerified;
    this.activationCode = data.activationCode;
  }

  validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  static mapFromRow(row) {
    if (!row) {
      return null;
    }

    return new User({
      id: row["id"],
      firstName: row["first_name"],
      lastName: row["last_name"],
      email: row["email"],
      password: row["password"],
      phoneNumber: row["phone_number"],
      status: row["status"],
      phoneVerified: row["phone_verified"],
      emailVerified: row["email_verified"],
      activationCode: row["activation_code"],
    });
  }
}

module.exports = User;
