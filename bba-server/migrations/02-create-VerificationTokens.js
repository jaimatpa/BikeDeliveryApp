'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('VerificationTokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'cascade',
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
    // Expire tokens after 1 day (check every hour)
    queryInterface.sequelize.query(`
      CREATE EVENT IF NOT EXISTS expireVerificationTokens
      ON SCHEDULE EVERY 1 HOUR
      DO DELETE FROM verificationtokens WHERE createdAt < DATE_SUB(NOW(), INTERVAL 1 DAY);
    `)
    console.log('expireVerificationTokens event created')
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('VerificationTokens')
    queryInterface.sequelize.query(`DROP EVENT IF EXISTS expireVerificationTokens`)
    console.log('expireVerificationTokens event dropped')
  }
};
