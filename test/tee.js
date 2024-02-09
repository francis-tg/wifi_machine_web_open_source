const express = require("express");
const moment = require("moment");
const {setApiInfos} = require("./helpers/routerOsConnect");
const _ = require("lodash");
moment.locale("fr");


async function getHotspot() {
    const data = await setApiInfos();
    const api = data.api;
    const hotspot = await (await api.connect()).menu("/ip/hotspot/profile").getAll();
    api.close();
    return hotspot;
  }

  getHotspot().then(data=>{
    console.log(data[1])
  })