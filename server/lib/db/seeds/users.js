const bcrypt = require('bcrypt');

const rows = [
  { username: 'admin_1', password: '%test%', email: 'admin_1@abc.com' },
  { username: 'admin_2', password: '?test?', email: 'admin_2@abc.com' },
  { username: 'admin_3', password: '.test`', email: 'admin_3@abc.com' },
];

async function cryptPasswords() {
  const promises = rows.map(async (row) => {
    const crypted = await bcrypt.hash(row.password, 10);
    return crypted;
  });
  const result = await Promise.all(promises);
  return result;
}

async function insert(sql, tableName) {
  await sql.table(tableName).del();
  await cryptPasswords();
  await sql.table(tableName).insert(rows);
  console.log(`Table ${tableName} has been populated\n`);
}

module.exports = { insert };
