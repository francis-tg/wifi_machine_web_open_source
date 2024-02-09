const {setApiInfos} = require("./routerOsConnect");

async function getAllFromRouter(path, where = {}) {
  const data = await setApiInfos();
  const api = data.api;
  let response = [];
  if (Object.keys(where).length > 0) {
    const key = Object.keys(where)[0];
    const value = Object.values(where)[0];
    response = await (await api.connect()).menu(path).find({[key]: value});
    api.close();
    return response;
  }
  return response;
}
