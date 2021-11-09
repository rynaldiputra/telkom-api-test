'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RefreshTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING
      },
      expires: {
        type: Sequelize.DATE
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false, defaultValue: Sequelize.NOW
      },
      createdByIp: {
        type: Sequelize.STRING
      },
      revoked: {
        type: Sequelize.DATE
      },
      revokedByIp: {
        type: Sequelize.DATE
      },
      replacedByToken: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('RefreshTokens');
  }
};