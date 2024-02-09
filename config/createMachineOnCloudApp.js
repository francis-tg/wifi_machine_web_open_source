const db = require("../models");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const { setPublicUrl } = require("../helpers/TunnelNgrok");

async function createMachine(data) {
	try {
		const times = await db.Times.findAll({ raw: true });
		const serverData = await db.Server_data.findOne({
			where: { id: 1 },
			raw: true,
		});

		let urlNgrok =
			serverData.ngrok_address == "" ||
			serverData.ngrok_address == undefined ||
			serverData.ngrok_address == 0
				? await setPublicUrl()
				: serverData.ngrok_address;

		const { machineId, machineName } = await db.Machine_info.findByPk(1);
		const machine = {
			name: machineName,
			keyID: machineId,
			url: urlNgrok,
			status: true,
		};

		console.log(data);
		axios({
			baseURL: "https://wificloud.onrender.com/machines/createMachine/",
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				machine: machine,
				times: times,
				user: data,
			},
		})
			.then(async function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
	} catch (error) {}
}

(async function () {
	await createMachine("pierre");
})();

module.exports = {
	createMachine,
};
