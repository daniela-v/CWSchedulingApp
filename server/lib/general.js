const jwt = require('jsonwebtoken');

module.exports = {
  token: {
    generateSharedKey(date) {
      return (date) ? jwt.sign('correct', `${new Date(date)}`) : null;
    },
  },
  datetime: {
    toUTC(date) {
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    },
    fromUTC(date) {
      return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    },
  },
};
