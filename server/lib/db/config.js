const Sequelize = require('sequelize');

/**
 * This file is used to create the connection to the database using the sequelize module
 * https://sequelize.org/v5/manual/
 */
process.env.SQL = process.env.SQL || 'develop';
const sql = new Sequelize({
  // host: 'localhost',
  host: 'database-1.cxsa8qxfqxs5.eu-west-2.rds.amazonaws.com',
  username: `cwscheduleapp_${process.env.SQL}`,
  password: 'cwscheduleapp',
  database: `cwscheduleapp_${process.env.SQL}`,
  dialect: 'mysql',
  pool: {
    max: 10,
    idle: 30000,
    acquire: 60000,
  },
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
  logging: false, // (process.env.SQL === 'develop'),
});

const models = require('./models.js');

async function init() {
  // Automatically create tables if they don't exist (add a second parameter set to true if you want to remove the previous tables)
  console.log(`\u001b[36m    Using \`cwscheduleapp_${process.env.SQL}\` database\n\u001b[0m`);
  await models.init(sql, true);
  console.log('\u001b[32m✓   Database config finished loading\n\u001b[0m');
}

module.exports = { sql, init, models };
