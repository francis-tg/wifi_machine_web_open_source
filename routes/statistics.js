const express = require("express");
const router = express.Router();
const db = require("../models");
const Sequelize = require("sequelize");
const moment = require("moment");
const { ensureAuthenticated } = require("../helpers/auth");
const { Op } = require("sequelize");
const {
	getTotalAndLogs,
	filterByDateRangeAndCalculateTotal,
} = require("../routes_methods/statistics");

router.get("/", ensureAuthenticated, async (req, res) => {
	const { type, startDate, endDate } = req.query;
	let totalMachine = null;
	let machinesLogs = null;
	let totalLog = null;
	let ticketLogs = null;
	if (type === "logs") {
		const whereClause =
			startDate && endDate
				? {
						date: {
							[Op.between]: [
								moment(startDate).format("LLLL"),
								moment(endDate).format("LLLL"),
							],
						},
				  }
				: {};

		const { total, logs } = await getTotalAndLogs(db.Log, whereClause);

		totalMachine = total;
		machinesLogs = logs;
	} else if (type === "achat") {
		const whereClause =
			startDate && endDate
				? {
						date: {
							[Op.between]: [
								moment(startDate).format("LLLL"),
								moment(endDate).format("LLLL"),
							],
						},
				  }
				: {};
		const { total, logs } = await getTotalAndLogs(
			db.Achat_ticket_logs,
			whereClause,
		);
		totalLog = total;
		ticketLogs = logs;
	} else {
		const { total, logs } = await getTotalAndLogs(db.Achat_ticket_logs);
		totalLog = total;
		ticketLogs = logs;
	}
	res.render("dashboard/statistics", {
		ticketLogs,
		machinesLogs,
		totalLog,
		totalMachine,
	});
});

router.post("/search", ensureAuthenticated, async (req, res) => {
	const { startDate, endDate } = req.body;
	const ticketResult = filterByDateRangeAndCalculateTotal(
		await db.Achat_ticket_logs.findAll({
			raw: true,
			order: [["createdAt", "DESC"]],
		}),
	);
	const machineResult = filterByDateRangeAndCalculateTotal(
		await db.Log.findAll({ raw: true, order: [["createdAt", "DESC"]] }),
		startDate,
		endDate,
	);
	const ticketLogs = ticketResult.filteredItems;
	const totalLog = ticketResult.total;
	const machinesLogs = machineResult.filteredItems;
	const totalMachine = machineResult.total;
	res.render("dashboard/statistics", {
		ticketLogs,
		machinesLogs,
		totalLog,
		totalMachine,
	});
});

module.exports = router;
