/**
 * Jest testing unit: https://jestjs.io/docs/en/setup-teardown
 * @jest-environment node
 */

/* eslint-disable */

const supertest = require('supertest');
const { Op } = require('sequelize');

const jestExpress = require('./express.js');

let express;
let request; // Used to perform requests using supertest
let cookies; // Variable holding our cookies
let coursework;

async function authenticate(username, password) {
  const res = await request.post('/users/authenticate').send({ username, password });
  cookies = res.headers['set-cookie'].map(r => r.replace(/; path=\/;.*httponly/gi, '')).join('; ');
}

beforeAll(async () => {
  // Initialize the express server and the supertest library
  express = await jestExpress.init();
  request = supertest(express.app);
  // Import any custom libraries that are gonna be used within the unit test
  coursework = require('../lib/courseworks.js');
});

afterAll(async (done) => {
  // Close the DB connection and the express server
  jestExpress.sequelize.sql.close();
  express.server.close(done);
});

describe('Get all coursework milestones', () => {
  it('test', async () => {
    await authenticate('admin_1', '%test%');
    const res = await request.get('/coursework/list')
      .set('Cookie', cookies)
      .query();
  });
});