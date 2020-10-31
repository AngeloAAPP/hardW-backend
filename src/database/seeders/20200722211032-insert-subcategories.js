'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('subcategories', [
      {
        name: 'Intel',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595452712/subcategories/intel_unvydo.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'AMD',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595452712/subcategories/amd_kon0b9.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Nvidia',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595453046/subcategories/nvidia_aokkob.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  ], {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('subcategories', null, {});
  }
};
