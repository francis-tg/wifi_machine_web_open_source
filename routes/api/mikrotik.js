const express = require("express");
const RouterOSClient = require("routeros-client").RouterOSClient;
const router = express.Router();
const db = require("../../models");

setApiInfos = async() => {
    const data = await db.Server_data.findByPk(1);
    const {
        mikrotik_address,
        mikrotik_username,
        mikrotik_password,
        ticket_header,
        ticket_footer,
        printer_address,
    } = data;
    const api = new RouterOSClient({
        host: mikrotik_address,
        user: mikrotik_username,
        password: mikrotik_password,
        port: "8728",
    });
    return { api, ticket_header, ticket_footer, printer_address };
};

// get mikrotik first data
router.get("/:id", (req, res) => {
    db.Server_data.findByPk(1)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => console.log(err));
});

// Add Mikrotik data to the Db
router.post("/", (req, res) => {
    const {
        mikrotik_address,
        mikrotik_username,
        mikrotik_password,
        ticket_header,
        ticket_footer,
        printer_address,
    } = req.body;

    db.Server_data.create({
            mikrotik_address,
            mikrotik_username,
            mikrotik_password,
            ticket_header,
            ticket_footer,
            printer_address,
        })
        .then((data) => {
            res.status(200).json(data);
            //  console.log(data);
        })
        .catch((err) => console.log(err));
});

// update mikrotik datas
router.patch("/:id", (req, res) => {
    const changes = req.body;
    db.Server_data.update(changes, { where: { id: req.params.id } }).then(
        (updated) => {
            res.status(200).json(updated);
        }
    );
});


module.exports = router;