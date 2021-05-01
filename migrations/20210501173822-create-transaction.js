'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      transaction_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      event_id: {
        type: Sequelize.UUID
      },
      customer_id: {
        type: Sequelize.UUID
      },
      total_price: {
        type: Sequelize.INTEGER
      },
      total_ticket: {
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
    await queryInterface.dropTable('Transactions');
  }
};