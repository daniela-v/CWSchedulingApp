const express = require("express");
const router = express.Router();

const users = require("../lib/users.js");

/**
 * POST /users/register
 */
router.post("/register", async (req, res) => {
  let error, result;
  try {
    result = await users.register(req.body);
  } catch (e) {
    console.dir((error = e));
  }
  res.json({ result, error });
});

/**
 * GET /users/authenticate
 */
router.get("/authenticate", async (req, res) => {
  let error, result;
  try {
    result = await users.authenticate(req.query.userName, req.query.password);
  } catch (e) {
    console.dir((error = e));
  }
  res.json({ result, error });
});

/**
 * POST /users/session
 */
router.post("/session", async (req, res) => {
  let error, result;
  try {
    result = await users.session(req.session.key);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

module.exports = router;
