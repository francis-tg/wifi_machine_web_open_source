"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Machine_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Machine_info.init(
    {
      machineName: DataTypes.STRING,
      screenMessage: DataTypes.STRING,
      promoMessage: DataTypes.STRING,
      machineId: DataTypes.STRING,
      version: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Machine_info",
    }
  );
  return Machine_info;
};
