"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Villa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Villa.belongsTo(models.Area, { foreignKey: "parent" });
    }
  }
  Villa.init({
    name: DataTypes.STRING(255),
    parent: DataTypes.INTEGER,
    priority: DataTypes.INTEGER(10),
  }, {
    sequelize,
    modelName: "Villa",
    tableName: "Villa",
    timestamps: false
  });
  return Villa;
};