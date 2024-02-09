const { setApiInfos } = require("../helpers/routerOsConnect");
const db = require("../models");
async function getTicket() {
  const data = await setApiInfos();
  const api = data.api;
  const users = await (await api.connect()).menu("/ip/hotspot/user").getAll();
  api.close();
  return users;
}

async function updateDb() {
  /* const users = await getTicket();
  users.forEach(async (user) => {
    if (user.name !== "default_trial" && user.limitUptime) {
      const dbuser = await db.Ticket.findOne({where: {username: user.name}});
      const getTime = await db.Times.findOne({
        where: {time: user.limitUptime}
      });
      if (!dbuser) {
        await db.Ticket.create({
          username: user.name,
          password: user.password,
          timeleft: user.limitUptime,
          expiration: null,
          archive: false,
          disabled: user.disabled,
          price: getTime ? getTime.price : null,
          forfait: user.limitUptime,
          dateAchat: new Date(),
          jourValidite: getTime ? getTime.validity : null
        });
      }
    }
  }); */
}

async function setUpdate() {
  await updateDb();
}

module.exports = {
  setUpdate,
};
