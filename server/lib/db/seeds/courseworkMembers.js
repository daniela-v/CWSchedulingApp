const rows = [
  { coursework: 1, member: 1, team: 'Owner' },
  { coursework: 2, member: 1, team: 'Owner' },
  { coursework: 3, member: 2, team: 'Owner' },
  { coursework: 1, member: 4, team: 'Backend' },
  { coursework: 1, member: 5, team: 'Frontend' },
  { coursework: 2, member: 6, team: 'Frontend' },
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
