const _ = require('lodash');
const sequelize = require('sequelize');

const validator = require('./validators/courseworks.validator.js');
const util = require('./general');

const { Users, Courseworks, CourseworkMembers, Milestones } = require('./db/models.js').models;

const courseworks = {

  async getAllCourseworks(user, data) {
    user = data.user || user;
    let foundCourseworks;

    if (data.global) {
      // Accessing all the public courseworks
      foundCourseworks = await Courseworks.findAll({ where: { isPrivate: false } });
    } else if (user) {
      // Accessing a users' courseworks
      // Find the user either by id or username depending on what is passed
      const userFound = await Users.findOne({
        where: {
          [sequelize.Op.or]: [
            { id: user },
            { username: user },
          ],
        },
      });
      // Default condition
      let condition = { member: userFound.id };
      if (data.user) {
        // If the user is viewing a different profile
        condition = { ...condition, isPrivate: false };
      }
      foundCourseworks = await CourseworkMembers.findAll({
        include: [
          {
            model: Courseworks,
            where: {
              coursework: sequelize.col('tbl_courseworks.id'),
            },
          },
        ],
        ...condition.where,
      });
    }
    // Getting rid of all the extra fields from sequelize
    foundCourseworks = _.map((foundCourseworks, (coursework) => coursework.dataValues));
    console.log(foundCourseworks);
  },

  async getCoursework(id) {
    const courseworkFound = await Courseworks.findOne({ where: { id } });
    if (courseworkFound) {
      return courseworkFound;
    }
    throw { _notification: 'No coursework could be found with that title' };
  },
  async removeCoursework(id) {
    if (id) {
      await Courseworks.destroy({ where: { id } });
    } else {
      throw { _system: 'The id passed to the function was null/ undefined' };
    }
  },
  async createCoursework(data) {
    data.expectedDate = util.dateTime.toUTC(new Date(data.expectedDate));
    const { owner, description, title, module, deleted, isPrivate, expectedDate } = data;
    const error = validator.validate(data, validator.create);
    if (error) {
      throw error;
    }
    const currentDate = new Date(Date.now);
    if (expectedDate < currentDate) {
      throw { _notification: ['The expected date is before the current date'] };
    }
    Courseworks.create({ owner, description, title, module, deleted, isPrivate, expectedDate });
  },
  async changePrivacy(data) {
    const { id, setPrivacy } = data;
    await Courseworks.update({ is_private: setPrivacy }, { where: { id } });
  },
  async updateCoursework(data) {
    const { owner, description, title, module, deleted, isPrivate, expectedDate, id } = data;
    await Courseworks.update({ owner, description, title, module, deleted, isPrivate, expectedDate }, { where: { id } });
  },
  async findAllPublic() {
    const resultAll = await Courseworks.findAll({ where: { isPrivate: false } });
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
module.exports = courseworks;
