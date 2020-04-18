const rows = [
  { coursework: 1, title: 'Milestone 1', started_date: Date.now() + (86400 * 2 * 1000), expected_date: Date.now() + (86400 * 12 * 1000) },
  { coursework: 1, title: 'Milestone 2', started_date: Date.now() + (86400 * 3 * 1000), expected_date: Date.now() + (86400 * 15 * 1000) },
  { coursework: 1, title: 'Milestone 3', started_date: Date.now() + (86400 * 6 * 1000), expected_date: Date.now() + (86400 * 24 * 1000) },
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
