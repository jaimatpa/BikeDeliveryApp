"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class EquipmentType extends Model {
        static associate(models) {
            // define association here
        }
    };

    EquipmentType.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Label: {
            type: DataTypes.STRING,
        },
        BarcodePrefix: {
            type: DataTypes.STRING,
        },
        CapacityConsumption: {
            type: DataTypes.INTEGER,
        },
        IsDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        ProductLineId: {
            type: DataTypes.STRING,
        },
        qty: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        qtyAvailable: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        sequelize,
        modelName: "EquipmentType",
        tableName: "equipment_type",
        timestamps: false
    });

    return EquipmentType;
};