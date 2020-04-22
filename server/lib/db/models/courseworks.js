// https://sequelize.org/v5/manual/models-definition.html
module.exports = (sequelize, type, table) => sequelize.define(`tbl_${table}`, {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  owner: {
    type: type.INTEGER,
    allowNull: false,
  },
  title: {
    type: type.STRING(32),
    allowNull: false,
  },
  module: {
    type: type.STRING(32),
    allowNull: false,
  },
  description: {
    type: type.STRING(1024),
    allowNull: true,
  },
  deleted: {
    type: type.DATE,
    allowNull: true,
  },
  isPrivate: {
    type: type.BOOLEAN,
    allowNull: false,
  },
  expectedDate: {
    type: type.DATE,
    allowNull: false,
  },
  completedDate: type.DATE,
  shared: type.DATE,
});
