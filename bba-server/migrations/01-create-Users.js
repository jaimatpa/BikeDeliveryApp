"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      userType: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        comment: "1=client; 2=delivery driver; 3=system admin"
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    // Expire users after 1 month of being unverified (check every day)
    queryInterface.sequelize.query(`
      CREATE EVENT IF NOT EXISTS expireUsers
      ON SCHEDULE EVERY 1 DAY
      DO DELETE FROM users WHERE isVerified = FALSE AND createdAt < DATE_SUB(NOW(), INTERVAL 1 MONTH);
    `);
    console.log("expireUsers event created");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
    queryInterface.sequelize.query(`DROP EVENT IF EXISTS expireUsers`);
    console.log("expireUsers event dropped");
  },
};
