'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('categories-subcategories', [
      {
        categoryID: 1,
        subcategoryID: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryID: 1,
        subcategoryID: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryID: 2,
        subcategoryID: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryID: 2,
        subcategoryID: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryID: 5,
        subcategoryID: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryID: 5,
        subcategoryID: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  ], {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('categories-subcategories', null, {});
  }
};
