const { hashSync } = require("bcryptjs");
const os = require("os");
const machineId = require("node-machine-id");
const db = require("../models");
const { createMachine } = require("./../config/createMachineOnCloudApp");
const router = require("express").Router();
const deviNetwork = require("network-config");
const fs = require("fs");
const { exec } = require("child_process");

router.get("/", async (req, res) => {
	const users = await db.User.findAll();
	const serverData = await db.Server_data.findAll();
	if (users.length > 0 && serverData.length > 0)
		return res.status(401).redirect("/");
	if (os.platform() === "linux") {
		await deviNetwork.interfaces(async function (err, interfaces) {
			console.log(interfaces[0]);
			return res.render("config/index", { interface: interfaces[0] });
		});
	} else {
		return res.render("config/index");
	}
});
router.post("/add", async (req, res) => {
	const { user, network, mikrotik, ticket, forfait } = req.body;
	const { ip_address, netmask, gateway } = network;
	if (os.platform() === "linux") {
		deviNetwork.configure(
			"eth0",
			{
				ip: ip_address,
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
		});
	}
	const serveData = {
		...ticket,
		mikrotik_address: mikrotik.mik_ip_address,
		ngrok_token: user.tokenNgrok,
		mikrotik_username: mikrotik.mik_username,
		mikrotik_password: mikrotik.mik_password,
	};
	if (Object.values(serveData).filter((t) => t !== "").length > 0) {
		await db.Server_data.create(serveData)
			.then(() => {})
			.catch(() => {});
	}
	const newUser = {
		phonenumber: user.phoneNumber,
		name: user.name,
		username: user.username,
		password: hashSync(user.password, 10),
	};
	await db.User.create(newUser)
		.then(() => {})
		.catch((err) => {});
	// Read the contents of package.json
	fs.readFile("package.json", "utf8", async (err, data) => {
		if (err) {
			console.error("Error reading package.json:", err);
			return;
		}

		try {
			const packageJson = JSON.parse(data);
			const version = packageJson.version;
			console.log("Package version:", version);
			let name = await getHardwareId();
			await db.Machine_info.create({
				machineName: `${user.name}-->${name}`,
				version,
				machineId: await getHardwareId(),
			}).then(async (data) => {});
		} catch (error) {
			console.error("Error parsing package.json:", error);
		}
	});
	forfait.map(async (f) => {
		await db.Times.create(f)
			.then(() => {})
			.catch((err) => {});
	});
	await createMachine(user);
	return res.status(200).send("success");
});
async function getHardwareId() {
	try {
		const hardwareId = await machineId.machineId();

		return "ADNA-MACH-" + hardwareId.substring(0, 5).toUpperCase();
	} catch (error) {
		console.error("Error retrieving hardware ID:", error);
	}
}
module.exports = router;
