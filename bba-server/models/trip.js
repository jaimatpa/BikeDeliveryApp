"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Trip extends Model {
        static associate(models) {
            // define association here
        }
    }
    Trip.init(
        {
            tripNumber: DataTypes.INTEGER,
            date: DataTypes.DATEONLY,
            truckId: DataTypes.INTEGER,
            released: DataTypes.BOOLEAN,
            complete: DataTypes.BOOLEAN,
            notifyYardMAnager: DataTypes.BOOLEAN,
            driverId: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: "Trip",
            tableName: "trips",
            timestamps: false
        }
    );
    return Trip;
};
