'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidV4 } = require('uuid');
const { getCurrentDate } = require('../helpers');
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
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Event ID can't be null !`
        },
        notEmpty: {
          msg: `Event ID can't be empty !`
        }
      }
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Customer ID can't be null !`
        },
        notEmpty: {
          msg: `Customer ID can't be empty !`
        }
      }
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Total price can't be null !`
        },
        notEmpty: {
          msg: `Total price can't be empty !`
        }
      }
    },
    total_ticket: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Total ticket can't be null !`
        },
        notEmpty: {
          msg: `Total ticket can't be empty !`
        }
      }
    },
    status: DataTypes.ENUM('0','1','2'),
    create_by: DataTypes.STRING,
    create_date: DataTypes.DATE,
    update_by: DataTypes.STRING,
    update_date: DataTypes.DATE
  }, {
    hooks: {
      beforeCreate (instance) {
        instance.transaction_id = uuidV4()
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
    modelName: 'Transaction',
  });
  Transaction.removeAttribute('id')
  return Transaction;
};