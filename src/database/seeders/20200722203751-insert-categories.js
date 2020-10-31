'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('categories', [
      {
        name: 'Placa mãe',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595449853/categories/placa-mae_yk7h3p.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Processador',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595449853/categories/processor_en4ppf.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Memória ram',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595449855/categories/ram_dgjyig.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Drives (HD, SSD, DVD)',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595449853/categories/drives_yjoux4.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Placa de vídeo',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595449855/categories/vga_b2oml4.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fonte de alimentação',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595449853/categories/powersupply_azuiaz.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Gabinete',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595449853/categories/gabinete_lhzpun.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Refrigeração',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595449853/categories/cooler_jxvunz.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Periféricos',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595451356/categories/perifericos_r7ff2o.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Outros',
        imageUrl: 'https://res.cloudinary.com/hardw/image/upload/v1595451847/categories/outros_lbonzy.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  ], {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('categories', null, {});
  }
};
