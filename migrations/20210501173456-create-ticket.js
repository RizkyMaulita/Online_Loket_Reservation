'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tickets', {
      ticket_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      type: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      quota: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Tickets');
  }
};