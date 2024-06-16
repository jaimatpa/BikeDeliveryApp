"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {
      // define association here
      
    }
  }
  Log.init(
    {
      json: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Logs",
    }
  );
  return Log;
};
