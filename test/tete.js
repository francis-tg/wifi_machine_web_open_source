/* const axios = require("axios")
axios({
    baseURL: 'http://localhost:5600/user/login',
    method: 'post',
    data:{
        username : "admin-admin",
        password: "12345"
    }
  })
.then(async function (response) {
     axios.post("http://localhost:5600/test",{}).then((data)=> {
        console.log(data)
    }) *
  console.log(response);
})
.catch(function (error) {
  console.log(error);
}); */

const db = require("../models");

/* const machineId = require("node-machine-id");

async function getHardwareId() {
  try {
    const hardwareId = await machineId.machineId();
    console.log(
      "Hardware ID: ADNA-MACH-",
      hardwareId.substring(0, 5).toUpperCase(),
    );
  } catch (error) {
    console.error("Error retrieving hardware ID:", error);
  }
}

getHardwareId();

const fs = require("fs");

// Read the contents of package.json
fs.readFile("package.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading package.json:", err);
    return;
  }

  try {
    const packageJson = JSON.parse(data);
    const version = packageJson.version;
    console.log("Package version:", version);
  } catch (error) {
    console.error("Error parsing package.json:", error);
  }
});
 */

/* const data = require("./tete.json")

console.log(data) */

/* const bcrypt = require("bcryptjs");
const { setPublicUrl } = require("./helpers/TunnelNgrok");
let urlNgrok = "";

setPublicUrl().then(async(url) => {})*/

/* const { exec } = require("child_process");

const fs = require("fs");

const diskPath = "/"; // Specify the disk path you want to check

fs.stat(diskPath, (err, stats) => {
	if (err) {
		console.error(err);
		return;
	}

	const totalSpace = stats.size;
	const freeSpace = stats.available;
	const usedSpace = totalSpace - freeSpace;

	console.log(
		`Storage Usage: ${Math.round(usedSpace / 1024 / 1024)} MB / ${Math.round(
			totalSpace / 1024 / 1024,
		)} MB`,
	);
});
const used = process.memoryUsage();
console.log(process.cpuUsage());
console.log(`Memory Usage: ${Math.round(used.rss / 1024 / 1024)} MB`); */

/* const startUsage = process.cpuUsage();

// Perform some CPU-intensive task
// For example, calculate the sum of a large array
const array = [];
for (let i = 0; i < 1e7; i++) {
	array.push(i);
}
const sum = array.reduce((a, b) => a + b, 0);

const endUsage = process.cpuUsage(startUsage);

console.log("CPU Usage:");
console.log(`User CPU Time: ${endUsage.user / 1000} milliseconds`);
console.log(`System CPU Time: ${endUsage.system / 1000} milliseconds`); */

/* const si = require("systeminformation");

(async () => {
	console.log(await si.fsSize());
	//console.log(await si.networkConnections());
	si.cpuTemperature()
		.then((data) => {
			console.log(`CPU Temperature: ${data.main}°C`);
		})
		.catch((error) => {
			console.error(error);
		});
})();
 */

/* function arrondirMontant(montant) {
	const arrondissement = Math.pow(10, Math.floor(Math.log10(montant))); // Trouver la puissance de dix la plus proche
	const arrondi = Math.round(montant / arrondissement); // arrondir à l'entier le plus proche
	const montantArrondi = arrondi * arrondissement;
	return montantArrondi;
}

(async () => {
	const credit = 310;
	const times = await db.Times.findAll({ raw: true });
	const onlyPrice = times.map((time) => time.price);
	const getTime = await onlyPrice.filter((price, i) => {
		return (
			(credit >= parseInt(price) && credit < onlyPrice[i + 1]) ||
			credit === parseInt(price) ||
			arrondirMontant(credit)
		);
	});
	console.log(getTime);
	const timeInfo = times.filter((time) => time.price === getTime[0]);
})();
 */

const { exec } = require("child_process");

const tnl = exec("node expose.js");
let url = [];
tnl.stdout.on("data", (data) => {
	url = data;
});

tnl.stdout.on("resume", (data) => {
	console.log(url);
});
