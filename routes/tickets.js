const express = require("express");
const moment = require("moment");
const router = express.Router();
const db = require("../models");
const { ensureAuthenticated } = require("../helpers/auth");
const { setApiInfos } = require("../helpers/routerOsConnect");
const _ = require("lodash");
const { TimeGetter, calcUptime, getExactTime } = require("../helpers/Times");
const { Op } = require("sequelize");
const { SpliteDate } = require("../helpers/formatDate");
moment.locale("fr");

router.get("/", ensureAuthenticated, async (req, res) => {
	const ticket = await db.Ticket.findAll({
		raw: true,
		order: [["createdAt", "DESC"]],
	});

	for (let i = 0; i < ticket.length; i++) {
		if (ticket[i].disabled) {
			ticket[i].disabled = "Expiré";
		} else {
			ticket[i].disabled = "Fonctionnel";
		}
		if (ticket[i].archive) {
			ticket[i].archive = "Archivé";
		} else {
			ticket[i].archive = "Non archivé";
		}
		ticket[i].expiration =
			ticket[i].expiration !== null
				? SpliteDate(ticket[i].expiration)
				: "Pas encore fixé";
		ticket[i].dateAchat = SpliteDate(ticket[i].dateAchat);
	}

	const times = await db.Times.findAll({ raw: true });

	res.render("dashboard/tickets", {
		ticket: ticket,
		ticketsNumber: ticket.length,
		times,
	});
});

router.post("/deleteExpiredTickets", async (req, res) => {
	console.log("suppr exp tick");
	const { api } = await setApiInfos();
	const client = await api.connect();

	const tickets = await db.Ticket.findAll({
		attributes: ["username", "expiration"],
		where: {
			expiration: {
				[Op.ne]: null,
			},
		},
		raw: true,
	});
	console.log(tickets);
	// Récup les usernames uniquement des objets
	const usernames = _.map(tickets, "username");
	const usernamesNumber = usernames.map(Number);
	console.log(usernamesNumber);

	for (i = 0; i < tickets.length; i++) {
		let expYear = tickets[i].expiration.substring(0, 4);
		if (parseInt(expYear) > 2021) {
			console.log(tickets[i].expiration);
			console.log(`${tickets[i].username} to delete, ${expYear}`);

			(function (i) {
				setTimeout(function () {
					client
						.menu("/ip/hotspot/user/")
						.remove(tickets[i].username)
						.then(() => {
							console.log({
								message: "Deleted successfully",
								ticket: tickets[i].username,
							});
							db.Ticket.destroy({
								where: {
									username: tickets[i].username,
								},
							});
						});
				}, i * 1000);
			})(i);
		}
	}
});

router.post("/deleteTickets", async (req, res) => {
	// Delete all tickets from db
	db.Ticket.destroy({
		where: {},
		truncate: true,
	})
		.then(() => {
			res.render("dashboard/tickets");
			//res.status(200).json({ message: "Tickets destroyed" })
		})
		.catch((err) => console.lol(err));
});

router.post("/setDisabled", async (req, res) => {
	//router.get("/setdisabled", async (req, res) => {
	// get all tickets that have time to 0 => limitUptime == uptime &
	// get all tickets that expiration date arrived
	// and set them all to disable to true
	console.log("Set disabled");
	const { api } = await setApiInfos();
	const client = await api.connect();
	const result = await client.menu("/ip/hotspot/user/").getAll();
	for (const props in result) {
		let upt = result[props].uptime;
		let limitUpt = result[props].limitUptime;
		let user = result[props].name;
		if (upt === limitUpt) {
			// Tickets that appears here have no more time, they can be set to disabled
			console.log({ name: user, uptime: upt, limit: limitUpt });
			if (result[props].disabled !== true) {
				db.Ticket.update(
					{ disabled: true },
					{
						where: {
							username: user,
						},
					},
				);
			}
		}
	}

	setTimeout(() => {
		api.close();
	}, 1000);

	const tickets = await db.Ticket.findAll({
		attributes: ["username", "expiration"],
		raw: true,
	});
	for (const ticket in tickets) {
		// Date actuelle
		const now = moment();
		let exp = tickets[ticket].expiration;
		const expire = moment(exp, "YYYYMMDD");
		const diffDays = now.diff(expire, "days");

		if (diffDays > 2) {
			// tickets that appears here are expired more than 2 days. We can set them to disable
			console.log(tickets[ticket], diffDays);
			if (exp !== null && tickets[ticket].disabled !== true) {
				db.Ticket.update(
					{ disabled: true },
					{
						where: {
							username: tickets[ticket].username,
						},
					},
				);
			}
		}
	}
	res.render("dashboard/tickets");
});

router.post("/setexpirationdate", async (req, res) => {
	// router.get("/setexpirationdate", async (req, res) => {
	// Check tickets that have beeen used, if uptime is =! 0S and =! limituptime, ticket is used
	// get tickets used and calculate the new expiration date and set it to expiration variable
	const { api } = await setApiInfos();
	const client = await api.connect();
	const users = await client.menu("/ip/hotspot/user/").getAll(); //4023001
	//const user = await client.menu("/ip/hotspot/user/").getOne({name: 4023001});
	let usedTickets = [];
	for (const props in users) {
		let upt = users[props].uptime;
		let limitUpt = users[props].limitUptime;
		let user = users[props].name;
		if (upt !== "0s") {
			// Tickets that appears here have been used, the expiration can be set
			usedTickets.push(user);
			console.log("utilisé", { name: user, uptime: upt, limit: limitUpt });
		}
	}

	// Get from db the tickets that are used, took just username and jourValidite
	db.Ticket.findAll({
		where: {
			username: {
				[Op.in]: usedTickets,
			},
		},
		raw: true,
		attributes: ["username", "jourValidite", "expiration"],
	}).then((tickets) => {
		// calculate the new expiration date
		const today = new Date();
		let newDate = new Date();

		for (const props in tickets) {
			let username = tickets[props].username;
			let jourValide = tickets[props].jourValidite;
			let expiration = tickets[props].expiration;
			if (expiration === null) {
				db.Ticket.update(
					{ expiration: newDate.setDate(today.getDate() + jourValide) },
					{
						where: {
							username: username,
						},
					},
				);
			}
		}
		res.render("dashboard/tickets");
		setTimeout(() => {
			api.close();
		}, 1000);
	});
});
router
	.get("/delete/:id", ensureAuthenticated, async (req, res) => {
		const ticket_id = req.params.id;
		await db.Ticket.findOne({ where: { id: ticket_id } }).then(
			async (result) => {
				// console.log(result)
				const { api } = await setApiInfos();

				api.connect().then((client) => {
					client
						.menu("/ip/hotspot/user/")
						.remove(result.username)
						.then(async () => {
							await db.Ticket.destroy({ where: { id: ticket_id } }).then(() => {
								setTimeout(() => {
									api.close();
								}, 1000);
								res.redirect(req.headers.referer);
							});
						});
				});
			},
		);
	})

	.delete("/delete/", ensureAuthenticated, async (req, res) => {
		const tickets_id = req.body["id[]"];
		const { api } = await setApiInfos();
		api.connect().then(async (client) => {
			for (const key in tickets_id) {
				if (Object.hasOwnProperty.call(tickets_id, key)) {
					const id = tickets_id[key];
					await db.Ticket.findOne({ where: { id: id } }).then(
						async (result) => {
							// console.log(result)
							//setTimeout(async() => {
							client
								.menu("/ip/hotspot/user/")
								.remove(result.username)
								.then(async () => {
									await db.Ticket.destroy({ where: { id: id } }).then(() => {});
								});
						},
					);
					//}, 1500)
				}
			}
		});
		setTimeout(() => {
			api.close();
		}, 9000);
		res.send("success");
	});
router.post("/paygate", async (req, res) => {
	const { price } = req.body;
	if (!price) {
		// 50,100,200
		return res.status(401).send("Time is not define");
	}
	moment.locale("fr");
	const now = moment().format("LLLL");

	const timeinfo = await getExactTime(price);

	console.log(timeinfo);

	if (!timeinfo) {
		return res.status(401).send("Time is not found");
	}
	const limitUptime = TimeGetter(timeinfo.time).time;
	const { api } = await setApiInfos();
	api.connect().then((client) => {
		const username = 100 + Math.floor(Math.random() * 9000);
		const password = username;
		client
			.menu("/ip/hotspot/user/")
			.add({
				name: username,
				password: password,
				server: "all",
				profile: "default",
				"limit-uptime": limitUptime,
			})
			.then(async (response) => {
				console.log({
					create: true,
					username: response.name,
					password: response.password,
					internetplan: response.limitUptime,
				});
				getHotspot().then((data) => {
					res.json({
						create: true,
						url: `http://${data[1].dnsName}/login?username=${response.name}&password=${response.password}`,
						username: response.name,
						password: response.password,
						internetplan: response.limitUptime,
					});
				});

				db.Ticket.create({
					username: response.name,
					password: response.password,
					timeleft: timeinfo.time,
					expiration: null,
					archive: false,
					disabled: false,
					price: timeinfo.price,
					forfait: response.limitUptime,
					dateAchat: new Date(),
					jourValidite: timeinfo.validity,
					is_print: true,
				});
				api.close();

				setTimeout(() => {
					// enregrister le log d'achat
					db.Achat_ticket_logs.create({
						code: `${response.name}/${response.password}`,
						description: `Achat ticket de ${response.limitUptime} le  ${now}`,
						price: timeinfo.price,
						forfait: response.limitUptime,
						is_sell: true,
						date: new Date(),
					})
						.then((info) => {
							//  console.log(info);
						})
						.catch((err) => console.log(err));
				}, 1500);
			});
	});
});

async function getHotspot() {
	const data = await setApiInfos();
	const api = data.api;
	const hotspot = await (await api.connect())
		.menu("/ip/hotspot/profile")
		.getAll();
	api.close();
	return hotspot;
}

module.exports = router;
