const express = require('express');
const coursework = require('../lib/coursework.js');

const router = express.Router();

/**
 * POST /coursework/new
 */
router.post('/new', async (req, res) => {
  let error;
  let result;
  try {
    result = coursework.createCoursework(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * GET /coursework/list
 */
router.get('/publicList', async (req, res) => {
  let error;
  let result;
  try {
    result = coursework.findAllPublic();
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
    result = coursework.findAllThatBelongToUser(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});


module.exports = router;
