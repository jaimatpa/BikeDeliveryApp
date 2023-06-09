"use strict";
const bcrypt = require("bcrypt");
const saltRounds = 12;

const { Model } = require("sequelize");
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
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
      userType: DataTypes.INTEGER,
      displayName: {
        type: DataTypes.VIRTUAL,
        get() {
          if (this.name) return this.name;
          else return this.email;
        },
        set(value) {
          throw new Error("Unable to set displayName.");
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      paranoid: true,
    }
  );

  User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  User.prototype.encryptPassword = async function (password) {
    return await bcrypt.hash(user.password, saltRounds);
  };
  User.beforeUpdate(async (user, options) => {
    if (user.changed("password") && user.password)
      user.password = await bcrypt.hash(user.password, saltRounds);
  });
  User.beforeCreate(async (user, options) => {
    user.password = await bcrypt.hash(user.password, saltRounds);
  });

  return User;
};
