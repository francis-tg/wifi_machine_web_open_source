const db = require("../models");

function onCoinPulse() {
    try {
        const credit = process.argv[process.argv.length - 1]??0;
        db.Log.create({
            information: `${new Date().getUTCDate()} un montant de ${credit} est reçu par la machine`,
            price: credit,
            date:new Date()
        })
    } catch (error) {
        console.log("une error s'est produite: ", error)
    }
}

onCoinPulse()