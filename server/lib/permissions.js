const { Coursework } = require('./db/models');

module.exports = {
  // hasCourseworkReadOnlyPermission(user, coursework) {
  //   const result = Coursework.findOne({ id: coursework, owner: user });
  // },
  hasCourseworkWritePermission(user, coursework) {
    if (!user) {
      throw { _notification: 'You cannot perform this operation while logged out' };
    }
    if (!coursework) {
      // This should never happen which is why a system level error is thrown
      throw { _system: 'System called hasCourseworkWritePermission without a coursework' };
    }
    const result = Coursework.findOne({ id: coursework, owner: user });
    if (!result) {
      throw { _notification: 'You are not the owner of this coursework' };
    }
    return true;
  },
};
