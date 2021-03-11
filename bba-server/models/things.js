'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Thing extends Model {
    static associate(models) {
      this.hasMany(models.RelatedThing, { foreignKey: { name: 'thingId', allowNull: false } }); // adds thingId to RelatedThings
    }
  };
  Thing.init({
    string: DataTypes.STRING,
    boolean: DataTypes.BOOLEAN,
    integer: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    char5: DataTypes.CHAR(5),
    double: DataTypes.DOUBLE,
    dateOnly: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'Thing',
    timestamps: true,
  });

  return Thing;
};
