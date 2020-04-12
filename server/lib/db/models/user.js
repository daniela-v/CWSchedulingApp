// https://sequelize.org/v5/manual/models-definition.html
module.exports = (sequelize, type) => sequelize.define('tbl_users', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: type.STRING(32),
    allowNull: false,
  },
  password: {
    type: type.STRING(128),
    allowNull: false,
  },
  email: {
    type: type.STRING(128),
    allowNull: false,
  },
  recovery: {
    type: type.STRING(128),
    allowNull: true,
  },
});
