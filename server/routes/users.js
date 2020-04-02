const express = require('express');
const users = require('../lib/users.js');

const router = express.Router();

/**
 * POST /users/register
 */
router.post('/register', async (req, res) => {
  let error;
  let result;
  try {
    result = await users.register(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /users/authenticate
 */
router.post('/authenticate', async (req, res) => {
  let error;
  let result;
  try {
    result = await users.authenticate(req.session, req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * GET /users/deauthenticate
 */
router.get('/deauthenticate', async (req, res) => {
  let error;
  let result;
  try {
    result = await users.deauthenticate(req.session);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * GET /users/session
 */
router.get('/session', async (req, res) => {
  let error;
  let result;
  req.session.touch();
  try {
    result = await users.session(req.session.key);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /users/recover
 */
router.post('/recover', async (req, res) => {
  let error;
  let result = false;
  try {
    //result = true;
    users.recover(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

module.exports = router;
