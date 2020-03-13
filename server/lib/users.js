const bcrypt = require("bcrypt");
// const validate = require("validate"); // validate is a great module to validate data: https://validatejs.org/
const sql = require("./db/config.js");

function saveSession(session, passKey) {
  session.key = passKey;
}

function removeSensitive(data) {
  delete data.password;
  return data;
}

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
  async authenticate(session, data) {
    const { username, password } = data;
    let rows = await sql("tbl_users")
      .select()
      .whereRaw("username = ?", [username]);
    if (rows.length) {
      const match = await bcrypt.compare(password, rows[0].password);
      if (match) {
        saveSession(session, rows[0].password);
        return removeSensitive(rows[0]);
      }
    }
    // If this line is reached that means the either the username or the password is invalid
    throw { _general: "Invalid username or password" };
  },
  async session(key) {
    if (key) {
      let rows = await sql("tbl_users")
        .select()
        .whereRaw("password = ?", [key]);
      // If the session key matches a password key from the database then authenticate the user
      if (rows.length) {
        return removeSensitive(rows[0]);
      }
    }
    // If this line is reached that means the session could not be loaded
    throw { _silent: "Session key could not be found or was empty" };
  },
  async deauthenticate() {
    throw "Empty block";
  }
};

module.exports = users;
