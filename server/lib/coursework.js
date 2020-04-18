import { Op } from 'sequelize';

const { Coursework } = require('./db/models.js').models;

const coursework = {
  async getCoursework(title) {
    const courseworkFound = await Coursework.findOne({
      where: {
        title: {
          [Op.like]: `%${title}%`,
        },
      },
    });
    if (courseworkFound) {
      return courseworkFound;
    }
    throw { _notification: 'No coursework could be found with that title' };
  },
};
