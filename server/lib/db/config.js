const usersModel = require("./models/users.js");
const exampleModel = require("./models/example.js");

/**
 * This file is used to create the connection to the database using the knex module
 * http://knexjs.org/
 */
const sql = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "cwscheduleapp",
    password: "whateverpasswordyourdbuserhas",
    database: "cwscheduleapp"
  }
});

// Automatically create tables if they don't exist (add a second parameter set to true if you want to remove the previous table)
usersModel.create(sql, true);
exampleModel.create(sql, true);

module.exports = sql;
