"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Server_data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Server_data.init(
    {
      mikrotik_address: DataTypes.STRING,
      mikrotik_username: DataTypes.STRING,
      mikrotik_password: DataTypes.STRING,
      ticket_header: DataTypes.STRING,
      ticket_footer: DataTypes.STRING,
      printer_address: DataTypes.STRING,
      ngrok_token: DataTypes.STRING,
      ngrok_address: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Server_data"
    }
  );
  return Server_data;
};
