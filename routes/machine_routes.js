const express = require("express");
const moment = require("moment");
const router = express.Router();
const db = require("../models");
const { ensureAuthenticated } = require("../helpers/auth");

// Edit Machine Form
router.get("/edit/", ensureAuthenticated, (req, res) => {
  db.Machine_info.findByPk(1).then((machine) => {
    res.render("machine/edit", {
      machine: machine,
    });
  });
});

// Add Machine Form
router.get("/add/", ensureAuthenticated, (req, res) => {
  res.render("machine/add");
});

router.post("/edit", ensureAuthenticated, (req, res) => {
  const changes = req.body;
  db.Machine_info.update(changes, { where: { id: 1 } }).then((machine) => {
    res.redirect("/");
  });
});

router.post("/add", (req, res) => {
  const { machineName, screenMessage, promoMessage, machineId, version } =
    req.body;
  db.Machine_info.create({
    machineName,
    screenMessage,
    promoMessage,
    machineId,
    version,
  }).then((machine) => {
    res.redirect("/");
  });
});

module.exports = router;
