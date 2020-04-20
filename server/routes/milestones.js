const express = require('express');
const milestones = require('../lib/milestones.js');
const permissions = require('../lib/permissions.js');

const router = express.Router();

/**
 * GET /milestones/list
 */
router.get('/list', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkReadOnlyPermission(req.session.user, req.query.coursework);
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
  let error;
  let result;
  try {
    await permissions.hasCourseworkReadOnlyPermission(req.session.user, req.query.coursework);
    result = await milestones.getMilestone(req.query);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

module.exports = router;
