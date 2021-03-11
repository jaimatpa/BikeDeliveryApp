'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RelatedThings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      thingId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Things',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'cascade',
      },
      string: {
        type: Sequelize.STRING
      },
      boolean: {
        type: Sequelize.BOOLEAN
      },
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
    await queryInterface.dropTable('RelatedThings');
  }
};
