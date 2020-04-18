/**
 * Jest testing unit: https://jestjs.io/docs/en/setup-teardown
 * @jest-environment node
 */

/* eslint-disable */

const jestExpress = require('./express.js');
const supertest = require('supertest');
const { Op } = require('sequelize');

let express;
let request; // Used to perform requests using supertest
let cookies; // Variable holding our cookies
let milestones;

async function authenticate(username, password) {
  const res = await request.post('/users/authenticate').send({ username, password });
  cookies = res.headers['set-cookie'].map(r => r.replace(/; path=\/;.*httponly/gi, '')).join("; ");
}

beforeAll(async () => {
  // Initialize the express server and the supertest library
  express = await jestExpress.init();
  request = supertest(express.app);
  // Import any custom libraries that are gonna be used within the unit test
  milestones = require('../lib/milestones.js');
  // Authenticate the user and save session
  await authenticate('admin_1', '%test%')
});

afterAll(async (done) => {
  // Close the DB connection and the express server
  jestExpress.sequelize.sql.close();
  express.server.close(done);
});

describe('Get all coursework milestones', () => {
  it('returns a list of items if coursework has milestones', async () => {
    const res = await request.get('/milestones/list')
      .query({ coursework: 1 });
    expect(res.body.result.length).toEqual(3);
  });
  
  it('returns an empty list if coursework has no milestones', async () => {
    const res = await request.get('/milestones/list')
      .query({ coursework: 3 });
    expect(res.body.result.length).toEqual(0);
  });

  it('throws a system error if no params specified', async () => {
    const res = await request.get('/milestones/list')
      .query();
    expect(res.body.error._system).toBeDefined();
  });
});

describe('Get a coursework milestone', () => {
  it('returns the correct milestone', async () => {
    const res = await request.get('/milestones/get')
      .query({ coursework: 1, milestone: 1 });
    expect(res.body.result.id).toEqual(1);
  });

  it('throws a notification if milestone is invalid', async () => {
    const res = await request.get('/milestones/get')
      .query({ coursework: 2, milestone: 5 });
    expect(res.body.error._notification).toBeDefined();
  });

  it('throws a system error if params not fully specified', async () => {
    let res;
    res = await request.get('/milestones/get')
      .query({});
    expect(res.body.error._system).toBeDefined();
    res = await request.get('/milestones/get')
      .query({ milestone: 1 });
    expect(res.body.error._system).toBeDefined();
    res = await request.get('/milestones/get')
      .query({ cursework: 1 });
    expect(res.body.error._system).toBeDefined();
  });
});
