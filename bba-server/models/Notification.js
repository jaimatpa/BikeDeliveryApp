"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
    message: DataTypes.STRING(255),
    type: DataTypes.BOOLEAN,
    deliveryOrderId: DataTypes.INTEGER(10),
    tripId: DataTypes.INTEGER(10),
    userId: DataTypes.INTEGER(10),
    createdAt: DataTypes.DATE 
  }, {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: false
  });

  Notification.associate = function(models) {
    Notification.hasOne(models.DeliveryOrders, {foreignKey: 'id', sourceKey: 'deliveryOrderId'});
  }
  return Notification;
};