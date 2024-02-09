'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        await queryInterface.addColumn(
            'Ventes',
            'user_id', {
                type: Sequelize.DataTypes.INTEGER,
                onDelete: "CASCADE",
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                    as: "user_id",
                },
            },
        );

    },

    down: async(queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeColumn('Ventes', 'user_id');
    }
};