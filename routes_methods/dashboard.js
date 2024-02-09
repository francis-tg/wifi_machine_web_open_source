const db = require("../models");

const getTicketCount = async (whereClause) => {
	return await db.Ticket.count({ where: whereClause, raw: true });
};

const calculateTotalSales = (ventes) => {
	let total = {
		dailySell: 0,
		monthSell: 0,
		yearSell: 0,
	};
	const currentDate = new Date();
	const startDate = {
		day: currentDate.getDate(),
		month: currentDate.getMonth() + 1,
		year: currentDate.getUTCFullYear(),
	};

	for (const vente of ventes) {
		const venteDate = {
			day: parseInt(vente.createdAt.slice(8, 10)),
			month: parseInt(vente.createdAt.slice(5, 7)), // Corrected slicing for month
			year: parseInt(vente.createdAt.slice(0, 4)),
		};

		total.yearSell += venteDate.year === startDate.year ? vente.price : 0;
		total.monthSell +=
			venteDate.year === startDate.year && venteDate.month === startDate.month
				? vente.price
				: 0;
		total.dailySell +=
			venteDate.year === startDate.year &&
			venteDate.month === startDate.month &&
			venteDate.day === startDate.day
				? vente.price
				: 0;
	}
	return total;
};

const getSalesLogs = async () => {
	const ventes = await db.Achat_ticket_logs.findAll({ raw: true });
	return calculateTotalSales(ventes);
};

module.exports = {
	getSalesLogs,
	getTicketCount,
	calculateTotalSales,
};
