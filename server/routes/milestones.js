const express = require('express');
const milestones = require('../lib/milestones.js');

const router = express.Router();

/**
 * GET /milestones/list
 */
router.get('/list', async (req, res) => {
  // Get permission
  let error;
  let result;
  try {
    result = await milestones.getAllMilestones(req.query);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * GET /milestones/get
 */
router.get('/get', async (req, res) => {
  // Get permission
  let error;
  let result;
  try {
    result = await milestones.getMilestone(req.query);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

module.exports = router;
