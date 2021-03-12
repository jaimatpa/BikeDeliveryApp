"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ResetTokens", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
        onDelete: "cascade",
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Expire tokens after 1 hour (check every 15 minutes)
    queryInterface.sequelize.query(`
      CREATE EVENT IF NOT EXISTS expireResetTokens
      ON SCHEDULE EVERY 15 MINUTE
      DO DELETE FROM resettokens WHERE createdAt < DATE_SUB(NOW(), INTERVAL 1 HOUR);
    `);
    console.log("expireResetTokens event created");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ResetTokens");
    queryInterface.sequelize.query(`DROP EVENT IF EXISTS expireResetTokens`);
    console.log("expireResetTokens event dropped");
  },
};
