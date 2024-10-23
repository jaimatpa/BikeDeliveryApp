"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Deal extends Model {
        static associate(models) {
            // define association here
        }
    };

    Deal.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Title: {
            type: DataTypes.STRING,
        },
        Description: {
            type: DataTypes.STRING,
        },
        ImagePath: {
            type: DataTypes.STRING,
        },
        WebPath: {
            type: DataTypes.STRING,
        },
        Notes: {
            type: DataTypes.STRING,
        },
        Status: {
            type: DataTypes.STRING,
        },
        TimeStamp: {
            type: DataTypes.DATE,
        }
    }, {
        sequelize,
        modelName: "Deal",
        tableName: "deals",
    });

    return Deal;
};