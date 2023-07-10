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
      note: DataTypes.STRING,
      plantation: DataTypes.STRING,
      area: DataTypes.STRING,
      // email: DataTypes.STRING,
      endDate: DataTypes.DATE,
      PickedUp: DataTypes.BOOLEAN,
      PickupNotes: DataTypes.STRING,
      truckID: DataTypes.INTEGER,
      tripID1: DataTypes.INTEGER,
      tripID2: DataTypes.INTEGER,
      textSent: DataTypes.BOOLEAN,
      picturesSent: DataTypes.BOOLEAN,
      driverDeliveredBy: DataTypes.STRING,
      driverPickedUpBy: DataTypes.STRING,
      swapOrder: DataTypes.BOOLEAN,
      swapOrderDeliveryId: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "DeliveryOrders",
    }
  );
  return DeliveryOrder;
};
