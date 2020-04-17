const rows = [
<<<<<<< HEAD
  { title: 'Coursework_1', module: '%test%', inteneded_date: '10/06/2020', actual_completion_date: '21/06/2020', status: 'In progress' },
  { title: 'Coursework_2', module: '?test?', inteneded_date: '21/12/2020', actual_completion_date: '22/08/2021', status: 'In progress' },
  { title: 'Coursework_3', module: '.test`', inteneded_date: '03/06/2020', actual_completion_date: '12/03/2020', status: 'complete' },
=======
  { title: 'admin_1', module: '%test%', intended_date: 1578268800000, completion_date: 1583625600000, status: 'In progress' },
  { title: 'admin_2', module: '?test?', intended_date: 1578614400000, completion_date: 1585526400000, status: 'In progress' },
  { title: 'admin_3', module: '.test`', intended_date: 1582416000000, completion_date: 1585526400000, status: 'Complete' },
>>>>>>> develop
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
