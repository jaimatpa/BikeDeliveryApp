"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DeliveryOrder extends Model {
    static associate(models) {
      // define association here
      
    }
  }
  DeliveryOrder.init(
    {
      date: DataTypes.DATE,
      name: DataTypes.STRING,
      location: DataTypes.STRING,
      orderid: DataTypes.STRING,
      rack: DataTypes.STRING,
      color: DataTypes.STRING,
      combination: DataTypes.STRING,
      lock: DataTypes.STRING,
      mobileNo: DataTypes.STRING,
      barcode: DataTypes.STRING,
      status: DataTypes.INTEGER,
      updatedAt: DataTypes.DATE,
      email: DataTypes.STRING,
      note: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "DeliveryOrders",
    }
  );
  return DeliveryOrder;
};
