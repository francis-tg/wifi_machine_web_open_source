'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Machine_infos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      machineName: {
        type: Sequelize.STRING
      },
      screenMessage: {
        type: Sequelize.STRING
      },
      promoMessage: {
        type: Sequelize.STRING
      },
      machineId: {
        type: Sequelize.STRING
      },
      version: {
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
    await queryInterface.dropTable('Machine_infos');
  }
};