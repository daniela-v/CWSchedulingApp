const bcrypt = require('bcrypt');
const validate = require('validate.js');

const sql = require('./db/config.js');
const validators = require('./validators/users.validator.js');
const mailer = require('./mail/index.js');

function storeKey(session, passKey) {
  session.key = passKey; // eslint-disable-line no-param-reassign
  session.save();
}
function clearKey(session) {
  delete session.key; // eslint-disable-line no-param-reassign
  session.save();
}

function removeSensitive(data) {
  delete data.password; // eslint-disable-line no-param-reassign
  return data;
}

const users = {
  async register(data) {
    const error = validate(data, validators.register);
    if (!error) {
      const { username, password, email } = data;
      const result = await sql('tbl_users')
        .select()
        .whereRaw('username = ?', [username]);
      if (result.length) {
        throw { username: ['This username has already been taken'] };
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
    throw error;
  },
  async recover(data){
    const {email,password} = data;
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
          storeKey(session, rows[0].password);
          return removeSensitive(rows[0]);
        }
      }
    }
    // If this line is reached that means that either the username or the password is invalid
    throw {
      username: ['Invalid username or password'],
      password: ['Invalid username or password'],
    };
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
    throw { _silent: 'Session key could not be found or was empty' };
  },
  async deauthenticate(session) {
    if (session.key) {
      clearKey(session);
      return true;
    }
    // If this line is reached that means there is nothing to deauthenticate
    throw { _silent: 'Nothing to deauthenticate' };
  },
};

module.exports = users;
