'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        targetKey: 'customer_id'
      })
      Transaction.belongsTo(models.Event, {
        foreignKey: 'event_id',
        targetKey: 'event_id'
      })
      Transaction.hasMany(models.Transaction_Detail, {
        sourceKey: 'transaction_id',
        foreignKey: 'transaction_id'
      })
    }
  };
  Transaction.init({
    transaction_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    event_id: DataTypes.UUID,
    customer_id: DataTypes.UUID,
    total_price: DataTypes.INTEGER,
    total_ticket: DataTypes.INTEGER,
    status: DataTypes.ENUM,
    create_by: DataTypes.STRING,
    create_date: DataTypes.DATE,
    update_by: DataTypes.STRING,
    update_date: DataTypes.DATE
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: 'Transaction',
  });
  Transaction.removeAttribute('id')
  return Transaction;
};