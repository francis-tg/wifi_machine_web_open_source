'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vending extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vending.init({
    article: DataTypes.STRING,
    price: DataTypes.INTEGER,
    button: DataTypes.INTEGER,
    turntime: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Vending',
  });
  return Vending;
};