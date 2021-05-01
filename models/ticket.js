'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ticket.belongsTo(models.Event, {
        foreignKey: 'event_id',
        targetKey: 'event_id'
      })
      Ticket.hasMany(models.Transaction_Detail, {
        sourceKey: 'ticket_id',
        foreignKey: 'ticket_id'
      })
    }
  };
  Ticket.init({
    ticket_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    event_id: DataTypes.UUID,
    type: DataTypes.STRING,
    price: DataTypes.INTEGER,
    quota: DataTypes.INTEGER,
    status: DataTypes.ENUM,
    create_by: DataTypes.STRING,
    create_date: DataTypes.DATE,
    update_by: DataTypes.STRING,
    update_date: DataTypes.DATE
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: 'Ticket',
  });
  Ticket.removeAttribute('id')
  return Ticket;
};