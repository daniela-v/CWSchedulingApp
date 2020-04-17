// https://sequelize.org/v5/manual/models-definition.html
module.exports = (sequelize, type, table) => sequelize.define(`tbl_${table}`, {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: type.STRING(32),
    allowNull: false,
  },
  due_date: {
    type: type.DATE,
    allowNull: false,
  },
  completion_date: type.DATE,
  status: {
    type: type.STRING(16),
    allowNull: false,
  },
});
