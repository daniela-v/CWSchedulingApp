const express = require('express');
// const users = require('../lib/users.js');

const router = express.Router();

/**
 * POST /coursework/new
 */
router.post('/new', async (req, res) => {
  let error;
  let result;
  try {
    
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * GET /coursework/list
 */
router.get('/list', async (req, res) => {
  let error;
  let result;
  try {
    
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});


module.exports = router;
