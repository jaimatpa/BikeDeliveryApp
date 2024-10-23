"use strict";

const {
  Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CommunicationMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.DeliveryOrders, {
        foreignKey: "DeliveryId",
        as: "deliveryOrder",
      })
    }
  };

  CommunicationMessage.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MessageText: {
      type: DataTypes.STRING
    },
    Direction: {
      type: DataTypes.INTEGER
    },
    Sent: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: "CommunicationMessage",
    timestamps: false,
    tableName: "communicationsMessages",
  });

  return CommunicationMessage;
};