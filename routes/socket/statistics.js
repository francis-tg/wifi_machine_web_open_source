const { FormatDate } = require("../../helpers/formatDate");
const db = require("../../models")
module.exports = Statistics = async() => {
    const ventes = await db.Achat_ticket_logs.findAll({ where: { is_sell: true }, raw: true });
    const statistic = {
        Janvier: 0,
        Fevrier: 0,
        Mars: 0,
        Avril: 0,
        Mai: 0,
        Juin: 0,
        Juillet: 0,
        Aout: 0,
        Septembre: 0,
        Octobre: 0,
        Novembre: 0,
        Decembre: 0
    }
    if (ventes !== null) {
        for (const key in ventes) {
            if (Object.hasOwnProperty.call(ventes, key)) {
                const vente = ventes[key];
                if (FormatDate(vente.createdAt).month === "Janvier") {
                    statistic.Janvier += vente.price;
                }
                if (FormatDate(vente.createdAt).month === "Fevrier") {
                    statistic.Fevrier += vente.price;
                }
                if (FormatDate(vente.createdAt).month === "Mars") {
                    statistic.Mars += vente.price;
                }
                if (FormatDate(vente.createdAt).month === "Avril") {
                    statistic.Avril += vente.price;
                }
                if (FormatDate(vente.createdAt).month === "Mai") {
                    statistic.Mai += vente.price;
                }
                if (FormatDate(vente.createdAt).month === "Juin") {
                    statistic.Juin += vente.price;
                }
                if (FormatDate(vente.createdAt).month === "Juillet") {
                    statistic.Juillet += vente.price;
                }
                if (FormatDate(vente.createdAt).month === "Août") {
                    statistic.Aout += vente.price;
                }
                if (FormatDate(vente.createdAt).month === "Setptembre") {
                    statistic.Septembre += vente.price;
                }
                if (FormatDate(vente.createdAt).month === "Octobre") {
                    statistic.Octobre += vente.price;
                }
                if (FormatDate(vente.createdAt).month === "Novembre") {
                    statistic.Novembre += vente.price;
                }
                if (FormatDate(vente.createdAt).month === "Decembre") {
                    statistic.Decembre += vente.price;
                }

            }
        }

        return statistic
    }
    return statistic
}

module.exports = Kiosk_Statistics = async() => {
    const ventes = await db.Vente.findAll({raw: true });
    const statistic = {
        Janvier: 0,
        Fevrier: 0,
        Mars: 0,
        Avril: 0,
        Mai: 0,
        Juin: 0,
        Juillet: 0,
        Aout: 0,
        Septembre: 0,
        Octobre: 0,
        Novembre: 0,
        Decembre: 0
    }
    if (ventes !== null) {
        for (const key in ventes) {
            if (Object.hasOwnProperty.call(ventes, key)) {
                const vente = ventes[key];
                if (FormatDate(vente.createdAt).month === "Janvier") {
                    const vValue = vente.pu * vente.quantity
                    statistic.Janvier += vValue;
                }
                if (FormatDate(vente.createdAt).month === "Fevrier") {
                    const vValue = vente.pu * vente.quantity
                    statistic.Fevrier += vValue;
                }
                if (FormatDate(vente.createdAt).month === "Mars") {
                    const vValue = vente.pu * vente.quantity
                    statistic.Mars += vValue;
                }
                if (FormatDate(vente.createdAt).month === "Avril") {
                    const vValue = vente.pu * vente.quantity
                    statistic.Avril += vValue;
                }
                if (FormatDate(vente.createdAt).month === "Mai") {
                    const vValue = vente.pu * vente.quantity
                    statistic.Mai += vValue;
                }
                if (FormatDate(vente.createdAt).month === "Juin") {
                    const vValue = vente.pu * vente.quantity
                    statistic.Juin += vValue;
                }
                if (FormatDate(vente.createdAt).month === "Juillet") {
                    const vValue = vente.pu * vente.quantity
                    statistic.Juillet += vValue;
                }
                if (FormatDate(vente.createdAt).month === "Août") {
                    const vValue = vente.pu * vente.quantity
                    statistic.Aout += vValue;
                }
                if (FormatDate(vente.createdAt).month === "Setptembre") {
                    const vValue = vente.pu * vente.quantity
                    statistic.Septembre += vValue;
                }
                if (FormatDate(vente.createdAt).month === "Octobre") {
                    const vValue = vente.pu * vente.quantity
                    statistic.Octobre += vValue;
                }
                if (FormatDate(vente.createdAt).month === "Novembre") {
                    const vValue = vente.pu * vente.quantity
                    statistic.Novembre += vValue;
                }
                if (FormatDate(vente.createdAt).month === "Decembre") {
                    const vValue = vente.pu * vente.quantity
                    statistic.Decembre += vValue;
                }

            }
        }

        return statistic
    }
    return statistic
}