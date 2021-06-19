"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DeliveryItem extends Model {
    static associate(models) {
      // define association here
      
    }
  }
  DeliveryItem.init(
    {
      deliveryID: DataTypes.INTEGER,
      item: DataTypes.STRING,
      serialbarcode: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      checkedDelievery: DataTypes.BOOLEAN,
      checkPickup: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "DeliveryItem",
    }
  );
  return DeliveryItem;
};
