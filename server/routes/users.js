const express = require("express");
const router = express.Router();

const { register } = require("../lib/users.js");

/**
 * GET /users/register
 * async in javascript used to determine that the content of the function might be asynchronous (e.g: db queries)
 */
router.post("/register", async (req, res) => {
  // Always use let or const when declaring variables, never use var (const is like final in java, basically use it for everything that do not require reassignment)
  let error, result;
  try {
    // req.body holds our HTTP request params
    result = await register(req.body);
  } catch (e) {
    console.dir((error = e));
  }
  // Send back response as JSON
  res.json({ result, error });
});

module.exports = router;
