"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WebHook extends Model {
    static associate(models) {
      // define association here
    }
  }
  WebHook.init(
    {
      webHookUrl: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "WebHook",
    }
  );
  return WebHook;
};
