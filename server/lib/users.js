const bcrypt = require('bcrypt');
const validate = require('validate.js');

const { User } = require('./db/models.js').models;
const validators = require('./validators/users.validator.js');
const mailer = require('./mail/index.js');

let generatedCode =0;

function storeUserSession(session, id) {
  session.user = id; // eslint-disable-line no-param-reassign
  session.save();
}
function clearUserSession(session) {
  delete session.user; // eslint-disable-line no-param-reassign
  session.save();
}

function removeSensitive(data) {
  delete data.password; // eslint-disable-line no-param-reassign
  return data;
}

function generateCode() {
  let min = 0;
  let max = 100;
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const users = {
  async register(data) {
    const error = validate(data, validators.register);
    if (!error) {
      const { username, password, email } = data;
      const result = await User.findOne({ where: { username } });
      if (result) {
        throw { username: ['This username has already been taken'] };
      }
      const cryptedPwd = await bcrypt.hash(password, 10);
      await User.create({ username, password: cryptedPwd, email });
      return true;
    }
    // If this line is reached that means the form validation failed
    throw error;
  },
  // Function to recover the account of a user
  async recover(data) {
    const { email,password } = data;
    const code = generateCode();
    const result = await sql('tbl_users')
      .select('username')
      .whereRaw('email = ?', [email]);
    mailer.send(result, email, 'Code for password reset', code);
    generatedCode = code;
  },
  async authenticate(session, data) {
    const { username, password } = data;
    if (username && password) {
      const result = await User.findOne({ where: { username } });
      if (result) {
        const match = await bcrypt.compare(password, result.password);
        if (match) {
          storeUserSession(session, result.id);
          return removeSensitive(result.dataValues);
        }
      }
    }
    // If this line is reached that means that either the username or the password is invalid
    throw {
      username: ['Invalid username or password'],
      password: ['Invalid username or password'],
    };
  },
  async session(id) {
    if (id) {
      const result = await User.findOne({ where: { id } });
      // If the session id matches a user id from the database then authenticate the user
      if (result) {
        return removeSensitive(result.dataValues);
      }
    }
    // If this line is reached that means the session could not be loaded
    throw { _silent: 'Session key could not be found or was empty' };
  },
  async deauthenticate(session) {
    if (session.key) {
      clearUserSession(session);
      return true;
    }
    // If this line is reached that means there is nothing to deauthenticate
    throw { _silent: 'Nothing to deauthenticate' };
  },
};

module.exports = users;
