const { Courseworks } = require('./db/models.js').models;

const courseworks = {
  async getCoursework(id) {
    const courseworkFound = await Courseworks.findOne({ where: { id } });
    if (courseworkFound) {
      return courseworkFound;
    }
    throw { _notification: 'No coursework could be found with that title' };
  },
  async removeCoursework(id) {
    await Courseworks.destroy({ where: { id } });
    throw { _notification: 'No coursework could be found with that title' };
  },
  async createCoursework(data) {
    const { owner, description, title, module, deleted, isPrivate, expectedDate, completedDate } = data;
    Courseworks.create({ owner, description, title, module, deleted, isPrivate, expectedDate, completedDate });
  },
  async changePrivacy(data) {
    const { id, setPrivacy } = data;
    await Courseworks.update({ is_private: setPrivacy }, { where: { id } });
  },
  async findAllPublic() {
    const resultAll = await Courseworks.findAll({ where: { is_private: false } });
    return resultAll;
  },
  async findAllThatBelongToUser(owner) {
    const resultAll = await Courseworks.findAll({ where: { owner } });
    if (!resultAll) {
      throw { _notification: 'There are no courseworks that belong to that user' };
    }
    return resultAll;
  },
};
