const rows = [
  { owner: 1, description: 'A simple project', privacy: false, title: 'coursework_1', module: '%test%', expectedDate: Date.now() + (86400 * 30 * 1000), createdAt: Date.now() - (86400 * 30 * 1000) },
  { owner: 1, description: 'A harder project', privacy: false, title: 'coursework_2', module: '%test%', expectedDate: Date.now() + (86400 * 60 * 1000), createdAt: Date.now() - (86400 * 60 * 1000) },
  { owner: 2, description: 'A simple project', privacy: false, title: 'Honours Project', module: '%test%', expectedDate: Date.now() + (86400 * 30 * 1000), createdAt: Date.now() - (86400 * 30 * 1000) },
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
