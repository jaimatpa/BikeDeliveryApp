'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 12;

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [[7, 50]],
          msg: "Email should be between 7 and 50 characters"
        }
      }
    },
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    isVerified: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: 'User',
  });

  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };
  User.prototype.encryptPassword = async function(password) {
    return await bcrypt.hash(user.password, saltRounds);
  };
  User.beforeUpdate(async (user, options) => {
    if (user.changed('password') && user.password)
      user.password = await bcrypt.hash(user.password, saltRounds);
  });
  User.beforeCreate(async (user, options) => {
    user.password = await bcrypt.hash(user.password, saltRounds);
  });

  return User;
};