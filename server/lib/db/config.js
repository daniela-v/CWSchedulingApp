const Sequelize = require('sequelize');

/**
 * This file is used to create the connection to the database using the sequelize module
 * https://sequelize.org/v5/manual/
 */
process.env.SQL = process.env.SQL || 'develop';
const sql = new Sequelize({
  host: 'database-1.cxsa8qxfqxs5.eu-west-2.rds.amazonaws.com',
  username: `cwscheduleapp_${process.env.SQL}`,
  password: 'cwscheduleapp',
  database: `cwscheduleapp_${process.env.SQL}`,
  dialect: 'mysql',
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
  logging: false,
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

const models = require('./models.js');

(async () => {
  // Automatically create tables if they don't exist (add a second parameter set to true if you want to remove the previous tables)
  await models.init(sql, true);
  console.log(`✓   Using \`cwscheduleapp_${process.env.SQL}\` database\n`);
  console.log('✓   Database config finished loading\n');
})();

module.exports = sql;
