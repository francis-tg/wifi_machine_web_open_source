const { ensureAuthenticated } = require("../../helpers/auth");
const db = require("../../models");

const router = require("express").Router();

module.exports = router

	.get("/", ensureAuthenticated, async (_req, res, next) => {
		try {
			const articles = await db.Vending.findAll({ raw: true });
			return res.render("vending", { articles });
		} catch (error) {
			if (process.env.NODE_ENV === "production") {
				//console.log(error)
				return next("Internal error");
			} else {
				console.log(error);
				return next(error);
			}
		}
	})
	.post("/add", ensureAuthenticated, async (req, res) => {
		try {
			const { article, price, button, turntime } = req.body;
			await db.Vending.create({
				article,
				price: parseInt(price),
				button: parseInt(button),
				turntime: parseInt(turntime),
			});
			return res.redirect(req.headers.referer);
		} catch (error) {
			if (process.env.NODE_ENV === "production") {
				//console.log(error)
				return next("Internal error");
			} else {
				console.log(error);
				return next(error);
			}
		}
	});
