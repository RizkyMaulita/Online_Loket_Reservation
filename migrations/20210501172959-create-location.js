'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Locations', {
      location_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      address: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('0','1','2')
      },
      create_by: {
        type: Sequelize.STRING
      },
      create_date: {
        type: Sequelize.DATE
      },
      update_by: {
        type: Sequelize.STRING
      },
      update_date: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Locations');
  }
};