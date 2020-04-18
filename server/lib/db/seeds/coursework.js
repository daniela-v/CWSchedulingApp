const rows = [
  { owner: 'user_1', description: 'A simple project', deleted: 1578614400000, isPrivate: false, title: 'coursework_1', module: '%test%', expectedDate: 1578268800000, completedDate: 1583625600000, status: 'In progress' },
  { owner: 'user_1', description: 'A harder project', deleted: 1578614400000, isPrivate: true, title: 'coursework_2', module: '%test%', expectedDate: 1578268800000, completedDate: 1583625600000, status: 'In progress' },
  { owner: 'user_2', description: 'A simple project', deleted: 1578614400000, isPrivate: true, title: 'Honours Project', module: '%test%', expectedDate: 1578268800000, completedDate: 1583625600000, status: 'In progress' },
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
