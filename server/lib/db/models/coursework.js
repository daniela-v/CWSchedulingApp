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
  private: {
    type: type.Boolean,
    allowNull: false,
  },
  createdAt: {
    type: type.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: type.DATE,
    allowNull: true,
  },
  expected_date: {
    type: type.DATE,
    allowNull: false,
  },
  completed_date: type.DATE,
  status: {
    type: type.STRING(16),
    allowNull: false,
  },
});
