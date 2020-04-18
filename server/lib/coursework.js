import { Op } from 'sequelize';

const { Coursework } = require('./db/models.js').models;

const coursework = {
  async getCoursework(id) {
    const courseworkFound = await Coursework.findOne({
      where: {
        id: {
          [Op.like]: `%${id}%`,
        },
      },
    });
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
};
