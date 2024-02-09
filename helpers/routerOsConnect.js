const db = require("../models");
const RouterOSClient = require("routeros-client").RouterOSClient;
/**
 *
 * @returns
 */
const setApiInfos = async () => {
  /*const mikrotik_address = "192.168.1.2"
  const mikrotik_username = "machine"
  const mikrotik_password = "12345"
  const ticket_header = "Awico services"
  const ticket_footer = "Merci d'utiliser nos services"
  const printer_address = "192.168.10.5"*/
  const data = await db.Server_data.findByPk(1);
  let result = {
    api: "",
    ticket_header: "",
    ticket_footer: "",
    printer_address: ""
  };

  if (data !== null) {
    const {
      mikrotik_address,
      mikrotik_username,
      mikrotik_password,
      ticket_header,
      ticket_footer,
      printer_address
    } = data;

    //console.log(data);
    const api = new RouterOSClient({
      host: mikrotik_address,
      user: mikrotik_username,
      password: mikrotik_password,
      port: "8728"
    });
    return {...result, api, ticket_header, ticket_footer, printer_address};
  }
};

module.exports = {setApiInfos};
