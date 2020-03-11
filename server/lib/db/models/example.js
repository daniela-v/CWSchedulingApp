const tableName = "tbl_example"; // Change this to the name of table you'd like to create
const seeds = require("../seeds/example.js"); // Import the seed file from /seeds/ folder for the table that you'll create to autopopulate empty tables on creation

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
      // Edit above this line only if you're sure what you're doing
      // Add required columns (check http://knexjs.org/#Schema-Building)
      table.increments("id");
      table.string("example", 32).notNullable();
      // The next line autocreates timestamp fields (created_at and updated_at)
      // Edit below this line only if you're sure what you're doing
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
