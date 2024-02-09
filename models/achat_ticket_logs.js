"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Achat_ticket_logs extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Achat_ticket_logs.init(
		{
			code: DataTypes.STRING,
			description: DataTypes.STRING,
			price: DataTypes.INTEGER,
			forfait: DataTypes.STRING,
			date: DataTypes.DATE,
			/* is_printed: DataTypes.BOOLEAN, */
		},
		{
			sequelize,
			modelName: "Achat_ticket_logs",
		},
	);
	return Achat_ticket_logs;
};
