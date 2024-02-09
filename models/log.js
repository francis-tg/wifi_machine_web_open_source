"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Log extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Log.init(
		{
			information: DataTypes.STRING,
			price: DataTypes.INTEGER,
			date: DataTypes.DATE,
			/* isPrinted: DataTypes.BOOLEAN, */
		},
		{
			sequelize,
			modelName: "Log",
		},
	);
	return Log;
};
