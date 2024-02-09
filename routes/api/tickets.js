/**
 *  ADNA DEV
 *
 * @copyright ADNA 2022
 *
 */

const express = require("express");
const router = express.Router();
const { formatTicket } = require("../../helpers/formatTicket");
const db = require("../../models");
const cron = require("node-cron");
const moment = require("moment");
const { setApiInfos } = require("../../helpers/routerOsConnect");
const { today } = require("../../helpers/formatDate");
const { TimeGetter, calcUptime, getExactTime } = require("../../helpers/Times");
const { Interfaces } = require("../../helpers/interfaces");
/*const api = new RouterOSClient({
      host: "192.168.1.2",
      user: "admin",
      password: "",
      port: "8728",
    });*/

router.get("/allTickets", async (req, res) => {
  const { api } = await setApiInfos();

  api.connect().then((client) => {
    client
      .menu("/ip/hotspot/user/")
      .getAll()
      .then((result) => {
        // console.log(result);
        res.json(result);
        api.close();
      })
      .catch((err) => {
        console.log(err); // Some error trying to get the identity
      });
  });
});

router.get("/activeusers", async (req, res) => {
  const { api } = await setApiInfos();
  const client = await api.connect();
  const result = await client.menu("/ip/hotspot/active/").getAll();
  res.json(result);
  setTimeout(() => {
    api.close();
  }, 2000);
});

router
  .get("/setactive/:id", async (req, res) => {
    const ticket = req.params.id;
    await db.Ticket.findOne({ where: { username: ticket }, raw: true }).then(
      async (result) => {
        if (!result) {
          return res.status(401).send("Not found");
        }
        if (result) {
          const { jourValidite, dateAchat, expiration } = result;
          //console.log(jourValidite);
          if (!expiration) {
            const expireInterval = TimeGetter(`${jourValidite}`).time;
            console.log(expireInterval);
            const { api } = await setApiInfos();
            const client = await api.connect();
            const user = await client
              .menu("/ip/hotspot/user")
              .find({ name: ticket });
            console.log(user);
            client.menu("/ip/hotspot/user").edit(
              {
                comment: "Ticket used. Copyright@ADNA-2022",
              },
              { id: user.id },
            );
            const clock = await client.menu("/system/clock").getAll();
            await client
              .menu("/system/scheduler")
              .add({
                name: ticket,
                interval: expireInterval,
                comment: `Mode expiration du ticket ${ticket}. Copyright@ADNA-2022`,
                onEvent: `/ip hotspot active remove [find user=${ticket}]\r\n/ip hotspot user disable [find name=${ticket}]\r\n/system schedule remove [find name=${ticket}]\r\n/tool fetch url="http://${
                  Interfaces().ether || Interfaces().wlan
                }:4000/api/tickets/setdisable/${ticket}" keep-result=no mode=http;\r\n /ip hotspot user set comment="ticket used and disabled" [find where name=${ticket}];`,
                // onEvent: `/ip hotspot active remove [find user=${ticket}]\r\n/ip hotspot user disable [find name=${ticket}]\r\n/system schedule remove [find name=${ticket}]`,
                startDate: clock[0].date,
                startTime: clock[0].time,
              })
              .then(async () => {
                console.log(parseInt(jourValidite));
                const exp = moment().add(
                  TimeGetter(jourValidite).number,
                  "days",
                );
                await db.Ticket.update(
                  { expiration: exp, is_print: true },
                  { where: { username: ticket } },
                ).then(() => {
                  res.send("expiration set...");
                });
                await db.Achat_ticket_logs.update(
                  {
                    is_sell: true,
                  },
                  { where: { code: `${user.name}/${user.password}` } },
                );
              })
              .catch((err) => {});
            setTimeout(() => {
              api.close();
            }, 2000);
          }
        }
      },
    );
  })

  .post("/buy", async (req, res) => {
    const { price } = req.body;
    if (!price) {
      // 50,100,200
      return res.status(401).send("Time is not define");
    }
    moment.locale("fr");
    const now = moment().format("LLLL");

    const timeinfo = await getExactTime(price);

    console.log(timeinfo);

    if (!timeinfo) {
      return res.status(401).send("Time is not found");
    }
    const limitUptime = TimeGetter(timeinfo.time).time;
    console.log(today());
    const { api, ticket_header, ticket_footer, printer_address } =
      await setApiInfos();
    api.connect().then((client) => {
      const username = 1000000 + Math.floor(Math.random() * 9000000);
      const password = 10000 + Math.floor(Math.random() * 90000);
      client
        .menu("/ip/hotspot/user/")
        .add({
          name: username,
          password: password,
          server: "all",
          profile: "default",
          "limit-uptime": limitUptime,
        })
        .then((response) => {
          res.json({
            username: response.name,
            password: response.password,
            internetplan: response.limitUptime,
          });
          db.Ticket.create({
            username: response.name,
            password: response.password,
            timeleft: timeinfo.time,
            expiration: null,
            archive: false,
            disabled: false,
            price: timeinfo.price,
            forfait: response.limitUptime,
            dateAchat: new Date(),
            jourValidite: timeinfo.validity,
            is_print: true,
          });
          api.close();
          const isPrinted = formatTicket(
            response.name, // code
            response.password, // mot de passe
            response.limitUptime, // temps
            timeinfo.price, // prix
            printer_address, // "tcp://192.168.1.50:9100" 192.168.1.248
            ticket_header, // "AWICO WIFI ZONE"
            ticket_footer, // "Merci d'utiliser nos services "
          );

          setTimeout(() => {
            // enregrister le log d'achat
            db.Achat_ticket_logs.create({
              code: `${response.name}/${response.password}`,
              description: `Achat ticket de ${response.limitUptime} le  ${now}`,
              price: timeinfo.price,
              forfait: response.limitUptime,
              is_printed: isPrinted,
              date: new Date(),
            })
              .then((info) => {
                //  console.log(info);
              })
              .catch((err) => console.log(err));
          }, 1500);
        });
    });
  })

  .post("/generate", async (req, res) => {
    const { time, number } = req.body;
    if (!time && !number) {
      return res.status(401).send("Time is not define");
    }
    moment.locale("fr");
    const now = moment().format("LLLL");
    const limitUptime = TimeGetter(time).time;
    const timeinfo = await db.Times.findOne({ where: { time: time } });
    const { api } = await setApiInfos();
    const client = await api.connect();
    if (number <= 200) {
      for (let i = 0; i < number; i++) {
        const username = 1000000 + Math.floor(Math.random() * 9000000);
        const password = 10000 + Math.floor(Math.random() * 90000);
        client
          .menu("/ip/hotspot/user/")
          .add({
            name: username,
            password: password,
            server: "all",
            profile: "default",
            "limit-uptime": limitUptime,
          })
          .then(async (response) => {
            db.Ticket.create({
              username: response.name,
              password: response.password,
              timeleft: time,
              expiration: null,
              archive: false,
              disabled: false,
              price: timeinfo.price,
              forfait: response.limitUptime,
              dateAchat: now,
              jourValidite: timeinfo.validity,
            });
            setTimeout(() => {
              // enregrister le log d'achat
              db.Achat_ticket_logs.create({
                code: `${response.name}/${response.password}`,
                description: `Achat ticket de ${response.limitUptime} le  ${now}`,
                price: timeinfo.price,
                forfait: response.limitUptime,
                date: now,
              })
                .then((info) => {
                  //  console.log(info);
                })
                .catch((err) => console.log(err));
            }, 1500);
          });
      }
    }
    res.redirect(`/tickets/${time}/download`);
    setTimeout(() => {
      api.close();
    }, 3000);
  })

  .get("/setdisable/:ticket", async (req, res) => {
    const { ticket } = req.params;
    if (!ticket) {
      return console.log("missing params");
    }
    if (ticket) {
      const dbTicket = await db.Ticket.findOne({ where: { username: ticket } });
      if (!dbTicket) {
        return;
      }
      if (dbTicket.disabled === false || !dbTicket.disabled) {
        return await db.Ticket.update(
          { disabled: true },
          { where: { username: ticket } },
        ).then(() => {
          console.log(`${ticket} has been disabled...`);
        });
      } else {
        return;
      }
    }
    res.status(200).send(`${ticket} has been disabled...`);
  });

module.exports = router;
/**
 * this cron check if ticket has not been  already disabled in database, if not doing disabled;
 */
const setDisabled = async () => {
  const { api } = await setApiInfos();
  const client = await api.connect();
  const Ticket = await client.menu("/ip/hotspot/user/").getAll();
  Ticket.map(async (ticket) => {
    if (ticket.disabled === true) {
      const dbTicket = await db.Ticket.findOne({
        where: { username: ticket.name },
      });
      if (!dbTicket) {
        return;
      }
      if (dbTicket && dbTicket.disabled === false) {
        await db.Ticket.update(
          { disabled: true },
          { where: { username: ticket.name } },
        ).then(() => {
          console.log(`${ticket.name} has been disabled...`);
        });
      }
    }
  });
  api.close();
};

/**
 * Check if ticket is disabled and remove it
 */

const doingDelete = async () => {
  console.log("do deletion");
  const { api } = await setApiInfos();
  const client = await api.connect();
  const Ticket = await client.menu("/ip/hotspot/user/").getAll();
  Ticket.map(async (ticket) => {
    if (ticket.disabled === true) {
      const dbTicket = await db.Ticket.findOne({
        where: { username: ticket.name },
      });
      if (!dbTicket) {
        // if(ticket.disabled ===true)
        // {
        console.log(ticket.name);
        // await client.menu("/ip/hotspot/user/").find({name: ticket.name}).then(async(getIt)=>{
        //   if(getIt){

        // }else{
        //   console.log("not found")
        // }
        //});
        //}
      }
      if (dbTicket && dbTicket.disabled === true) {
        await client.menu("/ip/hotspot/user/").remove(ticket.name);
        await db.Ticket.destroy({
          where: { username: ticket.name },
        }).then(() => {
          console.log(`${ticket.name} has been deleted...`);
        });
      }
    }
    await client.menu("/ip/hotspot/user/").remove(ticket.name);
  });

  setTimeout(() => {
    api.close();
  }, 6000);
};
//0 2 * * 7
cron.schedule("0 2 * * 7", () => {
  // DoingUserDelete();
  console.log("running a task every sundays at 02h00 - ok");
});

/* cron.schedule("* * * * *", async () => {
  const {api} = await setApiInfos();
  const client = await api.connect();
  // setDisableIfNot()
  const Tickets = await client.menu("/ip/hotspot/user/").getAll();
  Tickets.map(async (ticket) => {
    db.Ticket.findOne({where: {username: ticket.name}}).then(async (user) => {
      if (ticket.disabled) {
        await db.Ticket.update(
          {disabled: true},
          {where: {username: ticket.name}}
        ).then(async () => {
          if (user && new Date(user.expiration) === new Date()) {
            console.log("Date over");
          }
        });
      }
    });
    if (ticket.limitUptime === ticket.uptime) {
      const {api} = await setApiInfos();
      const client = await api.connect();
      client.menu("/ip/hotspot/user").remove(ticket.name);
      console.log("time is up");

      api.close();
    }
  });
  setTimeout(() => {
    api.close();
  }, 5000);
  console.log("running a task every 5h");
}); */

cron.schedule("* */24 * * *", () => {
  //DoingUserDelete()
  // PurgeUnUseTicket()
});

/*

.post("/edit/:id", async(req, res) => {
    const ticket = req.params.id;
    const { uptime } = req.body;
    let jourValide = 0;
    let sub = parseInt(uptime);

    if (sub === 1) {
        jourValide = 1;
    } else if (sub === 3) {
        jourValide = 3;
    } else if (sub === 5) {
        jourValide = 5;
    } else if (sub === 10) {
        jourValide = 14;
    } else if (sub === 24) {
        jourValide = 1;
    } else if (sub === 168) {
        // 1 semaine
        jourValide = 7;
    } else if (sub === 336) {
        // 2 semaines
        jourValide = 14;
    } else if (sub === 720) {
        // 1 mois
        jourValide = 30;
    } else {
        jourValide = 30;
    }
    await db.Ticket.findOne({ where: { username: ticket }, raw: true }).then(
        async(result) => {
            const { jourValidite, dateAchat, expiration } = result;
            if (result) {
                const expireInterval = TimeGetter(`${jourValide}d`).time;
                const { api } = await setApiInfos();
                const client = await api.connect();
                const user = await client
                    .menu("/ip/hotspot/user")
                    .find({ name: ticket });
                console.log(user);
                const scheduler = await client
                    .menu("/system/scheduler")
                    .find({ name: user.name });
                if (scheduler) {
                    client.menu("/ip/hotspot/user").edit({
                        limitUptime: calcUptime(
                            uptime,
                            user.uptime !== "0s" ? user.uptime : user.limitUptime || "0s"
                        ).limitUptime,
                    }, { id: user.id });
                    const clock = await client.menu("/system/clock").getAll();
                    await client.menu("/system/scheduler").remove(user.name);
                    await client
                        .menu("/system/scheduler")
                        .add({
                            name: ticket,
                            interval: expireInterval,
                            comment: `Mode expiration du ticket ${ticket}. Copyright@ADNA-2022`,
                            onEvent: `/ip hotspot active remove [find user=${ticket}]\r\n/ip hotspot user disable [find name=${ticket}]\r\n/system schedule remove [find name=${ticket}]\r\n/tool fetch url="http://192.168.1.53:4000/api/tickets/setdisable/${ticket}" keep-result=no mode=http;\r\n /ip hotspot user set comment="ticket used and disabled" [find where name=${ticket}];`,
                            startDate: clock[0].date,
                            startTime: clock[0].time,
                        })
                        .then(async() => {
                            const exp = moment(dateAchat)
                                .add(jourValide, "days")
                                .format("LLLL");
                            await db.Ticket.update({ expiration: exp, timeleft: uptime }, { where: { username: ticket } }).then(() => {
                                res.redirect(req.headers.referer);
                            });
                        });
                } else {
                    client
                        .menu("/ip/hotspot/user")
                        .edit({
                            limitUptime: calcUptime(
                                uptime,
                                user.uptime !== "0s" ?
                                user.uptime :
                                user.limitUptime || "0s"
                            ).limitUptime,
                        }, { id: user.id })
                        .then(async() => {
                            const exp = moment(dateAchat)
                                .add(jourValide, "days")
                                .format("LLLL");
                            await db.Ticket.update({ timeleft: uptime }, { where: { username: ticket } }).then(() => {
                                res.redirect(req.headers.referer);
                            });
                        });
                }
                setTimeout(() => {
                    api.close();
                }, 2000);
            }
            // console.log(dateAchat)
        }
    );
})

*/
