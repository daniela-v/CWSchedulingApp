/* eslint-disable */
// Jest testing unit: https://jestjs.io/docs/en/setup-teardown

const { Op } = require("sequelize");
const sql = require('../lib/db/config.js').sql;
const sqlModels = require('../lib/db/models.js');
let milestones;

beforeAll(async () => {
  await sqlModels.init(sql);
  milestones = require('../lib/milestones.js');
})

afterAll(async () => {
  // await sqlModels.models.User.destroy({
  //   where: {
  //     email: {
  //       [Op.like]: 'DuplicateEmail%'
  //     }
  //   }
  // });
  sql.close();
})

describe('getAllMilestones', () => {
  it('returns a list of items if coursework has milestones', async () => {
    const result = await milestones.getAllMilestones({ coursework: 1 });
    expect(result.length).toEqual(3);
  });
  it('returns an empty list if coursework has no milestones', async() => {
    const result = await milestones.getAllMilestones({ coursework: 3 });
    expect(result.length).toEqual(0);
  })
  it('throws an error if no coursework specified', async () => {
    let error;
    try {
      await milestones.getAllMilestones();
    } catch (e) {
      error = e;
    }
    expect(error).toEqual({
      _notification: 'Invalid coursework specified',
    })
  });
});