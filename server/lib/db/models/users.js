// http://knexjs.org/#Schema-Building
const tableName = "tbl_users";
const seeds = require("../seeds/users.js");

async function create(sql, forced = false) {
  try {
    // If the table already exists and we don't force replace stop the execution else drop the table and create a new one
    if (await sql.schema.hasTable(tableName)) {
      if (!forced) return;
      await sql.schema.dropTable(tableName);
    }
    console.log(`\nCreating ${tableName} ...`);
    // Create table
    await sql.schema.createTable(tableName, table => {
      table.charset("utf8");
      table.collate("utf8_bin");
      table.increments("id");
      table.string("username", 32).notNullable();
      table.string("password", 128).notNullable();
      table.string("email", 128).notNullable();
      table.timestamps(true, true);
    });
    console.log(`Table ${tableName} has been created`);
    console.log(`Populating ${tableName} ...`);
    // Insert seed data if table is empty
    const rows = await sql.table(tableName).select();
    if (!rows.length) {
      await seeds.insert(sql, tableName);
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = { create };
