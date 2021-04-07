"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WebhookMap extends Model {
    static associate(models) {
      // define association here
      
    }
  }
  WebhookMap.init(
    {
      
      table_key: DataTypes.STRING,
      json_key: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "WebhookMaps",
    }
  );
  return WebhookMap;
};
