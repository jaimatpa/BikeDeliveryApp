"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Timeclock extends Model {
        static associate(models) {
            // define association here
        }
    };

    Timeclock.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.INTEGER,
        },
        duration: {
            type: DataTypes.INTEGER,
        },
        lat: {
            type: DataTypes.FLOAT,
        },
        lng: {
            type: DataTypes.FLOAT,
        },
        location: {
            type: DataTypes.STRING,
        },
        note: {
            type: DataTypes.STRING,
        },
        deletedAt: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: "Timeclock",
        tableName: "timeclock_logs",
    });

    return Timeclock;
};