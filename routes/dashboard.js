const express = require("express");
const router = express.Router();
const db = require("../models");
const { ensureAuthenticated } = require("../helpers/auth");
const { setApiInfos } = require("../helpers/routerOsConnect");
const { checkRouter } = require("../middleware/checkRouter");
const { getTicketCount, getSalesLogs } = require("../routes_methods/dashboard");

router.get("/", ensureAuthenticated, checkRouter, async (req, res) => {
	const allTicketsNumber = await getTicketCount({});
	const ticketsDisabledNumber = await getTicketCount({ disabled: true });
	const ticketsActiveNumber = await getTicketCount({ disabled: false });
	const total = await getSalesLogs();
	res.render("index", {
		allTicketsNumber,
		ticketsDisabledNumber,
		ticketsActiveNumber,
		total: total,
	});
});

router.get("/delete", ensureAuthenticated, async (req, res) => {
	const { api } = await setApiInfos();
	const client = await api.connect();
	const tickets = await db.Ticket.findAll({ raw: true });
	const result = await client.menu("/ip/hotspot/user/").getAll();
	for (const ticket of tickets) {
		const matchingResult = result.find(
			(entry) =>
				parseInt(ticket.username) === parseInt(entry.name) &&
				ticket.disabled === 1,
		);
		if (matchingResult) {
			await client.menu("/ip/hotspot/user/").remove(matchingResult.id);
			await db.Ticket.update({ archive: true }, { where: { id: ticket.id } });
		}
	}
	res.redirect(req.headers.referer);
});

router.get("/set-router", ensureAuthenticated, (req, res) => {
	return res.render("setRouter");
});
router.post("/set-router", async (req, res) => {
	const { ip_address, username, password } = req.body;
	if ((ip_address, username, password)) {
		db.Server_data.update(
			{
				mikrotik_address: ip_address,
				mikrotik_username: username,
				mikrotik_password: password,
			},
			{ where: { id: "1" } },
		);
		return res.redirect("/");
	}
});

module.exports = router;
