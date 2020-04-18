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
    type: type.STRING(128),
    allowNull: false,
  },
  description: type.TEXT,
  started_date: {
    type: type.DATE,
    allowNull: false,
  },
  expected_date: {
    type: type.DATE,
    allowNull: false,
  },
  completed_date: type.DATE,
});
