const rows = [
  { title: 'admin_1', module: '%test%', intended_date: 1578268800000, completion_date: 1583625600000, status: 'In progress' },
  { title: 'admin_2', module: '?test?', intended_date: 1578614400000, completion_date: 1585526400000, status: 'In progress' },
  { title: 'admin_3', module: '.test`', intended_date: 1582416000000, completion_date: 1585526400000, status: 'Complete' },
];

async function insert(model) {
  await model.destroy({ where: {} });
  await model.bulkCreate(rows);
  console.log(`✓   "${model.tableName}" has been populated`);
}

module.exports = { insert };
