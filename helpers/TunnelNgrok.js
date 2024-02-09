const ngrok = require("ngrok");
const db = require("../models");
require("dotenv").config({ path: "../.env" });
/**
 *
 * @param {string} token
 * @returns
 */
const setToken = (token) => {
	return ngrok.authtoken(token);
};

/**
 *
 * @returns
 */
const getNgrokUrl = async () => {
	const serverData = await db.Server_data.findOne({ where: { id: 1 } ,raw :true});
	const token = serverData.ngrok_token == "" || serverData.ngrok_token == undefined ? process.env.NGROK_AUTH_TOKEN : serverData.ngrok_token 
	console.log(token)
	setToken(token);
	const url = await ngrok.connect(process.env.PORT || 4000);
	return url;
	//return null;
};

const setPublicUrl = async () => {
	const url = await getNgrokUrl();
	console.log(url);
	if (url !== null) {
		await db.Server_data.update({ ngrok_address: url }, { where: { id: 1 } });
		return url;
	}
};
module.exports = { setPublicUrl, getNgrokUrl };
