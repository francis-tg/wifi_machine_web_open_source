const express = require("express");
const moment = require("moment");
const router = express.Router();
const db = require("../models");
const sequelize = require("sequelize");
const { ensureAuthenticated } = require("../helpers/auth");
const { default: axios } = require("axios");

router.get("/", ensureAuthenticated, async (req, res) => {
  res.render("payment/index");
});

router.post("/pay", async (req, res) => {
  const { machineId } = await db.Machine_info.findByPk(1);
  const IDT = 1000000 + Math.floor(Math.random() * 9000000);
  const baseURL = "https://paygateglobal.com/api/v1/pay";
  const AUTH_TOKEN = "de8c76f7-8951-4518-8dd8-1e96825dad06";
  let amount = "2";
  let description = "Achat de connexion";
  let identifier = `AW${IDT}-${machineId}-01H`;
  console.log(identifier);
  let network = "TMONEY";
  axios
    .post(baseURL, {
      headers: {
        "Content-Type": "application/json",
      },
      auth_token: AUTH_TOKEN,
      phone_number: req.body.numero,
      amount,
      description,
      identifier,
      network,
    })
    .then((response) => {
      console.log(response.data);
    });
  console.log(req.body.numero);
});

router.post("/returnPay", (req, res) => {
  const forfait = req.body.forfait;
  //if (forfait === "01H") {
  // Vendre 1 heure
  axios
    .get(
      "http://192.168.10.3:4000/api/tickets/buyOneTicket?price=100&time=01:00:00"
    )
    .then((response) => {
      console.log(response.data);
    });
  // }
  console.log(req.body);
  console.log("callback paygate");
});
/* 
{
  tx_reference: 445268,
  payment_reference: '2703343303',
  amount: 2,
  datetime: '2021-09-08 15:04:46 UTC',
  identifier: '2590967',
  payment_method: 'T-Money',
  phone_number: '22892081701'
}
*/
module.exports = router;
