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
  status: {
    length: {
      maximum: 100,
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
};

module.exports = validator;
