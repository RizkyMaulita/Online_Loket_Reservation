'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidV4 } = require('uuid');
const { getCurrentDate } = require('../helpers');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.hasMany(models.Transaction, {
        sourceKey: 'customer_id',
        foreignKey: 'customer_id'
      })
    }
  };
  Customer.init({
    customer_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    no_handphone: DataTypes.STRING,
    status: DataTypes.ENUM('0','1','2'),
    create_by: DataTypes.STRING,
    create_date: DataTypes.DATE,
    update_by: DataTypes.STRING,
    update_date: DataTypes.DATE
  }, {
    hooks: {
      beforeCreate (instance) {
        instance.customer_id = uuidV4()
        instance.status = '1'
        instance.create_date = getCurrentDate()
        if (!instance.create_by) {
          instance.create_by = 'admin'
        }
      }
    },
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: 'Customer',
  });
  Customer.removeAttribute('id')
  return Customer;
};