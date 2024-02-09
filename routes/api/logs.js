const express = require("express");
const moment = require("moment");
const router = express.Router();
const Sequelize = require("sequelize");
const db = require("../../models");
//require("moment/locale/fr"); // without this line it didn't work
const { today } = require("../../helpers/formatDate");

router.get("/sendmoneyentered", (req, res) => {
  //const today = moment(Date.now()).format("DD/MM/YYYY");
  // get data from machine
  let moneyenteredInfos = req.query.money;
  moment.locale("fr");
  const now = moment().format("LLLL");
  let dataToSave = `Argent entré : ${moneyenteredInfos}F le ${now}`;
  db.Log.create({
    information: dataToSave,
    price: parseInt(moneyenteredInfos),
    date: today(),
  }).then((info) => {
    res.status(200).json({ message: "Saved" });
    //console.log(info);
  });
});

// get selling stats
router.get("/senddatasachat", (req, res) => {
  const price = req.query.price;
  moment.locale("fr");
  const now = moment().format("LLLL");
  //const today = moment(Date.now()).format("DD/MM/YYYY");

  const forfait = req.query.forfait;
  let dataToSave = { prix: price, forfait: forfait, date: now };
  db.Achat_ticket_logs.create({
    description: `Achat ticket de ${forfait} le  ${now}`,
    price: price,
    forfait: forfait,
    date: today(),
  })
    .then((info) => {
      res.status(200).json({ message: "Saved" });
      //console.log(info);
    })
    .catch((err) => console.log(err));
});

module.exports = router;