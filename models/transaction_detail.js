'use strict';
const {
  Model
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
    }
  };
  Transaction_Detail.init({
    transaction_detail_id: DataTypes.UUID,
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
    modelName: 'Transaction_Detail',
  });
  return Transaction_Detail;
};