'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Upload extends Model {
    static associate(models) {}
  };
  Upload.init({
    filename: DataTypes.STRING,
    originalName: DataTypes.STRING,
    encoding: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    size: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Upload',
    timestamps: true,
    updatedAt: false,
  });

  return Upload;
};
