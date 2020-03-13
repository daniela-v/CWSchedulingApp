const bcrypt = require('bcrypt');
const validate = require('validate.js');

const sql = require('./db/config.js');
const validators = require('./validators/users.validator.js');

function saveSession(session, passKey) {
  session.key = passKey; // eslint-disable-line
}

function removeSensitive(data) {
  delete data.password; // eslint-disable-line
  return data;
}

const users = {
  async register(data) {
    const validationCheck = validate(data, validators.register);
    if (!validationCheck) {
      const { username, password, email } = data;
      const result = await sql('tbl_users')
        .select()
        .whereRaw('username = ?', [username]);

      if (result.length) {
        throw Error({ username: 'This username has already been taken' });
      }

      const cryptedPwd = await bcrypt.hash(password, 10);
      await sql('tbl_users').insert({
        username,
        password: cryptedPwd,
        email,
      });
      return true;
    }
    // If this line is reached that means the form validation failed
    throw validationCheck;
  },
  async authenticate(session, data) {
    const { username, password } = data;
    if (username && password) {
      const rows = await sql('tbl_users')
        .select()
        .whereRaw('username = ?', [username]);
      if (rows.length) {
        const match = await bcrypt.compare(password, rows[0].password);
        if (match) {
          saveSession(session, rows[0].password);
          return removeSensitive(rows[0]);
        }
      }
    }
    // If this line is reached that means the either the username or the password is invalid
    throw Error('Invalid username or password');
  },
  async session(key) {
    if (key) {
      const rows = await sql('tbl_users')
        .select()
        .whereRaw('password = ?', [key]);
      // If the session key matches a password key from the database then authenticate the user
      if (rows.length) {
        return removeSensitive(rows[0]);
      }
    }
    // If this line is reached that means the session could not be loaded
    throw Error({ _silent: 'Session key could not be found or was empty' });
  },
  async deauthenticate() {
    throw Error('Empty block');
  },
};

module.exports = users;
