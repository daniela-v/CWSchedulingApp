const knex = require('knex');

const usersModel = require('./models/users.js');
const exampleModel = require('./models/example.js');

/**
 * This file is used to create the connection to the database using the knex module
 * http://knexjs.org/
 */
const sql = knex({
  client: 'mysql',
  connection: {
    // host: "database-1.cxsa8qxfqxs5.eu-west-2.rds.amazonaws.com",
    host: 'localhost',
    user: 'cwscheduleapp',
    password: 'cwscheduleapp',
    database: 'cwscheduleapp',
  },
});
/*
 **** MySQL Workbench:
 * host: database-1.cxsa8qxfqxs5.eu-west-2.rds.amazonaws.com
 * port: 3306
 * user: root
 * pwd: rootroot
 *
 **** Shell:
 * mysql -h database-1.cxsa8qxfqxs5.eu-west-2.rds.amazonaws.com -P 3306 -u root -p
 */

// Automatically create tables if they don't exist (add a second parameter set to true if you want to remove the previous table)
(async () => {
  await usersModel.create(sql, true);
  await exampleModel.create(sql, true);
})();

module.exports = sql;
