const { Milestones } = require('./db/models.js').models;

const milestones = {
  async getAllMilestones(data) {
    if (!data) {
      throw { _notification: 'Invalid coursework specified' };
    }
    const { coursework } = data;
    const result = await Milestones.findAll({ where: { coursework } });
    return result;
  },
};

module.exports = milestones;
