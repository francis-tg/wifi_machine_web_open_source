const { print } = require("./printTicket");
const fs = require("fs");
const formatTicket = (code, mdp, temps, prix, p_address, wifiname, footer) => {
	const { today } = require("../helpers/formatDate");
	let resp;
	//let code = "1HREDFERZ";
	//let prix = "200";
	//let temps = "1 Heure";
	//let exp = 3;

	const fs = require("fs"),
		{ createCanvas, loadImage } = require("canvas");

	const WIDTH = 600;
	const HEIGHT = 250;

	const canvas = createCanvas(WIDTH, HEIGHT);
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	// ***********   Header ***************
	const titre = wifiname;
	ctx.font = "bold 40px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "black";
	ctx.fillText(`${titre} - (${today()})`, 300, 30);

	ctx.fillStyle = "black";
	ctx.font = "bold 15px Arial";

	ctx.fillText(
		"...............................................................................................................................................",
		300,
		45,
	);

	// *********   End header ****************

	// Left text
	ctx.textAlign = "left";
	ctx.font = "22px Arial";
	ctx.fillText("Nom d'utilisateur :", 100, 85);
	ctx.font = "22px Arial";
	ctx.fillText("Mot de passe :", 100, 125);
	ctx.font = "22px Arial";
	ctx.fillText("Temps acheté : ", 100, 165);
	ctx.font = "22px Arial";
	ctx.fillText("Prix : ", 100, 205);
	/*ctx.font = "22px Arial";
  ctx.fillText("Expiration : ", 100, 245);*/
	// Right text

	ctx.textAlign = "left";
	ctx.font = "bold 30px Arial";
	ctx.fillText(code, 310, 85);
	ctx.font = "bold 30px Arial";
	ctx.fillText(`${mdp}`, 310, 125);
	ctx.font = "bold 25px Arial";
	ctx.fillText(temps, 300, 165);
	ctx.font = "bold 22px Arial";
	ctx.fillText(`${prix}Fcfa`, 300, 205);
	/*ctx.font = "bold 15px Arial";
  ctx.fillText(`${exp} jours après 1ere utilisation`, 300, 245);*/
	// footer
	ctx.textAlign = "center";
	ctx.fillStyle = "black";
	ctx.font = "bold 15px Arial";
	ctx.fillText(
		"...............................................................................................................................................",
		300,
		220,
	);

	ctx.font = "20px Arial";
	ctx.fillText(footer, 300, 245);
	//ctx.fillText("Merci d'utiliser nos services", 300, 245);

	// Save ticket and print it
	const i = Math.random() * (500 - 3) + 2;
	const buffer = canvas.toBuffer("image/png");

	!fs.existsSync("public/docs/") && fs.mkdirSync("public/docs/");

	fs.writeFile(`public/docs/ticket${i}.png`, buffer, () => {
		//console.log("Print here");
		resp = print(`public/docs/ticket${i}.png`, p_address);
	});
	return resp;
	//
};

module.exports = { formatTicket };

/* loadImage("./assets/logo.png").then((image) => {
  ctx.drawImage(image, 50, 10, 100, 25);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("test.png", buffer);
}); */
