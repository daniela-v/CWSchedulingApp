const validate = require('validate.js');
const validators = require('./validators/milestones.validator.js');

const { Coursework, Milestones } = require('./db/models.js').models;

const milestones = {

  async getAllMilestones(data) {
    const { coursework } = data;
    const result = await Milestones.findAll({ where: { coursework } });
    return result;
  },

  async getMilestone(data) {
    const { coursework, milestone } = data;
    if (!milestone) {
      throw { _system: 'System called getMilestone on an invalid milestone' };
    }
    const result = await Milestones.findOne({ where: { id: milestone, coursework } });
    if (!result) {
      throw { _notification: 'The milestone you\'re trying to access cannot be found' };
    }
    return result;
  },

  async createMilestone(data) {
    const error = validate(data, validators.create);
    if (error) {
      throw error;
    }

    data.startedDate = new Date(data.startedDate).getTime();
    data.expectedDate = new Date(data.expectedDate).getTime();

    const { coursework, title, description, startedDate, expectedDate } = data;
    const courseworkData = Coursework.findOne({ where: { id: coursework || 0 } });
    if (!courseworkData) {
      throw { _system: 'System called createMilestone on an invalid coursework' };
    }
    if (startedDate < courseworkData.createdAt) {
      throw { startedDate: ['The start date of the milestone cannot be earlier than the date the coursework has been created'] };
    }
    if (expectedDate > courseworkData.expectedDate) {
      throw { expectedDate: ['The expected date of the milestone cannot be later than the expected date of the coursework'] };
    }
    await Milestones.create({
      coursework,
      title,
      description,
      startedDate,
      expectedDate,
    });
    return true;
  },

  async editMilestone(data) {
    const error = validate(data, validators.create);
    if (error) {
      throw error;
    }

    data.startedDate = new Date(data.startedDate).getTime();
    data.expectedDate = new Date(data.expectedDate).getTime();

    const { coursework, milestone, title, description, startedDate, expectedDate, completedDate } = data;
    const courseworkData = Coursework.findOne({ where: { id: coursework } });
    if (!courseworkData) {
      throw { _system: 'System called editMilestone on an invalid coursework' };
    }
    if (startedDate < courseworkData.createdAt) {
      throw { startedDate: ['The start date of the milestone cannot be earlier than the date the coursework has been created'] };
    }
    if (expectedDate > courseworkData.expectedDate) {
      throw { expectedDate: ['The expected date of the milestone cannot be later than the expected date of the coursework'] };
    }
    const [affectedRows] = await Milestones.update({
      title,
      description,
      startedDate,
      expectedDate,
      completedDate,
    }, { where: { id: milestone } });
    if (!affectedRows) {
      throw { _system: 'System called editMilestone on an invalid milestone' };
    }
    return true;
  },

  async deleteMilestone(data) {
    const error = validate(data, validators.delete);
    if (error) {
      throw error;
    }
    const { milestone, title } = data;
    const milestoneData = Milestones.findOne({ where: { id: milestone } });
    if (!milestoneData) {
      throw { _system: 'System called deleteMilestone on an invalid milestone' };
    }
    const sameTitle = (milestoneData.title === title);
    if (!sameTitle) {
      throw { title: ['You must enter the title of the milestone you want to delete'] };
    }
    await Milestones.destroy({ where: { id: milestone } });
    return true;
  },

  async setMilestoneProgress(data) {
    const { milestone, completed } = data;
    const milestoneData = Milestones.findOne({ where: { id: milestone } });
    if (!milestoneData) {
      throw { _system: 'System called setMilestoneProgress on an invalid milestone' };
    }
    const alreadyCompleted = (milestone.completedDate);
    if (!!completed === !!milestone.completedDate) {
      throw { _notification: `The milestone is already marked as ${alreadyCompleted ? 'complete' : 'incomplete'}` };
    }
    const [affectedRows] = await Milestones.update({
      completedDate: (completed) ? Date.now() : null,
    }, { where: { id: milestone } });
    if (!affectedRows) {
      throw { _system: 'System called setMilestoneProgress on an invalid milestone' };
    }
    return true;
  },
};

module.exports = milestones;
