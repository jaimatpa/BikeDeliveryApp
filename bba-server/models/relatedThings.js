'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RelatedThing extends Model {
    static associate(models) {
      this.belongsTo(models.Thing, { foreignKey: { name: 'thingId', allowNull: false } }); // adds thingId
    }
  };
  RelatedThing.init({
    string: DataTypes.STRING,
    boolean: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'RelatedThing',
  });

  return RelatedThing;
};
