'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DateTask extends Model {
    static associate(models) {
      DateTask.belongsTo(models.User, { foreignKey: 'userId' });//one to many association
    }
  }

  // table of Datetask
  DateTask.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'DateTask',
  });

  return DateTask;
};