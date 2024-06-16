"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VerificationToken extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
      }); // adds userId
    }
  }
  VerificationToken.init(
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "VerificationToken",
      timestamps: true,
      updatedAt: false,
    }
  );

  return VerificationToken;
};
