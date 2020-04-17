const rows = [
  { title: 'coursework_1', module: '%test%', intended_date: 1578268800000, completion_date: 1583625600000, status: 'In progress' },
  { title: 'coursework_2', module: '?test?', intended_date: 1578614400000, completion_date: 1585526400000, status: 'In progress' },
  { title: 'coursework_3', module: '.test`', intended_date: 1582416000000, completion_date: 1585526400000, status: 'Complete' },
];

async function insert(model) {
  await model.destroy({ where: {} });
  // Only populate the development database with seeds
  if (process.env.SQL === 'develop') {
    await model.bulkCreate(rows);
    console.log(`\u001b[32m✓   "${model.tableName}" has been populated\u001b[0m`);
  }
}

module.exports = { insert };
