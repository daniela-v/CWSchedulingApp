const express = require('express');
const courseworks = require('../lib/courseworks.js');
const permissions = require('../lib/permissions.js');

const router = express.Router();

/**
 * GET /courseworks/list
 */
router.get('/list', async (req, res) => {
  let error;
  let result;
  try {
    result = await courseworks.getAllCourseworks(req.session.user, req.query);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * GET /courseworks/get
 */
router.get('/get', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkReadOnlyPermission(req.session.user, req.query.coursework, req.query.shared);
    result = await courseworks.getCoursework(req.query);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /courseworks/create
 */
router.post('/create', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasPrivileges(req.session.user);
    result = await courseworks.createCoursework(req.session.user, req.body);
  } catch (e) {
    console.log(e);
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /courseworks/edit
 */
router.post('/edit', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkWritePermission(req.session.user, req.body.coursework);
    result = await courseworks.editCoursework(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /courseworks/delete
 */
router.post('/delete', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkWritePermission(req.session.user, req.body.coursework);
    result = await courseworks.deleteCoursework(req.body);
  } catch (e) {
    console.log(e);
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /courseworks/changePrivacy
 */
router.post('/changePrivacy', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkWritePermission(req.session.user, req.body.coursework);
    result = await courseworks.changePrivacy(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /courseworks/changeProgress
 */
router.post('/changeProgress', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkWritePermission(req.session.user, req.body.coursework);
    result = await courseworks.changeProgress(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /courseworks/changeShared
 */
router.post('/changeShared', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkWritePermission(req.session.user, req.body.coursework);
    result = await courseworks.changeShared(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /courseworks/addParticipant
 */
router.post('/addParticipant', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkWritePermission(req.session.user, req.body.coursework);
    result = await courseworks.addParticipant(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /courseworks/editParticipant
 */
router.post('/editParticipant', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkWritePermission(req.session.user, req.body.coursework);
    result = await courseworks.editParticipant(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

/**
 * POST /courseworks/deleteParticipant
 */
router.post('/deleteParticipant', async (req, res) => {
  let error;
  let result;
  try {
    await permissions.hasCourseworkWritePermission(req.session.user, req.body.coursework);
    result = await courseworks.deleteParticipant(req.body);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});


module.exports = router;
