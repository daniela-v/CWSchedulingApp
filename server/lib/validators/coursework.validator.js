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
        maximum: 200,
      },
      format: {
        pattern: '[a-z0-9 ]+',
        flags: 'i',
        message: 'must contain only alphanumeric characters, numbers or spaces',
      },
    },
    owner: {
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
    module: {
      length: {
        maximum: 100,
      },
    },
    deleted: {
      presence: {
        allowEmpty: false,
      },
    },
    description: {
      length: {
        maximum: 1024,
      },
    },
    isPrivate: {
      presence: {
        allowEmpty: false,
      },
    },
    completedDate: {
      presence: {
        allowEmpty: false,
      },
    },
    status: {
      length: {
        maximum: 100,
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
