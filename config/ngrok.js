const db = require("../models");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const { setPublicUrl } = require("../helpers/TunnelNgrok");
let urlNgrok = "";

async function ngrok() {
	//if (process.env.NODE_ENV === "production")
	{
		db.Machine_info.findByPk(1).then(async (data) => {
			if (data && data.machineId != undefined) {
				const serverData = await db.Server_data.findOne({
					where: { id: 1 },
					raw: true,
				});
				let url =
					serverData.ngrok_address == "" ||
					serverData.ngrok_address == undefined
						? await setPublicUrl()
						: serverData.ngrok_address;
				if (url !== null) {
					axios({
						baseURL: "https://wificloud.onrender.com/machines/updateURL/",
						method: "post",
						headers: {
							"Content-Type": "application/json",
							"host-autority": data.machineId,
							"Content-Fly": url,
						},
						data: {
							usersname: "secureAdmin",
							password: bcrypt.hashSync("5232adna89/?*üü", 10),
						},
					})
						.then(async function (response) {
							//console.log(response);
						})
						.catch(function (error) {
							//console.log(error);
						});
				}
			}
		});
	}
}

(async function () {
	const serverData = await db.Server_data.findOne({
		where: { id: 1 },
		raw: true,
	});
	if (serverData !== undefined) {
		await ngrok();
	}
})();
