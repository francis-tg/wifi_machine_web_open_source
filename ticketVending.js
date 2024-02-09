const { setApiInfos } = require("./helpers/routerOsConnect");
const moment = require("moment");
const db = require("./models");
const { formatTicket } = require("./helpers/formatTicket");
const { TimeGetter, calcUptime, getExactTime } = require("./helpers/Times");

const buyOneTicket = async (price) => {
	if (!price) {
		// 1h, 1d, 1w, 4w
		console.log("Time is not define");
	}
	moment.locale("fr");
	const now = moment().format("LLLL");
	const timeinfo = await db.Times.findOne({ where: { price } });
	const limitUptime = TimeGetter(timeinfo.time).time;
	const time = timeinfo.time;
	if (!timeinfo) {
		console.log("Time is not found");
	}
	const { api, ticket_header, ticket_footer, printer_address } =
		await setApiInfos();
	api.connect().then((client) => {
		const username = 1000000 + Math.floor(Math.random() * 9000000);
		const password = 10000 + Math.floor(Math.random() * 90000);
		client
			.menu("/ip/hotspot/user/")
			.add({
				name: username,
				password: password,
				server: "all",
				profile: "default",
				"limit-uptime": limitUptime,
			})
			.then((response) => {
				console.log({
					username: response.name,
					password: response.password,
					internetplan: response.limitUptime,
				});
				db.Ticket.create({
					username: response.name,
					password: response.password,
					timeleft: time,
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
				formatTicket(
					response.name, // code
					response.password, // mot de passe
					response.limitUptime, // temps
					timeinfo.price, // prix
					printer_address, // "tcp://192.168.1.50:9100" 192.168.1.248
					ticket_header, // "AWICO WIFI ZONE"
					ticket_footer, // "Merci d'utiliser nos services "
				);

				setTimeout(() => {
					// enregrister le log d'achat
					db.Achat_ticket_logs.create({
						code: `${response.name}/${response.password}`,
						description: `Achat ticket de ${
							response.limitUptime
						} le  ${new Date()}`,
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
};

(async () => {
	const credit = process.argv[process.argv.length - 1];
	console.log(credit);
	buyOneTicket(credit)
	/* db.Times.findAll({ raw: true }).then((times) => {
		for (let i = 0; i < times?.length; i++) {
			if (i === times?.length - 1 && credit === times[i]?.price) {
				buyOneTicket(times[times?.length - 1]?.price);
			} else if (credit >= times[i]?.price && credit < times[i + 1]?.price) {
				buyOneTicket(times[i].price);
			}
		}
	}); */

	//process.exit();
})();
