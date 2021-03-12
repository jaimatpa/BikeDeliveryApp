'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Uploads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      filename: Sequelize.STRING,
      originalName: Sequelize.STRING,
      encoding: Sequelize.STRING,
      mimetype: Sequelize.STRING,
      size: Sequelize.INTEGER,
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Uploads');
  }
};
