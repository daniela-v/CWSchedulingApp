const sql = require("./db/config.js");
const bcrypt = require("bcrypt");
const validate = require("validate.js");
const validators = require("./validators/users.validator.js");

function saveSession(session, passKey) {
  session.key = passKey;
}

function removeSensitive(data) {
  delete data.password;
  return data;
}

const users = {
  async register(data) {
    const validationCheck = validate(data, validators.register);
    if (!validationCheck) {
      const { username, password, email } = data;
      let result = await sql("tbl_users")
        .select()
        .whereRaw("username = ?", [username]);

      if (result.length) {
        throw { username: "This username has already been taken" };
      }

      const cryptedPwd = await bcrypt.hash(password, 10);
      await sql("tbl_users").insert({
        username: username,
        password: cryptedPwd,
        email: email
      });
      return true;
    }
    // If this line is reached that means the form validation failed
    throw validationCheck;
  },
  async authenticate(session, data) {
    const { username, password } = data;
    if (username && password) {
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
    }
    // If this line is reached that means the either the username or the password is invalid
    throw "Invalid username or password";
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
