// http://knexjs.org/#Schema-Building
const tableName = 'tbl_coursework';
const seeds = require('../seeds/coursework.js');

async function create(sql, forced = false) {
  try {
    // If the table already exists and we don't force replace stop the execution else drop the table and create a new one
    if (await sql.schema.hasTable(tableName)) {
      if (!forced) {
        console.log(`✓   "${tableName}" table is already created!`);
        return;
      }
      console.log(`... Deleting "${tableName}"`);
      await sql.schema.dropTable(tableName);
    }
    console.log(`... Creating "${tableName}"`);
    // Create table
    await sql.schema.createTable(tableName, (table) => {
      table.charset('utf8');
      table.collate('utf8_bin');
      table.increments('id');
      table.string('title', 32).notNullable();
      table.string('module', 128).notNullable();
      table.string('intended_date', 128).notNullable();
      table.string('actual_completion_date', 128).notNullable();
      table.string('status', 30).notNullable();
      table.timestamps(true, true);
    });
    console.log(`✓   "${tableName}" has been created`);
    console.log(`... Populating "${tableName}"`);
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
