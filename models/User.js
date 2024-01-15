const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.DateTask);
  };

  return User;
};