'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.DateTask, { foreignKey: 'userId' }); // one to many association
    }
  }

  // table of User
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Username is already taken', // Custom error message for uniqueness violation
        },
        validate: {
          notNull: {
            msg: 'Username cannot be null',
          },
          notEmpty: {
            msg: 'Username cannot be empty',
          },
          isAlphanumeric: {
            msg: 'Username should only contain letters and numbers',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Password cannot be null',
          },
          notEmpty: {
            msg: 'Password cannot be empty',
          },
          len: {
            args: [8, 255], // at least 8characters
            msg: 'Password must be at least 8 characters long',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};