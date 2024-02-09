const express = require("express");
const moment = require("moment");
const router = express.Router();
const db = require("../models");
const { ensureAuthenticated } = require("../helpers/auth");

// Edit mikrotif infos Form
router.get("/edit/", ensureAuthenticated, (req, res) => {
  db.Server_data.findByPk(1).then((mikrotik) => {
    const { ticket_header, ticket_footer, mikrotik_address, printer_address } =
      mikrotik;
    res.render("mikrotik/edit", {
      ticket_header,
      ticket_footer,
      mikrotik_address,
      printer_address,
    });
  });
});

// Add mikrotif infos Form
router.get("/add/", ensureAuthenticated, (req, res) => {
  res.render("mikrotik/add");
});

router.post("/add", (req, res) => {
  const {
    mikrotik_address,
    mikrotik_username,
    mikrotik_password,
    ticket_header,
    ticket_footer,
    printer_address,
  } = req.body;
  let errors = [];
  // Validate Fields
  if (!mikrotik_address) {
    errors.push({ text: "Veuillez entrer l'addresse du mikrotik" });
  }
  if (!mikrotik_username) {
    errors.push({ text: "Veuillez entrer le username du mikrotik" });
  }
  if (!mikrotik_password) {
    errors.push({ text: "Veuillez entrer le mot de passe " });
  }
  if (!printer_address) {
    errors.push({ text: "Veuillez entrer l'addresse de l'imprimante" });
  }
  if (!ticket_header) {
    errors.push({ text: "Veuillez entrer l'entête" });
  }
  if (ticket_header.length > 20) {
    errors.push({ text: "L'entête ne dois pas dépasser 20 caractères" });
  }
  if (!ticket_footer) {
    errors.push({ text: "Veuillez entrer le pied du ticket" });
  }
  if (ticket_footer.length > 40) {
    errors.push({ text: "Le pied de page ne dois pas dépasser 40 caractères" });
  }
  // Check for errors
  if (errors.length > 0) {
    res.render("mikrotik/add", {
      errors,
      ticket_header,
      ticket_footer,
      mikrotik_address,
      mikrotik_username,
      mikrotik_password,
      ticket_header,
      ticket_footer,
      printer_address,
    });
  } else {
    db.Server_data.create({
      mikrotik_address,
      mikrotik_username,
      mikrotik_password,
      ticket_header,
      ticket_footer,
      printer_address,
    }).then((mikrotik) => {
      res.redirect("/");
    });
  }
});

router.post("/edit", ensureAuthenticated, (req, res) => {
  const { ticket_header, ticket_footer, mikrotik_address, printer_address } =
    req.body;
  let errors = [];
  // Validate Fields
  if (!ticket_header) {
    errors.push({ text: "Veuillez entrer le texte" });
  }
  if (ticket_header.length > 20) {
    errors.push({ text: "L'entête ne dois pas dépasser 20 caractères" });
  }

  if (!ticket_footer) {
    errors.push({ text: "Veuillez entrer le texte" });
  }
  if (ticket_footer.length > 40) {
    errors.push({ text: "Le pied de page ne dois pas dépasser 40 caractères" });
  }
  // Check for errors
  if (errors.length > 0) {
    res.render("mikrotik/edit", { //mikrotik/edit
      errors,
      ticket_header,
      ticket_footer,
      mikrotik_address,
      printer_address,
    });
  } else {
    db.Server_data.update(
      { ticket_header, ticket_footer, mikrotik_address, printer_address },
      { where: { id: 1 } }
    ).then((mikrotik) => {
      res.redirect("/settings");
    });
  }
});

module.exports = router;
