'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Server_data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mikrotik_address: {
        type: Sequelize.STRING
      },
      mikrotik_username: {
        type: Sequelize.STRING
      },
      mikrotik_password: {
        type: Sequelize.STRING
      },
      ticket_header: {
        type: Sequelize.STRING
      },
      ticket_footer: {
        type: Sequelize.STRING
      },
      printer_address: {
        type: Sequelize.STRING
      },
      ngrok_token: {
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
    await queryInterface.dropTable('Server_data');
  }
};