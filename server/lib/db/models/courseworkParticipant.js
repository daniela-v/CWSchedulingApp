// https://sequelize.org/v5/manual/models-definition.html
module.exports = (sequelize, type, table) => sequelize.define(`tbl_${table}`, {
  coursework: {
    type: type.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  user: {
    type: type.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  team: type.STRING(128),
});
