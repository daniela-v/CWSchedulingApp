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
  description: {
    type: type.STRING(1024),
    allowNull: true,
  },
  title: {
    type: type.STRING(32),
    allowNull: false,
  },
  module: {
    type: type.STRING(32),
    allowNull: false,
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
    presence: {
      allowEmpty: false,
    },
    type: {
      type: (value) => {
        const isDate = new Date(value);
        return !(Number.isNaN(isDate.getTime()));
      },
      message: () => 'must be a valid date',
    },
  },
  completedDate: type.DATE,
});
