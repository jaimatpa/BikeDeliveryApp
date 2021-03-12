"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResetToken extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
      }); // adds userId
    }
  }
  ResetToken.init(
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ResetToken",
      timestamps: true,
      updatedAt: false,
    }
  );

  return ResetToken;
};
