const express = require('express');
const courseworks = require('../lib/coursework.js');

const router = express.Router();

/**
 * POST /coursework/new
 */
router.post('/new', async (req, res) => {
  let error;
  let result;
  try {
    result = courseworks.createCoursework(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * GET /coursework/publicList
 */
router.get('/publicList', async (req, res) => {
  let error;
  let result;
  try {
    result = await courseworks.findAllPublic();
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * GET /coursework/userList
 */
router.get('/userList', async (req, res) => {
  let error;
  let result;
  try {
    result = await courseworks.findAllThatBelongToUser(req.query.owner);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});


module.exports = router;
