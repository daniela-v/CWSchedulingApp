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
      presence: true,
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
    startedDate: {
      presence: {
        allowEmpty: false,
      },
    },
    expectedDate: {
      presence: {
        allowEmpty: false,
      },
    },
  },
};

module.exports = validator;
