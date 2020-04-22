const _ = require('lodash');
const validator = require('./validators/milestones.validator.js');
const util = require('./general');

const { Courseworks, Milestones } = require('./db/models.js').models;

const milestones = {

  async getAllMilestones(data) {
    const { coursework = 0 } = data;

    const result = await Milestones.findAll({ where: { coursework } });
    return result.map((r) => r.dataValues);
  },

  async getMilestone(data) {
    const { coursework = 0, milestone = 0 } = data;

    const result = await Milestones.findOne({ where: { id: milestone, coursework } });
    if (!result) {
      throw { _notification: 'The milestone you\'re trying to access cannot be found' };
    }

    return result.dataValues;
  },

  async createMilestone(data) {
    const error = validator.validate(data, validator.create);
    if (error) {
      throw error;
    }

    data.startedDate = util.datetime.toUTC(new Date(data.startedDate));
    data.expectedDate = util.datetime.toUTC(new Date(data.expectedDate));

    const { coursework = 0, title, description = null, startedDate, expectedDate } = data;

    const courseworkData = await Courseworks.findOne({ where: { id: coursework } });
    if (!courseworkData) {
      throw { _system: 'System called createMilestone on an invalid coursework' };
    }

    if (courseworkData.completedDate) {
      throw { _notification: 'You cannot create a milestone in a completed coursework' };
    }

    if (startedDate < courseworkData.createdAt) {
      throw { startedDate: ['The start date of the milestone cannot be earlier than the date the coursework has been created'] };
    }
    if (expectedDate > courseworkData.expectedDate) {
      throw { expectedDate: ['The expected date of the milestone cannot be later than the expected date of the coursework'] };
    }
    if (startedDate >= expectedDate) {
      throw { startedDate: ['The start date cannot be later than the expected date'] };
    }

    const toInsert = { coursework, title, description, startedDate, expectedDate };
    const created = await Milestones.create(toInsert);
    return created.dataValues;
  },

  async editMilestone(data) {
    const error = validator.validate(data, validator.create);
    if (error) {
      throw error;
    }

    data.startedDate = util.datetime.toUTC(new Date(data.startedDate));
    data.expectedDate = util.datetime.toUTC(new Date(data.expectedDate));

    const { coursework = 0, milestone = 0, title, description = null, startedDate, expectedDate } = data;

    const courseworkData = await Courseworks.findOne({ where: { id: coursework } });
    if (!courseworkData) {
      throw { _system: 'System called editMilestone on an invalid coursework' };
    }

    if (courseworkData.completedDate) {
      throw { _notification: 'You cannot edit a milestone in a completed coursework' };
    }

    const milestoneData = await Milestones.findOne({ where: { id: milestone, coursework } });
    if (!milestoneData) {
      throw { _system: 'System called editMilestone on an invalid milestone' };
    }

    if (milestoneData.completedDate) {
      throw { _notification: 'You cannot edit a completed milestone' };
    }

    const copy = { ...milestoneData.dataValues, title, description, startedDate, expectedDate };
    if (_.isEqual(copy, milestoneData.dataValues)) {
      throw { _notification: 'No changes have been made to the milestone' };
    }

    if (startedDate < courseworkData.createdAt) {
      throw { startedDate: ['The start date of the milestone cannot be earlier than the date the coursework has been created'] };
    }
    if (expectedDate > courseworkData.expectedDate) {
      throw { expectedDate: ['The expected date of the milestone cannot be later than the expected date of the coursework'] };
    }
    if (startedDate >= expectedDate) {
      throw { startedDate: ['The start date cannot be later than the expected date'] };
    }

    const toUpdate = { title, description, startedDate, expectedDate };
    await Milestones.update(toUpdate, { where: { id: milestone, coursework } });

    return copy;
  },

  async deleteMilestone(data) {
    const error = validator.validate(data, validator.delete);
    if (error) {
      throw error;
    }

    const { coursework = 0, milestone = 0, title } = data;

    const milestoneData = await Milestones.findOne({ where: { id: milestone, coursework } });
    if (!milestoneData) {
      throw { _system: 'System called deleteMilestone on an invalid milestone' };
    }

    const sameTitle = (milestoneData.title === title);
    if (!sameTitle) {
      throw { title: ['You must enter the same title of the milestone you want to delete'] };
    }

    await Milestones.destroy({ where: { id: milestone, coursework } });
    return true;
  },

  async changeProgress(data) {
    const { coursework = 0, milestone = 0, completed } = data;

    const milestoneData = await Milestones.findOne({ where: { id: milestone, coursework } });
    if (!milestoneData) {
      throw { _system: 'System called changeProgress on an invalid milestone' };
    }

    const alreadyCompleted = milestoneData.completedDate;
    if (!!completed === !!alreadyCompleted) {
      throw { _notification: `The milestone is already marked as ${alreadyCompleted ? 'complete' : 'incomplete'}` };
    }

    const completedDate = (completed) ? util.datetime.toUTC(new Date(Date.now())) : null;

    const toUpdate = { completedDate };
    await Milestones.update(toUpdate, { where: { id: milestone, coursework } });

    return true;
  },
};

module.exports = milestones;
