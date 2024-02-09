const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");
const { setApiInfos } = require("../helpers/routerOsConnect");
const { checkRouter } = require("../middleware/checkRouter");

router
	.get("/", ensureAuthenticated, checkRouter, async (req, res) => {
		const { api } = await setApiInfos();
		try {
			const client = await api
				.connect()
				.then()
				.catch((err) => {
					api.close();
					console.log(err);
				});
			// Link to get one user
			// const users = await client.menu("/ip/hotspot/user/").getOne({name: 6856321});
			client
				.menu("/ip/hotspot/active/")
				.getAll()
				.then((activeUsers) => {
					setTimeout(() => {
						api.close();
					}, 1500);
					res.render("dashboard/devices", {
						activeUsers,
						activeUsersCount: activeUsers.length,
					});
				})
				.catch((err) => {
					api.close();
					console.log(err);
				});
		} catch (error) {
			api.close();
			console.log(error);
		}
	})

	.get("/disconnect/:id", async (req, res) => {
		const { api } = await setApiInfos();
		api.connect().then((client) => {
			client
				.menu("/ip/hotspot/active/")
				.remove(req.params.id)
				.then(() => {
					setTimeout(() => {
						api.close();
					}, 1000);
					res.redirect(req.headers.referer);
				});
		});
	});

module.exports = router;
