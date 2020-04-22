const express = require('express');
const courseworks = require('../lib/coursework.js');
const permissions = require('../lib/permissions.js');

const router = express.Router();

/**
 * POST /coursework/create
 */
router.post('/create', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkWritePermission(req.session.user, req.body.coursework);
    result = courseworks.createCoursework(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /coursework/update
 */
router.post('/update', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkWritePermission(req.session.user, req.body.coursework);
    result = courseworks.updateCoursework(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /coursework/privacy
 */
router.post('/privacy', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkWritePermission(req.session.user, req.body.coursework);
    result = courseworks.changePrivacy(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});
/**
 * GET /coursework/get
 */
router.get('/get', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkReadOnlyPermission(req.session.user, req.query.coursework, req.query.shared);
    result = await courseworks.getCoursework(req.query.id);
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
    await permissions.hasCourseworkReadOnlyPermission(req.session.user, req.query.coursework);
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
    await permissions.hasCourseworkReadOnlyPermission(req.session.user, req.query.coursework);
    result = await courseworks.findAllThatBelongToUser(req.query.owner);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});


module.exports = router;
