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
});

afterAll(async (done) => {
  // Close the DB connection and the express server
  jestExpress.sequelize.sql.close();
  express.server.close(done);
});

describe('Get all coursework milestones', () => {
  it('returns an error if the user doesn\'t have read access', async() => {
    await authenticate('admin_3', '.test`');
    const res = await request.get('/milestones/list')
      .set('Cookie', cookies)
      .query({ coursework: 2 });
    expect(res.body.error._notification).toEqual('You have not been invited to be a participant in this coursework');
  });

  it('returns a list of items if coursework has milestones', async () => {
    await authenticate('admin_1', '%test%');
    const res = await request.get('/milestones/list')
      .set('Cookie', cookies)
      .query({ coursework: 1 });
    expect(res.body.result.length).toEqual(3);
  });

  it('returns an empty list if coursework has no milestones', async () => {
    const res = await request.get('/milestones/list')
      .set('Cookie', cookies)
      .query({ coursework: 2 });
    expect(res.body.result.length).toEqual(0);
  });

  it('throws a system error if no params specified', async () => {
    const res = await request.get('/milestones/list')
      .set('Cookie', cookies)
      .query();
    expect(res.body.error._system).toBeDefined();
  });
});

describe('Get a coursework milestone', () => {
  it('returns an error if the user doesn\'t have read access', async() => {
    await authenticate('admin_3', '.test`');
    const res = await request.get('/milestones/get')
      .set('Cookie', cookies)
      .query({ coursework: 3, milestone: 4 });
    expect(res.body.error._notification).toEqual('You have not been invited to be a participant in this coursework');
  });

  it('returns the correct milestone', async () => {
    await authenticate('admin_1', '%test%');
    const res = await request.get('/milestones/get')
      .set('Cookie', cookies)
      .query({ coursework: 1, milestone: 1 });
    expect(res.body.result.id).toEqual(1);
  });

  it('throws a notification if milestone is invalid', async () => {
    const res = await request.get('/milestones/get')
      .set('Cookie', cookies)
      .query({ coursework: 1, milestone: 4 });
    expect(res.body.error._notification).toEqual('The milestone you\'re trying to access cannot be found');
  });

  it('throws a system error if params not fully specified', async () => {
    let res;
    res = await request.get('/milestones/get')
      .set('Cookie', cookies)
      .query({});
    expect(res.body.error._system).toBeDefined();
    res = await request.get('/milestones/get')
      .set('Cookie', cookies)
      .query({ milestone: 1 });
    expect(res.body.error._system).toBeDefined();
    res = await request.get('/milestones/get')
      .set('Cookie', cookies)
      .query({ cursework: 1 });
    expect(res.body.error._system).toBeDefined();
  });
});
