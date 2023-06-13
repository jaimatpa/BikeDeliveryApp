"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Problem extends Model {
        static associate(models) {
            // define association here
        }
    };

    Problem.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Notes: {
            type: DataTypes.STRING,
        },
        Status: {
            type: DataTypes.STRING,
        },
        TypeDesc: {
            type: DataTypes.STRING,
        },
        Tag: {
            type: DataTypes.STRING,
        },
        Email: {
            type: DataTypes.STRING,
        },
        Barcode: {
            type: DataTypes.STRING,
        },
        TimeStamp: {
            type: DataTypes.DATE,
        },
    }, {
        sequelize,
        modelName: "Problem",
        tableName: "Problems",
        timestamps: false
    });

    return Problem;
};