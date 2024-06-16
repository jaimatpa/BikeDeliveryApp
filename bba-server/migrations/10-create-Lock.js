"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Locks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      
      orderid: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      lockId: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      color: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      combination: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Locks");
  },
};
