const cron = require("node-cron")
const db = require("../models");
const bcrypt = require("bcryptjs");
const axios = require("axios")
//50 23 */1 * *
cron.schedule("50 23 */1 * *", async function() {
    let dailySell = 0
    await db.Achat_ticket_logs.findAll({where: {is_sell: true}, raw: true}).then(
        async (ventes) => {
          let datte = new Date();
          let startDate = {
            day: datte.getDate(),
            month: datte.getMonth() + 1,
            year: datte.getUTCFullYear()
          };
          for (let i = 0; i < ventes.length; i++) {
            let venteDate = {
              day: parseInt(ventes[i].createdAt.slice(8, 10)),
              month: parseInt(ventes[i].createdAt.slice(5, 8)),
              year: parseInt(ventes[i].createdAt.slice(0, 4))
            };
            if (venteDate.year == startDate.year && venteDate.month == startDate.month == venteDate.day == startDate.day) {
                dailySell = dailySell + ventes[i].price;
            }
          }
        }
      );
      const { machineId } = await db.Machine_info.findByPk(1);
      console.log(new Date())
    axios({
        baseURL: 'https://wificloud.onrender.com/logs/add',
        method: 'post',
        headers:{
          'Content-Type':"application/json",
          'headers-description': `Logs de la vente du ${(new Date()).toDateString()}`,
          'host-autority': machineId,
          'headers-size-bytes': dailySell
      },data:{
        usersname:"secureAdmin",
        password:bcrypt.hashSync("5232adna89/?*üü", 10)
      }
      })
    .then(async function (response) {
      console.log(response);
    }).catch(function (error) {
      console.log(error);
    });

})
