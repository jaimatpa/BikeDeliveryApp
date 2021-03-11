'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Things', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      string: {
        type: Sequelize.STRING
      },
      boolean: {
        type: Sequelize.BOOLEAN
      },
      integer: Sequelize.INTEGER,
      text: Sequelize.TEXT,
      char5: Sequelize.CHAR(5),
      double: Sequelize.DOUBLE,
      dateOnly: Sequelize.DATEONLY,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Things');
  }
};
