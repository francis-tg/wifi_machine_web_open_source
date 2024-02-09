const router = require("express").Router();
const { ensureAuthenticated } = require("../helpers/auth");
const db = require("../models");
const { SplitTime } = require("../helpers/Times");
const os = require("os");
const network = require("network-config");
const { exec } = require("child_process");
const process = require("process");
const fs = require("fs");
const si = require("systeminformation");
router
	.get("/", ensureAuthenticated, async (req, res) => {
		let storageUsage;
		const startUsage = process.cpuUsage();
		const endUsage = process.cpuUsage(startUsage);
		const cpuTemp = `${Math.round((await si.cpuTemperature()).main) || 0} °C`;
		const systemCpuTime = `${endUsage.system / 1000} millisecondes`;
		storageUsage =
			Math.round((await si.fsSize()).at(0).used / 1024 / 1024 / 1024) +
			" Gb / " +
			Math.round((await si.fsSize()).at(0).size / 1024 / 1024 / 1024) +
			" Gb";
		await network.interfaces(async function (err, interfaces) {
			const { api } = await setApiInfos();
			// console.log(req.session)
			api
				.connect()
				.then(async (client) => {
					if (client) {
						try {
							client
								.menu("/system/routerboard")
								.getAll()
								.then(async (system) => {
									setTimeout(() => {
										api.close();
									}, 1000);
									// console.log(system)
									const machine_data = await db.Machine_info.findByPk(1, {
										raw: true,
									});
									const mikrotik_data = await db.Server_data.findByPk(1, {
										raw: true,
									});
									const times = await db.Times.findAll({ raw: true });
									res.render("dashboard/settings", {
										machine_data,
										mikrotik_data,
										health: system[0],
										times,
										ethernetData: interfaces && interfaces[0],
										systemCpuTime: cpuTemp,
										storageUsage,
									});
								})
								.catch(async (err) => {
									setTimeout(() => {
										api.close();
									}, 1000);
									const machine_data = await db.Machine_info.findByPk(1, {
										raw: true,
									});
									const mikrotik_data = await db.Server_data.findByPk(1, {
										raw: true,
									});
									const times = await db.Times.findAll({ raw: true });
									console.log(interfaces);
									res.render("dashboard/settings", {
										machine_data,
										mikrotik_data,
										times,
										ethernetData: interfaces[0],
										systemCpuTime: cpuTemp,
										storageUsage,
									});
								});
						} catch (error) {}
					}
				})
				.catch(async (err) => {
					api.close();
					console.log(err);
					const machine_data = await db.Machine_info.findByPk(1, { raw: true });
					const mikrotik_data = await db.Server_data.findByPk(1, { raw: true });
					const times = await db.Times.findAll({ raw: true });

					res.render("dashboard/settings", {
						machine_data,
						mikrotik_data,
						times,
						ethernetData: interfaces[0],
						systemCpuTime: cpuTemp,
						storageUsage,
					});
				});
		});
	})

	.post("/edit/mikinfo", ensureAuthenticated, async (req, res) => {
		const { username, password, address } = req.body;

		/***
		 *  ====> faudra développer un validateur d'IP
		 */

		if (username && password && address) {
			await db.Server_data.update(
				{
					mikrotik_address: address,
					mikrotik_username: username,
					mikrotik_password: password,
				},
				{ where: { id: 1 } },
			).then(() => {
				res.redirect(req.headers.referer);
			});
		}
	})

	.post("/edit/ticket/info", ensureAuthenticated, async (req, res) => {
		const { header, footer } = req.body;

		if (header && footer) {
			await db.Server_data.update(
				{
					ticket_header: header,
					ticket_footer: footer,
				},
				{ where: { id: 1 } },
			).then(() => {
				res.redirect(req.headers.referer);
			});
		}
	})

	.post("/edit/print", ensureAuthenticated, async (req, res) => {
		const { print } = req.body;

		/* if (print) {
      await db.Server_data.update(
        {
          printer_address: print
        },
        {where: {id: 1}}
      ).then(() => {
        return res.redirect(req.headers.referer);
      });
    } */
		return res.redirect(req.headers.referer);
	})

	.post("/edit/time/:id", async (req, res) => {
		const { id } = req.params;
		const { time, validity, price } = req.body;
		if (id && time && validity && price) {
			await db.Times.update(
				{
					time,
					validity,
					price,
				},
				{ where: { id } },
			).then(() => {
				return res.redirect(req.headers.referer);
			});
		}
		return res.redirect(req.headers.referer);
	})

	.post("/time/add", async (req, res) => {
		const { time, validity, price } = req.body;
		if (time && validity && price) {
			const getTime = await db.Times.findOne({ where: { time }, raw: true });
			getTime ??
				(await db.Times.create({
					time,
					validity,
					price,
				}).then(() => {
					return res.redirect(req.headers.referer);
				}));
		}
		return res.redirect(req.headers.referer);
	})

	.get("/time/delete/:id", async (req, res) => {
		const { id } = req.params;
		if (!id) {
			return res.status(401).send("Id not found");
		}

		if (id) {
			await db.Times.destroy({ where: { id } }).then(() => {
				res.redirect(req.headers.referer);
			});
		}
	})
	.post("/ether/edit", (req, res, next) => {
		const { ip, netmask, gateway } = req.body;
		if (os.platform() === "linux") {
			network.configure(
				"eth0",
				{
					ip: ip,
					netmask: netmask,
					gateway: gateway,
					restart: true, //
				},
				function (err) {
					console.log(err);
				},
			);
			exec("sudo systemctl restart networking", (err) => {
				console.log(err);
				/* return res.redirect(
          `http://${ip.split("/")[0]}:${process.env.PORT || 4000}`
          
        ); */
				return res.redirect(req.headers.referer);
			});
		} else next();
	});
router.post("/reboot", (req, res) => {
	exec("sudo reboot", (err) => {
		console.log(err);
		if (!err) return res.status(200).send("success");
	});
});
router.post("/reset", (req, res) => {
	exec(
		"sequelize db:migrate:undo:all && sequelize db:migrate",
		(err, stdout) => {
			console.log(err);
			console.log(stdout);
			if (!err) return res.status(200).send("success");
		},
	);
	if (os.platform() === "linux") {
		network.configure(
			"eth0",
			{
				dhcp: true,
				restart: true, // don't restart networking service
			},
			function (err) {},
		);
	}
});
module.exports = router;
