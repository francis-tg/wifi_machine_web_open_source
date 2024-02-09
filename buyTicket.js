const { setApiInfos } = require("./helpers/routerOsConnect");
const moment = require("moment");
const db = require("./models");
const { formatTicket } = require("./helpers/formatTicket");
const { TimeGetter } = require("./helpers/Times");

/**
 *
 * 1 - recupérer le temps par rapport au prix
 * 2 - créer le tricket
 * 3 - imprimer
 */
/**
 *
 * @param {number} price
 */
async function getTimeByPrice(price) {
	const getTimes = await db.Times.findOne({ where: { price } });
	if (!getTimes) return null;
	return getTimes;
}
/**
 *
 * @param {*} time
 * @param {number} price
 * @param {string} validite
 * @returns
 */
async function createTicket(time, price, validite) {
	const data = await setApiInfos();
	const api = data.api;
	const limitUptime = TimeGetter(time).time;
	const username = 1000000 + Math.floor(Math.random() * 9000000);
	const password = 10000 + Math.floor(Math.random() * 90000);
	const user = await (await api.connect()).menu("/ip/hotspot/user").add({
		name: username,
		password: password,
		server: "all",
		profile: "default",
		"limit-uptime": limitUptime,
	});
	api.close();
	await db.Ticket.create({
		username: user.name,
		password: user.password,
		timeleft: time,
		expiration: null,
		archive: false,
		disabled: false,
		price: price,
		forfait: user.limitUptime,
		dateAchat: new Date(),
		jourValidite: validite,
		is_print: true,
	});
	user.price = price;
	return user;
}

/**
 *
 * @param {object} user
 */

async function printTicket(user) {
	const { ticket_header, ticket_footer, printer_address } = await setApiInfos();

	formatTicket(
		user.name, // code
		user.password, // mot de passe
		user.limitUptime, // temps
		user.price, // prix
		printer_address, // "tcp://192.168.1.50:9100" 192.168.1.248
		ticket_header, // "AWICO WIFI ZONE"
		ticket_footer, // "Merci d'utiliser nos services "
	);
	await db.Achat_ticket_logs.create({
		code: `${user.name}/${user.password}`,
		description: `Achat ticket de ${user.limitUptime} le  ${new Date()}`,
		price: user.price,
		forfait: user.limitUptime,
		is_sell: true,
		date: new Date(),
	})
		.then((info) => {
			//  console.log(info);
		})
		.catch((err) => console.log(err));
}

async function buyTicket(price) {
	const timeInfo = await getTimeByPrice(price);
	await createTicket(timeInfo.time, timeInfo.price, timeInfo.validity).then(
		async (user) => {
			await printTicket(user);
			return user;
		},
	);
}
(async () => {
	const credit = process.argv[process.argv.length - 1];
	console.log(credit);
	const times = await db.Times.findAll({ raw: true });
	/* .then((times) => {
		for (let i = 0; i < times.length; i++) {
			if (i === times.length - 1 && credit === times[i].price) {
				buyOneTicket(times[times.length - 1].price);
			} else if (credit >= times[i].price && credit < times[i + 1].price) {
				buyOneTicket(times[i].price);
			}
		}
	}); */
	const getTime = times.filter(
		(timeInfo) => credit >= timeInfo.price && credit < timeInfo.price,
    );
    

	//process.exit();
})();

module.exports = {
	buyTicket,
};
