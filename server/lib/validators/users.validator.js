const validator = {
  register: {
    username: {
      presence: true,
      length: {
        minimum: 6,
        maximum: 18
      },
      format: {
        pattern: "[a-z0-9_.]+",
        flags: "i",
        message: "must contain only alphanumeric characters, numbers or symbols [_.]"
      }
    },
    password: {
      presence: true,
      length: {
        minimum: 6,
        maximum: 18
      }
    },
    confirmPassword: {
      presence: true,
      equality: {
        attribute: "password",
        message: "^The password does not match"
      }
    },
    email: {
      presence: true,
      email: true
    },
    confirmEmail: {
      presence: true,
      equality: {
        attribute: "email",
        message: "^The email does not match"
      }
    }
  }
};

module.exports = validator;
