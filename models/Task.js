const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DateTask = sequelize.define('DateTask', {
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
  });

  DateTask.associate = (models) => {
    DateTask.belongsTo(models.User);
  };

  return DateTask;
};
