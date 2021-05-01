'use strict';
const {
  Model, Transaction
} = require('sequelize');
const { v4: uuidV4 } = require('uuid');
const { getCurrentDate } = require('../helpers');
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
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Transaction ID can't be null !`
        },
        notEmpty: {
          msg: `Transaction ID can't be empty !`
        }
      }
    },
    ticket_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Ticket ID can't be null !`
        },
        notEmpty: {
          msg: `Ticket ID can't be empty !`
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Quantity in Transaction Detail can't be null !`
        },
        notEmpty: {
          msg: `Quantity in Transaction Detail can't be empty !`
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Price in Transaction Detail can't be null !`
        },
        notEmpty: {
          msg: `Price in Transaction Detail can't be empty !`
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
        instance.transaction_detail_id = uuidV4()
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
    modelName: 'Transaction_Detail',
  });
  Transaction_Detail.removeAttribute('id')
  return Transaction_Detail;
};