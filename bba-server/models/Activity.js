"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Activity extends Model {
        static associate(models) {
            // define association here
        }
    };

    Activity.init({
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
        LocationId: {
            type: DataTypes.INTEGER,
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
        modelName: "Activity",
        tableName: "activities",
        timestamps: false
    });

    return Activity;
};