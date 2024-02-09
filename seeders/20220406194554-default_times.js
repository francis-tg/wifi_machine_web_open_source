'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert('Times', [{
                time: '1h',
                price: 100,
                validity: '1d',
                createdAt: new Date(),
                updatedAt: new Date()

            },
            {
                time: '3h',
                price: 200,
                validity: '3d',
                createdAt: new Date(),
                updatedAt: new Date()

            },
            {
                time: '5h',
                price: 300,
                validity: '5d',
                createdAt: new Date(),
                updatedAt: new Date()

            },
            {
                time: '10h',
                price: 500,
                validity: '1w',
                createdAt: new Date(),
                updatedAt: new Date()

            },
            {
                time: '1w',
                price: 1000,
                validity: '1w',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: async(queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("Times", null, {});
    }
};