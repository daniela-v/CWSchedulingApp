// https://sequelize.org/v5/manual/models-definition.html
module.exports = (sequelize, type, table) => sequelize.define(`tbl_${table}`, {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  owner: {
    type: type.STRING(32),
    allowNull: false,
  },
  description: {
    type: type.STRING(500),
    allowNull: true,
  },
  title: {
    type: type.STRING(32),
    allowNull: false,
  },
  module: {
    type: type.STRING(128),
    allowNull: false,
  },
  deleted: {
    type: type.DATE,
    allowNull: true,
  },
  isPrivate: {
    type: type.Boolean,
    allowNull: false,
  },
  expectedDate: {
    type: type.DATE,
    allowNull: false,
  },
  completedDate: type.DATE,
  status: {
    type: type.STRING(16),
    allowNull: false,
  },
});
