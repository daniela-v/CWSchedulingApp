const { Coursework } = require('./db/models.js').models;

const coursework = {
  async getCoursework(title) {
    const courseworkFound = await Coursework.findOne(title);
    if (courseworkFound) {
      return courseworkFound;
    }
    return 'No coursework could be found with that title';
  },
};

function getCourseworks(name) {
  Coursework.findOne({ where: { name } });
}
