const { Milestones } = require('./db/models.js').models;

const milestones = {

  async getAllMilestones(data) {
    const { coursework } = data;
    if (!coursework) {
      throw { _system: 'System called getAllMilestones with missing parameters' };
    }
    const result = await Milestones.findAll({ where: { coursework } });
    return result;
  },

  async getMilestone(data) {
    const { coursework, milestone } = data;
    if (!coursework || !milestone) {
      throw { _system: 'System called getMilestone with missing parameters' };
    }
    const result = await Milestones.findOne({ where: { id: milestone, coursework } });
    if (!result) {
      throw { _notification: 'The milestone you\'re trying to access cannot be found' };
    }
    return result;
  },
};

module.exports = milestones;
