const Gpio = require("pigpio").Gpio;
const db = require("./models");
const { buyOneTicket } = require("./ticketVending");
let credit = 0;
console.log("machine started");
machine = () => {
	//lcd.beginSync();

	const coin = new Gpio(4, {
		mode: Gpio.INPUT,
		pullUpDown: Gpio.PUD_UP,
		// edge: Gpio.EITHER_EDGE,
		// edge: Gpio.FALLING_EDGE,
		// edge: Gpio.RISING_EDGE,
		alert: true,
	});

	const TIME_BUTTON = new Gpio(5, {
		mode: Gpio.INPUT,
		pullUpDown: Gpio.PUD_UP,
		alert: true,
	});

	coin.glitchFilter(10000);
	TIME_BUTTON.glitchFilter(10000);

	TIME_BUTTON.on("alert", (level) => {
		if (level === 0) {
			db.Times.findAll({ raw: true }).then((times) => {
				for (let i = 0; i < times.length; i++) {
					if (i === times.length - 1 && credit === times[i].price) {
						sellTicket(times[times.length - 1].time);
					} else if (credit >= times[i].price && credit < times[i + 1].price) {
						sellTicket(times[i].time);
					}
				}
			});
		}
	});

	coin.on("alert", (level, tick) => {
		if (level === 0) {
			credit += 10;
			console.log("crd: ", credit);
		}
	});
};

const sellTicket = (time) => {
	buyOneTicket(time);
	credit = 0;
};

module.exports = { machine };
