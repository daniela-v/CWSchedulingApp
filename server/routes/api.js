const express = require("express");
const router = express.Router();

const { register } = require("../lib/users.js");
// or
// const users = require("../lib/users.js");
// ... await users.register() instead of await register();

/**
 * GET /api/example
 * async in javascript used to determine that the content of the function might be asynchronous (e.g: db queries)
 */
router.get("/example", async (req, res) => {
  let error, result;
  try {
    // await halts the execution of THIS function until the result is returned
    result = await register();
  } catch (e) {
    console.dir((error = e));
  }
  res.json({ result, error });
});

module.exports = router;
