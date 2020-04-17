const rows = [
  { title: 'Coursework_1', module: '%test%', inteneded_date: '10/06/2020', actual_completion_date: '21/06/2020', status: 'In progress' },
  { title: 'Coursework_2', module: '?test?', inteneded_date: '21/12/2020', actual_completion_date: '22/08/2021', status: 'In progress' },
  { title: 'Coursework_3', module: '.test`', inteneded_date: '03/06/2020', actual_completion_date: '12/03/2020', status: 'complete' },
];

async function insert(sql, tableName) {
  await sql.table(tableName).del();
  await sql.table(tableName).insert(rows);
  console.log(`✓   "${tableName}" has been populated\n`);
}

module.exports = { insert };
