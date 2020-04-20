// https://sequelize.org/v5/manual/models-definition.html
module.exports = (sequelize, type, table) => sequelize.define(`tbl_${table}`, {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  coursework: {
    type: type.INTEGER,
    allowNull: false,
  },
  title: {
    type: type.STRING(32),
    allowNull: false,
  },
  description: type.STRING(1024),
  startedDate: {
    type: type.DATE,
    allowNull: false,
  },
  expectedDate: {
    type: type.DATE,
    allowNull: false,
  },
  completedDate: type.DATE,
});
