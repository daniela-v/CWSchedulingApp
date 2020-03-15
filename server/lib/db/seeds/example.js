// Rows to be inserted in the database, specify the columns with their values
const rows = [
  { example: 'abc' },
  { example: 'def' },
  { example: 'ghi' },
  { example: 'jkl' },
];

async function insert(sql, tableName) {
  // Delete everything from this table
  await sql.table(tableName).del();
  // Do extra computation on the rows if necessary (see users.js where we had to crypt the passwords)
  // Insert the seed rows
  await sql.table(tableName).insert(rows);
  console.log(`✓   "${tableName}" has been populated\n`);
}

module.exports = { insert };
