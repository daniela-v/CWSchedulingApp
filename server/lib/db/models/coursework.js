// https://sequelize.org/v5/manual/models-definition.html
const TABLE = 'tbl_coursework';

module.exports = (sequelize, type) => sequelize.define(TABLE, {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: type.STRING(32),
    allowNull: false,
  },
  module: {
    type: type.STRING(128),
    allowNull: false,
  },
  intended_date: {
    type: type.DATE,
    allowNull: false,
  },
  completion_date: type.DATE,
  status: {
    type: type.STRING(16),
    allowNull: false,
  },
});
