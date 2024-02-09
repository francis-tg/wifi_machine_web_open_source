const {setApiInfos} = require("../helpers/routerOsConnect");

async function checkRouter(req, res, next) {
  const connect = await check();
  console.log(connect);
  if (!connect) {
    return res.redirect("/set-router");
  }
  return next();
}

async function check() {
  const data = await setApiInfos();
  const api = data.api;
  let rt = false;
  await api
    .connect()
    .then(() => {
      api.close();
      rt = true;
    })
    .catch((error) => {
      api.close();
      rt = false;
    });
  return rt;
}

module.exports = {
  checkRouter
};
