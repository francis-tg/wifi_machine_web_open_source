'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      timeleft: {
        type: Sequelize.STRING
      },
      expiration: {
        type: Sequelize.DATE,
        default: null
      },
      archive: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      disabled: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      price: {
        type: Sequelize.INTEGER
      },
      forfait: {
        type: Sequelize.STRING
      },
      dateAchat: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Tickets');
  }
};