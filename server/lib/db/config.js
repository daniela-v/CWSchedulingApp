const knex = require('knex');

const usersModel = require('./models/users.js');
const exampleModel = require('./models/example.js');

/**
 * This file is used to create the connection to the database using the knex module
 * http://knexjs.org/
 */
process.env.SQL = process.env.SQL || 'develop';
const sql = knex({
  client: 'mysql',
  connection: {
    host: 'database-1.cxsa8qxfqxs5.eu-west-2.rds.amazonaws.com',
    user: `cwscheduleapp_${process.env.SQL}`,
    password: 'cwscheduleapp',
    database: `cwscheduleapp_${process.env.SQL}`,
  },
});
/*
 **** MySQL Workbench:
 * host: database-1.cxsa8qxfqxs5.eu-west-2.rds.amazonaws.com
 * port: 3306
 * user: cwscheduleapp_develop or cwscheduleapp_production
 * pwd: cwscheduleapp
 * db: cwscheduleapp_develop or cwscheduleapp_production
 *
 **** Shell:
 * (Develop) mysql -hdatabase-1.cxsa8qxfqxs5.eu-west-2.rds.amazonaws.com -ucwscheduleapp_develop -pcwscheduleapp -A cwscheduleapp_develop
 * (Production) mysql -hdatabase-1.cxsa8qxfqxs5.eu-west-2.rds.amazonaws.com -ucwscheduleapp_production -pcwscheduleapp -A cwscheduleapp_production
 *
 * Useful commands:
 * > show databases;
 * > use <database>;
 * > show tables like "%string%";
 * > select * from <table> <conditions> \G
 * > insert into <table> (col1, col2) values ("val1", "val2");
 * > update <table> set col1="val1" <condition>;
 * > delete from <table> <condition>;
 * > drop table <table>;
 */

// Automatically create tables if they don't exist (add a second parameter set to true if you want to remove the previous table)
(async () => {
  await usersModel.create(sql, false);
  await exampleModel.create(sql, false);
  console.log(`✓   Using \`cwscheduleapp_${process.env.SQL}\` database\n`);
  console.log('✓   Database config finished loading\n');
})();

module.exports = sql;
