"use strict";
const { Sequelize, DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Achat_ticket_logs", "code", {
      type: DataTypes.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn("Achat_ticket_logs", "code", {
      /* query options */
    });
  },
};
