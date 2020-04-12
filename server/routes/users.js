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
    result = await users.session(req.session.user);
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
  let result = true;
  try {
    users.recover(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /users/code
 * 
 * Used to compare the code that the user enters to the code that has been generated and sent to the user via email
 * returns true if the codes match and false if they do not
 */
router.post('/code', async (req, res) => {
  let error;
  let result = false;
  try {
    const code = users.recover(req.body);
    if (code === users.generatedCode) {
      result = true;
    }
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

module.exports = router;
