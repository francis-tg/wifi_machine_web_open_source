const router = require('express').Router();
const { setApiInfos } = require("../../helpers/routerOsConnect");

router
    .get('/all', async(req, res) => {
        const { api } = await setApiInfos();

        const client = await api.connect();
        const interface = await client.menu('/interface');
        const bridges = await client.menu('interface/bridge');
    });



module.exports = router