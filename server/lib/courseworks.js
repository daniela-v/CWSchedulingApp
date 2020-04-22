const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { sql } = require('./db/config');

const validator = require('./validators/courseworks.validator.js');
const users = require('./users');
const milestones = require('./milestones');
const util = require('./general');

const { Courseworks, CourseworkMembers } = require('./db/models.js').models;

const courseworks = {

  async getAllCourseworks(user, data) {
    const userLookup = data.user || user;
    let foundCourseworks = [];
    if (data.global) {
      // Accessing latest public courseworks limited to 10
      const result = await Courseworks.findAll({
        where: { privacy: false },
        order: ['createdAt', 'DESC'],
        limit: 10,
      });
      foundCourseworks = result.map((r) => r.dataValues);
    } else if (userLookup) {
      // Accessing a users' courseworks
      const userFound = await users.find(userLookup, { _system: 'System called getAllCourseworks on an invalid user' });

      // Default condition
      let condition = `member = ${userFound.id}`;
      if (userFound.id !== user) {
        // If the user is viewing a different profile
        condition = `${condition} AND privacy IS FALSE`;
      }
      const queryResult = await sql.query(`SELECT * FROM tbl_coursework_members LEFT JOIN tbl_courseworks ON coursework = id WHERE ${condition}`, { type: QueryTypes.SELECT });
      const courseworkReturnPromise = queryResult.map((coursework) => this.formatCourseworkReturn(coursework));
      foundCourseworks = await Promise.all(courseworkReturnPromise);
    }
    return foundCourseworks;
  },

  async getCoursework(data) {
    const { coursework = 0 } = data;

    const found = await Courseworks.findOne({ where: { id: coursework } });
    if (!found) {
      throw { _notification: 'The coursework you\'re trying to access cannot be found' };
    }

    return this.formatCourseworkReturn(found.dataValues);
  },

  async createCoursework(user, data) {
    const error = validator.validate(data, validator.create);
    if (error) {
      throw error;
    }

    const currentDate = util.datetime.toUTC(new Date(Date.now()));
    data.expectedDate = util.datetime.toUTC(new Date(data.expectedDate));

    const { title, module, description = null, privacy = false, expectedDate } = data;

    if (expectedDate < currentDate) {
      throw { _notification: ['The expected date of the coursework cannot be earlier than the current date'] };
    }

    const owner = user;
    const shared = currentDate;

    const toInsert = { title, owner, module, description, privacy, expectedDate, shared };
    const created = await Courseworks.create(toInsert);

    const toInsertMember = { coursework: created.id, member: owner, team: 'Manager' };
    await CourseworkMembers.create(toInsertMember);

    return this.formatCourseworkReturn(created.dataValues, []);
  },

  async editCoursework(data) {
    const error = validator.validate(data, validator.create);
    if (error) {
      throw error;
    }

    const currentDate = util.datetime.toUTC(new Date(Date.now()));
    data.expectedDate = util.datetime.toUTC(new Date(data.expectedDate));

    const { coursework = 0, title, module, description = null, expectedDate } = data;

    const courseworkData = await Courseworks.findOne({ where: { id: coursework } });
    if (!courseworkData) {
      throw { _system: 'System called editCoursework on an invalid coursework' };
    }

    if (courseworkData.completedDate) {
      throw { _notification: 'You cannot edit a completed coursework' };
    }

    const copy = { ...courseworkData.dataValues, title, module, description, expectedDate };
    if (_.isEqual(copy, courseworkData.dataValues)) {
      throw { _notification: 'No changes have been made to the coursework' };
    }

    if (expectedDate < currentDate) {
      throw { _notification: ['The expected date of the coursework cannot be earlier than the current date'] };
    }

    const toUpdate = { title, module, description, expectedDate };
    await Courseworks.update(toUpdate, { where: { id: coursework } });

    return copy;
  },

  async deleteCoursework(data) {
    const error = validator.validate(data, validator.delete);
    if (error) {
      throw error;
    }

    const { coursework = 0, title } = data;

    const courseworkData = await Courseworks.findOne({ where: { id: coursework } });
    if (!courseworkData) {
      throw { _system: 'System called deleteCoursework on an invalid coursework' };
    }

    const sameTitle = (courseworkData.title === title);
    if (!sameTitle) {
      throw { title: ['You must enter the same title of the coursework you want to delete'] };
    }

    const deleted = util.datetime.toUTC(new Date(Date.now()));
    courseworkData.deleted = deleted;
    await courseworkData.save();
    return { deleted };
  },

  async changePrivacy(data) {
    const { coursework = 0, privacy } = data;

    const courseworkData = await Courseworks.findOne({ where: { id: coursework } });
    if (!courseworkData) {
      throw { _system: 'System called changePrivacy on an invalid coursework' };
    }

    const alreadyPrivate = courseworkData.privacy;
    if (privacy === alreadyPrivate) {
      throw { _notification: `The coursework is already ${alreadyPrivate ? 'private' : 'public'}` };
    }

    courseworkData.privacy = privacy;
    await courseworkData.save();

    return true;
  },

  async changeProgress(data) {
    const { coursework = 0, completed } = data;

    const courseworkData = await Courseworks.findOne({ where: { id: coursework } });
    if (!courseworkData) {
      throw { _system: 'System called changeProgress on an invalid coursework' };
    }

    const alreadyCompleted = courseworkData.completedDate;
    if (!!completed === !!alreadyCompleted) {
      throw { _notification: `The coursework is already marked as ${alreadyCompleted ? 'complete' : 'incomplete'}` };
    }

    const completedDate = (completed) ? util.datetime.toUTC(new Date(Date.now())) : null;

    courseworkData.completedDate = completedDate;
    await courseworkData.save();

    return true;
  },

  async changeShared(data) {
    const { coursework = 0, change } = data;

    const courseworkData = await Courseworks.findOne({ where: { id: coursework } });
    if (!courseworkData) {
      throw { _system: 'System called changeShared on an invalid coursework' };
    }

    if (!change && !courseworkData.shared) {
      throw { _notification: 'The coursework sharing is already disabled' };
    }

    const shared = (change) ? util.datetime.toUTC(new Date(Date.now())) : null;

    courseworkData.shared = shared;
    await courseworkData.save();

    return { shared, token: util.token.generateSharedKey(shared) };
  },

  async getParticipants(coursework, participant) {
    // Default condition
    let condition = `coursework = ${coursework}`;
    if (participant) {
      // If a specific participant is requested
      condition = `${condition} AND member = ${participant}`;
    }
    const queryResult = await sql.query(`SELECT id, username, team FROM tbl_coursework_members LEFT JOIN tbl_users ON member = id WHERE ${condition}`, { type: QueryTypes.SELECT });
    return queryResult;
  },

  async addParticipant(data) {
    const { coursework = 0, member = 0, team = 'Member' } = data;

    const courseworkData = await Courseworks.findOne({ where: { id: coursework } });
    if (!courseworkData) {
      throw { _system: 'System called addParticipant on an invalid coursework' };
    }

    const userFound = await users.find(member, { _notification: 'The user you\'re trying to invite does not exist' });

    const courseworkMember = await CourseworkMembers.findOne({ where: { coursework, member: userFound.id } });
    if (courseworkMember) {
      throw { _notification: 'The user you\'re trying to invite is already a member in this coursework' };
    }

    const toInsertMember = { coursework, member: userFound.id, team };
    await CourseworkMembers.create(toInsertMember);
    return this.getParticipants(coursework, userFound.id);
  },

  async editParticipant(data) {
    const { coursework = 0, member = 0, team = null } = data;

    const courseworkData = await Courseworks.findOne({ where: { id: coursework } });
    if (!courseworkData) {
      throw { _system: 'System called editParticipant on an invalid coursework' };
    }

    const courseworkMember = await CourseworkMembers.findOne({ where: { coursework, member } });
    if (!courseworkMember) {
      throw { _system: 'System called editParticipant on an invalid coursework member' };
    }

    const copy = { ...courseworkMember.dataValues, team };
    if (_.isEqual(copy, courseworkMember.dataValues)) {
      throw { _notification: 'No changes have been made to this member' };
    }

    const toUpdate = { team };
    await CourseworkMembers.update(toUpdate, { where: { coursework, member } });

    return copy;
  },

  async deleteParticipant(data) {
    const { coursework = 0, member = 0, username } = data;

    const courseworkData = await Courseworks.findOne({ where: { id: coursework } });
    if (!courseworkData) {
      throw { _system: 'System called deleteParticipant on an invalid coursework' };
    }

    const courseworkMember = await CourseworkMembers.findOne({ where: { coursework, member } });
    if (!courseworkMember) {
      throw { _system: 'System called deleteParticipant on an invalid coursework member' };
    }

    if (courseworkData.owner === member) {
      throw { _notification: 'You cannot remove yourself since you are the owner' };
    }

    const userFound = await users.find(member, { _system: 'System called deleteParticipant on an invalid user' });

    const sameUsername = (userFound.username === username);
    if (!sameUsername) {
      throw { username: ['You must enter the username of the user you want to delete'] };
    }

    await CourseworkMembers.destroy({ where: { coursework, member: userFound.id } });
    return true;
  },

  async formatCourseworkReturn(coursework) {
    const participantsResult = await this.getParticipants(coursework.id);
    const milestonesResult = await milestones.getAllMilestones({ coursework: coursework.id });
    return {
      ...coursework,
      participants: participantsResult,
      milestones: milestonesResult,
      sharedToken: util.token.generateSharedKey(coursework.shared),
    };
  },
};

module.exports = courseworks;
