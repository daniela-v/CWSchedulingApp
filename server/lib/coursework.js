const { Coursework } = require('./db/models.js').models;
const validate = require('validate.js');
const validators = require('./validators/coursework.validator.js');

const courseworks = {

  async getCoursework(id) {
    const courseworkFound = await Coursework.findOne({ where: { id } });
    if (courseworkFound) {
      return courseworkFound;
    }
    throw { _notification: 'No coursework could be found with that title' };
  },
  async removeCoursework(id) {
    if (id) {
      await Coursework.destroy({ where: { id } });
    } else {
      throw { _system: 'The id passed to the function was null/ undefined' };
    }
  },
  async createCoursework(data) {
    const { owner, description, title, module, deleted, isPrivate, expectedDate, completedDate, status } = data;
    const error = validate(data, validators.create);
    if (error) {
      throw error;
    }
    Coursework.create({ owner, description, title, module, deleted, isPrivate, expectedDate, completedDate, status });
  },
  async changePrivacy(data) {
    const { id, setPrivacy } = data;
    await Coursework.update({ is_private: setPrivacy }, { where: { id } });
  },
  async updateCoursework(data) {
    const { owner, description, title, module, deleted, isPrivate, expectedDate, completedDate, status, id } = data;
    await Coursework.update({ owner, description, title, module, deleted, isPrivate, expectedDate, completedDate, status }, { where: { id } });
  },
  async findAllPublic() {
    const resultAll = await Coursework.findAll({ where: { isPrivate: false } });
    return resultAll;
  },
  async findAllThatBelongToUser(owner) {
    const resultAll = await Coursework.findAll({ where: { owner } });
    if (!resultAll) {
      throw { _notification: 'There are no courseworks that belong to that user' };
    }
    return resultAll;
  },

  async hasCourseworkWritePermission(user, coursework) {
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
module.exports = courseworks;
