/* eslint-disable */
// Jest testing unit: https://jestjs.io/docs/en/setup-teardown

const { Op } = require("sequelize");
const sql = require('../lib/db/config.js').sql;
const sqlModels = require('../lib/db/models.js');
let users;

beforeAll(async () => {
  await sqlModels.init(sql);
  users = require('../lib/users.js');
})

afterAll(async () => {
  await sqlModels.models.User.destroy({
    where: {
      email: {
        [Op.like]: 'DuplicateEmail%'
      }
    }
  });
  sql.close();
})

test('no duplicate email on register', async () => {
  const user1 = {
    username: 'DuplicateEmail1',
    password: '123456',
    confirmPassword: '123456',
    email: 'duplicateemail@dupe.com',
    confirmEmail: 'duplicateemail@dupe.com',
  }
  const user2 = {
    username: 'DuplicateEmail2',
    password: '123456',
    confirmPassword: '123456',
    email: 'duplicateemail@dupe.com',
    confirmEmail: 'duplicateemail@dupe.com',
  }
  let error;
  try {
    await users.register(user1);
    await users.register(user2);
  } catch (e) {
    error = e;
  }
  expect(error).toEqual({
    email: ['This email has already been taken']
  })
});