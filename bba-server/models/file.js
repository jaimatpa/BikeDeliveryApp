"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      // define association here
      
    }
  }
  File.init(
    {
      
      orderid: DataTypes.STRING,
      filepath: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Files",
      tableName: "files",
    }
  );
  return File;
};
