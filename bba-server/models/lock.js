"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Lock extends Model {
    static associate(models) {
      // define association here
      
    }
  }
  Lock.init(
    {
      lockId: DataTypes.STRING,
      color: DataTypes.STRING,
      combination: DataTypes.STRING,
      ColorValue: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Locks",
    }
  );
  return Lock;
};
