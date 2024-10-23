"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class StreetAddress extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            StreetAddress.belongsTo(models.Villa, { foreignKey: "parent" });
        }
    }
    StreetAddress.init({
        name: DataTypes.STRING(255),
        bikeRack: DataTypes.STRING(255),
        parent: DataTypes.INTEGER,
        priority: DataTypes.INTEGER(10),
    }, {
        sequelize,
        modelName: "StreetAddress",
        tableName: "street_address",
        timestamps: false
    });
    return StreetAddress;
};