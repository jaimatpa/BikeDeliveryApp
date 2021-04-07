"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Template extends Model {
    static associate(models) {
      // define association here
      
    }
  }
  Template.init(
    {
      
      body: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Templates",
    }
  );
  return Template;
};
