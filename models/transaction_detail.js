'use strict';
const {
  Model, Transaction
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction_Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction_Detail.belongsTo(models.Transaction, {
        targetKey: 'transaction_id',
        foreignKey: 'transaction_id'
      })
      Transaction_Detail.belongsTo(models.Ticket, {
        targetKey: 'ticket_id',
        foreignKey: 'ticket_id'
      })
    }
  };
  Transaction_Detail.init({
    transaction_detail_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    transaction_id: DataTypes.UUID,
    ticket_id: DataTypes.UUID,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    status: DataTypes.ENUM,
    create_by: DataTypes.STRING,
    create_date: DataTypes.DATE,
    update_by: DataTypes.STRING,
    update_date: DataTypes.DATE
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: 'Transaction_Detail',
  });
  Transaction_Detail.removeAttribute('id')
  return Transaction_Detail;
};