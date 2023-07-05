"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DeliveryExtras extends Model {
    static associate(models) {
      // define association here
      /*this.belongsTo(models.DeliveryItem, {
        foreignKey: { name: "deliveryOrderId", allowNull: false },
      });*/ 
    }
  }
  DeliveryExtras.init(
    {
      deliveryOrderId: DataTypes.INTEGER,
      extraName: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: "DeliveryExtras",
    }
  );
  return DeliveryExtras;
};
