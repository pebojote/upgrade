/**
 * @description
 * SQL script automation
 * - Run the build script
 */

"use strict";

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const dbConfig = require("../db.functions.json");
const pgp = require("pg-promise")();
const env = process.env.NODE_ENV || "development";
const config = require("../../src/config/config")[env];
const log = console.log;
const logErr = console.error;

execSql("Execute Drop Functions");

function execSql(name) {
  const db = pgp(config.database.connectionString);
  const buildScript = path.resolve(
    dbConfig.buildDir,
    "functions/drop_functions.sql"
  );

  fs.readFile(buildScript, { encoding: "utf-8" }, (err, content) => {
    if (err) {
      return logErr(chalk.red(`${name}: Read file error ${err.toString()}`));
    }
    runBuildScript(db, content, name);
  });
}

/**
 * Runs the build script in the database
 * @param {pgPromise} db
 * @param {string} content
 */
function runBuildScript(db, content, name) {
  db.query(content)
    .then((res) => {
      log(chalk.green(`${name}: SQL Execution has been successful`));
      pgp.end();
    })
    .catch((err) => {
      logErr(chalk.red(`${name}: Read file error ${err.toString()}`));
      pgp.end();
    });
}
