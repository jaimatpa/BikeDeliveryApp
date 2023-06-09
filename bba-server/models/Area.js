"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Area.init({
    name: DataTypes.STRING(255),
    priority: DataTypes.INTEGER(10),
  }, {
    sequelize,
    modelName: "Area",
    tableName: "Area",
    timestamps: false
  });
  return Area;
};