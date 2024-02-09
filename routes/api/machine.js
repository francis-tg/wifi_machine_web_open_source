const express = require("express");
const moment = require("moment");
const router = express.Router();
const db = require("../../models");

// get mikrotik first data
router.get("/commondata", (req, res) => {
  db.Machine_info.findByPk(1)
    .then((datas) => {
      res.status(200).json(datas);
    })
    .catch((err) => console.log(err));
});
 


// Add machine data to the Db
router.post("/", (req, res) => {
  const { machineName, screenMessage, promoMessage, machineID, version } =
    req.body;

  db.Machine_info.create({
    machineName,
    screenMessage,
    promoMessage,
    machineID,
    version,
  })
    .then((data) => {
      res.status(200).json(data);
     // console.log(data);
    })
    .catch((err) => console.log(err));
});

// update machine datas
router.patch("/:id", (req, res) => {
  const changes = req.body;
  db.Machine_info.update(changes, { where: { id: req.params.id } }).then(
    (updated) => {
      res.status(200).json(updated);
    }
  );
});

module.exports = router;
