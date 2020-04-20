const { Coursework } = require('./db/models.js').models;

const courseworks = {
  async getCoursework(id) {
    const courseworkFound = await Coursework.findOne({ where: { id } });
    if (courseworkFound) {
      return courseworkFound;
    }
    throw { _notification: 'No coursework could be found with that title' };
  },
  async removeCoursework(id) {
    await Coursework.destroy({ where: { id } });
    throw { _notification: 'No coursework could be found with that title' };
  },
  async createCoursework(data) {
    const { owner, description, title, module, deleted, isPrivate, expectedDate, completedDate, status } = data;
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
};
module.exports = courseworks;
