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
 * POST /users/authenticate
 */
router.post("/authenticate", async (req, res) => {
  let error, result;
  try {
    result = await users.authenticate(req.session, req.body);
  } catch (e) {
    console.dir((error = e));
  }
  res.json({ result, error });
});

/**
 * GET /users/session
 */
router.get("/session", async (req, res) => {
  let error, result;
  try {
    result = await users.session(req.session.key);
  } catch (e) {
    error = e;
  }
  res.json({ result, error });
});

module.exports = router;
