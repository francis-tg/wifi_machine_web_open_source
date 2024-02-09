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
            'Articles',
            'categorie_id', {
                type: Sequelize.DataTypes.INTEGER,
                onDelete: "CASCADE",
                allowNull: false,
                references: {
                    model: "Categories",
                    key: "id",
                    as: "categories_id",
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
        await queryInterface.removeColumn('Articles', 'categorie_id');
    }
};