/**
 * This file is used to create the connection to the database using the knex module
 * http://knexjs.org/
 */
module.exports = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "cwscheduleapp",
    password: "whateverpasswordyourdbuserhas",
    database: "cwscheduleapp"
  }
});
