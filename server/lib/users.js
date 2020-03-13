const bcrypt = require("bcrypt");
// const validate = require("validate"); // validate is a great module to validate data: https://validatejs.org/
const sql = require("./db/config.js");

const users = {
  async register(data) {
    const { username, password, confirmPassword, email, confirmEmail } = data;
    try {
      const cryptedPwd = await bcrypt.hash(password, 10);
      if (password == confirmPassword && email == confirmEmail) {
        await sql("tbl_users").insert({
          username: username,
          password: cryptedPwd,
          email: email
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
  async authenticate(userName, password) {
    let rows = await sql("tbl_users")
      .select()
      .whereRaw("username = ?", [userName]);
    const match = await bcrypt.compare(password, rows[0].password);
    if (match) {
      return true;
    } else {
      return false;
    }
  },
  async session(key) {
    if (key) {
      let rows = await sql("tbl_users")
        .select()
        .whereRaw("password = ?", [key]);
      // If the session key matches a password key from the database then authenticate the user
      if (rows.length) {
        return rows[0];
      }
    }
    throw { _silent: "Session key could not be found or was empty" };
  },
  async deauthenticate() {
    throw "Empty block";
  }
};

module.exports = users;
