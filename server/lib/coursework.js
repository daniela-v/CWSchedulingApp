import { Op } from 'sequelize';

const { Coursework } = require('./db/models.js').models;

const coursework = {
  async getCoursework(id) {
    const courseworkFound = await Coursework.findOne({ where: { id } });
    if (courseworkFound) {
      return courseworkFound;
    }
    throw { _notification: 'No coursework could be found with that title' };
  },
  async removeCoursework(id) {
    await Coursework.destroy({
      where: {
        id: {
          [Op.like]: `%${id}%`,
        },
      },
    });
    throw { _notification: 'No coursework could be found with that title' };
  },
  async createCoursework(data) {
    const { owner, description, title, module, deleted, isPrivate, expectedDate, completedDate } = data;
    Coursework.create({ owner, description, title, module, deleted, isPrivate, expectedDate, completedDate });
  },
  async changePrivacy(data) {
    const { id, setPrivacy } = data;
    await Coursework.update({ is_private: setPrivacy }, { where: { id } });
  },
  async findAllPublic() {
    const resultAll = await Coursework.findAll({ where: { is_private: false } });
    return resultAll;
  },
  async findAllThatBelongToUser(owner) {
    const resultAll = await Coursework.findAll({ where: { owner } });
    return resultAll;
  },
};
