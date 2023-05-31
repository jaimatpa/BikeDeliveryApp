'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Truck extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Truck.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    notes: DataTypes.STRING,
    LicensePlate: DataTypes.STRING,
    TruckName: DataTypes.STRING,
    MaxCapacity: DataTypes.STRING,
    HHI_Resort: DataTypes.STRING,
    Ocean_1: DataTypes.STRING,
    PD_Pass: DataTypes.STRING,
    SP_Pass: DataTypes.STRING,
    SY_Pass: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Truck',
    timestamps: true,
  });

  Truck.beforeCreate((truck, _) => {
    truck.createdAt = new Date();
    truck.updatedAt = new Date();
  });

  Truck.beforeUpdate((truck, _) => {
    truck.updatedAt = new Date();
  });

  return Truck;
};