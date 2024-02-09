const moment = require("moment");
const { Sequelize } = require("../models");
const db = require("../models");

const getTotalAndLogs = async (model, whereClause = {}) => {
	try {
		const logTicket = await db.Achat_ticket_logs.findAll({
		raw: true,
		attributes: [[Sequelize.fn("sum", Sequelize.col("price")), "total"]],
		where: whereClause,
	});
	return {
		total: logTicket[0].total,
		logs: await model.findAll({
			raw: true,
			order: [["createdAt", "DESC"]],
			where: whereClause,
		}),
	};
	} catch (error) {
		
	}
};

const isWithinDateRange = (itemDate, startDate, endDate) => {
	const itemMoment = moment(itemDate.slice(0, 10), "YYYY-MM-DD");
	const startMoment = moment(startDate, "YYYY-MM-DD");
	const endMoment = moment(endDate, "YYYY-MM-DD");

	return (
		itemMoment.isSameOrAfter(startMoment) &&
		itemMoment.isSameOrBefore(endMoment)
	);
};

const filterByDateRangeAndCalculateTotal = (items, startDate, endDate) => {
	return items.reduce(
		(result, item) => {
			if (isWithinDateRange(item.date, startDate, endDate)) {
				result.filteredItems.push(item);
				result.total += item.price;
			}
			return result;
		},
		{ filteredItems: [], total: 0 },
	);
};

module.exports = {
	getTotalAndLogs,
	filterByDateRangeAndCalculateTotal,
	isWithinDateRange,
};
