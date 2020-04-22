const validate = require('validate.js');

const validator = {
  delete: {
    title: {
      presence: {
        allowEmpty: false,
      },
    },
  },
  create: {
    title: {
      length: {
        minimum: 3,
        maximum: 32,
      },
      format: {
        pattern: '[a-z0-9 ]+',
        flags: 'i',
        message: 'must contain only alphanumeric characters, numbers or spaces',
      },
    },
    module: {
      length: {
        minimum: 3,
        maximum: 32,
      },
      format: {
        pattern: '[a-z0-9 ]+',
        flags: 'i',
        message: 'must contain only alphanumeric characters, numbers or spaces',
      },
    },
    description: {
      length: {
        maximum: 1024,
      },
    },
    expectedDate: {
      presence: {
        allowEmpty: false,
      },
      type: {
        type: (value) => {
          const isDate = new Date(value);
          return !(Number.isNaN(isDate.getTime()));
        },
        message: () => 'must be a valid date',
      },
    },
  },
  validate(data, rules) {
    return validate(data, rules);
  },
};

module.exports = validator;
