const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validate = require('validate.js');
const _ = require('lodash');

const { User } = require('./db/models.js').models;
const validators = require('./validators/users.validator.js');
const mail = require('./mail');

function storeUserSession(session, id) {
  session.user = id; // eslint-disable-line no-param-reassign
  session.save();
}

function clearUserSession(session) {
  delete session.user; // eslint-disable-line no-param-reassign
  session.save();
}

function removeSensitive(data) {
  const copy = { ...data };
  delete copy.password; // eslint-disable-line no-param-reassign
  return copy;
}

const users = {
  async register(data) {
    // If the validation is failing, throw the error given by the validator
    const error = validate(data, validators.register);
    if (error) {
      throw error;
    }

    const { username, password, email } = data;
    // If the user already exists in the database, throw an explanatory error
    const result = await User.findOne({ where: { username } });
    if (result) {
      throw { username: ['This username has already been taken'] };
    }
    // Crypt the password and create a new user into the database then return successful
    const cryptedPwd = await bcrypt.hash(password, 10);
    await User.create({ username, password: cryptedPwd, email });
    return true;
  },
  // Function to recover the account of a user
  async recover(data) {
    const { account, code, password, step } = data;
    const constraints = _.reduce(validators.recovery, (acc, val, s) => {
      if (s <= step) {
        return { ...acc, ...val };
      }
      return { ...acc };
    }, {});
    // If the validation is failing, throw the error given by the validator
    const error = validate(data, constraints);
    if (error) {
      throw error;
    }
    // Get the user from the database depending if the input is an email or not
    const isEmail = !validate.single(account, { email: true });
    const condition = (isEmail) ? { email: account } : { username: account };
    const result = await User.findOne({ where: condition });
    // If the user cannot be found, throw an explanatory error
    if (!result) {
      throw { account: ['This account is invalid'] };
    }
    if (step === 0) {
      // Step 0: Insert an account to recover
      // Generate a JWT token, using the user's creation timestamp and password hash, that automatically expires in 5 minutes
      const token = jwt.sign({
        data: { id: result.id },
      }, `${result.createdAt}-${result.password}`, { expiresIn: 5 * 60 });
      // Send an email with the token to the user's email
      mail.send({
        user: result.username,
        email: result.email,
        subject: 'Your account recovery code',
        message: `<p>Recover your account by clicking <a href="http://localhost:8080/?recovery=${token}">here</a></p>
                  <div style="color: red; font-weight: 700; margin: 10px 0;">Code expiring in 5 minutes</div>
                  <div style="
                    margin: 0 20px;
                    padding: 20px 20px;
                    border-radius: 8px;
                    background-color: #d4d4d4;
                    font-weight: 700;
                    text-align: center;">
                    <span style="font-size: 14px;">${token}</span>
                  </div>`,
      });
    } else if (step === 1) {
      // Step 1: Insert a code for the account
      try {
        // If the JWT token, generated using the user's creation timestamp and password hash, is invalid, throw an explanatory error
        jwt.verify(code, `${result.createdAt}-${result.password}`);
      } catch (e) {
        if (/expired/.test(e.message)) {
          throw { code: ['This code has expired'] };
        }
        throw { code: ['This code is invalid'] };
      }
    } else {
      // Step 2: Insert a password to replace the previous one
      const samePassword = await bcrypt.compare(password, result.password);
      if (samePassword) {
        throw { password: ['You must use a different password than before'] };
      }
      result.password = await bcrypt.hash(password, 10);
      result.save();
    }
    // Return true on success
    return true;
  },
  async authenticate(session, data) {
    const { username, password } = data;
    // If the username and password are not empty
    if (username && password) {
      // Find the user in the database by username
      const result = await User.findOne({ where: { username } });
      // If the user is valid
      if (result) {
        // Hash the input password and check it against the user password hash from the database
        const match = await bcrypt.compare(password, result.password);
        // If it matches, save it in the session and remove the sensitive data for security reasons (password field)
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
    if (session.user) {
      clearUserSession(session);
      return true;
    }
    // If this line is reached that means there is nothing to deauthenticate
    throw { _silent: 'Nothing to deauthenticate' };
  },
};

module.exports = users;
