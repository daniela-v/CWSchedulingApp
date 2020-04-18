const express = require('express');
const milestones = require('../lib/milestones.js');

const router = express.Router();

/**
 * POST /milestones/list
 */
router.post('/list', async (req, res) => {
  let error;
  let result;
  try {
    result = await milestones.getAllMilestones(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

module.exports = router;
