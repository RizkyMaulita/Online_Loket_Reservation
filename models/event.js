'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidV4 } = require('uuid');
const { getCurrentDate } = require('../helpers');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Location, {
        targetKey: 'location_id',
        foreignKey: 'location_id'
      })
      Event.hasMany(models.Ticket, {
        sourceKey: 'event_id',
        foreignKey: 'event_id'
      })
      Event.hasMany(models.Transaction, {
        sourceKey: 'event_id',
        foreignKey: 'event_id'
      })
    }
  };
  Event.init({
    event_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    location_id: DataTypes.UUID,
    status: DataTypes.ENUM('0','1','2'),
    create_by: DataTypes.STRING,
    create_date: DataTypes.DATE,
    update_by: DataTypes.STRING,
    update_date: DataTypes.DATE
  }, {
    hooks: {
      beforeCreate (instance) {
        instance.event_id = uuidV4()
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
    modelName: 'Event',
  });
  Event.removeAttribute('id')
  return Event;
};