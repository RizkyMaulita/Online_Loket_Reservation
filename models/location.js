'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Location.hasMany(models.Event, {
        sourceKey: 'location_id',
        foreignKey: 'location_id'
      })
    }
  };
  Location.init({
    location_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    address: DataTypes.TEXT,
    city: DataTypes.STRING,
    status: DataTypes.ENUM,
    create_by: DataTypes.STRING,
    create_date: DataTypes.DATE,
    update_by: DataTypes.STRING,
    update_date: DataTypes.DATE
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: 'Location',
  });
  Location.removeAttribute('id')
  return Location;
};