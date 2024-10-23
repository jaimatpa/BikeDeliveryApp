"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ProblemType extends Model {
        static associate(models) {
            // define association here
        }
    };

    ProblemType.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Name: {
            type: DataTypes.STRING,
        },
        Description: {
            type: DataTypes.STRING,
        },
    }, {
        sequelize,
        modelName: "ProblemType",
        tableName: "problem_types",
        timestamps: false
    });

    return ProblemType;
};