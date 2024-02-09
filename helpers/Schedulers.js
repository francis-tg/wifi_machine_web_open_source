const { isArray, isInteger } = require("lodash");
const db = require("../models");
const { setApiInfos } = require("./routerOsConnect");
/**
 * Doing disable if ticket is disabled in mikrotik
 */
async function DoingUserDelete(){
    const { api } = await setApiInfos();
     const client = await api.connect();
     await db.Ticket.findAll().then((tickets)=>{
      if(isArray(tickets)){
        tickets.map(async(ticket)=>{
          const getUser = await client.menu("/ip/hotspot/user/").find({name:ticket.username})
          if(!getUser){
            console.log("User not exist")
          }
        })
      }
      setTimeout(() => {
        api.close()
      }, 9000);
    }).catch((err)=>{})
  }
  /**
   *  Function to disable ticket if failed in normal process
   */
async function setDisableIfNot() {
    const { api } = await setApiInfos();
     const client = await api.connect();
    const allTicket = client.menu("/ip/hotspot/user/").getAll(); // get all tickets
    if(isArray(allTicket)){ // check if is iterable
        allTicket.map(async(ticket)=>{ // map it
            if(ticket.disabled){ // extract only disabled
                try { // try
                    const user_in_db = await db.Ticket.findOne({where:{username:ticket.name}}); // find it in database
                    if(!user_in_db){ // check if is exist in database
                        console.log("User not exist in database ..."); // if not exist
                    }
                    if(user_in_db){ // if is exists
                        //if(ticket.disabled){
                            if(!user_in_db.disabled){ // if in database isn't disabled
                                await db.Ticket.update({disabled:true},{where:{username:ticket.name}}) // set disabled if not disabled
                            }
                    // }
                    }
                } catch (error) {
                    // catch error if is exists
                }
            }
        })

        setTimeout(() => {
            api.close()
          }, 9000);
    }
}

async function PurgeUnUseTicket(){
    try {
        const { api } = await setApiInfos();
    const client = await api.connect();
    const allTicket = await client.menu("/ip/hotspot/user/").getAll(); // get all tickets
    if(isArray(allTicket)){ // check if is iterable
        allTicket.map(async(ticket)=>{ // map it
           if(isInteger(ticket.name) && !ticket.disabled){
            if(String(ticket.comment).length <5 || !ticket.comment ||ticket.comment ==="unused"){ // count char, check if is under 5 or exist comment not exists
                //console.log(ticket.name)
                //await client.menu("/ip/hotspot/user").edit({comment:"unused",disable:true},{id:ticket.id});
                const is_sch = await client.menu("/sys/scheduler").find({name:ticket.name});
                if(!is_sch){
                    const clock = await client.menu("/system/clock").getAll();
                await client
                .menu("/system/scheduler")
                .add({
                name: ticket.name,
                interval:'00:02:00',
                comment: `Mode suppression ${ticket.name}. Copyright@ADNA-2022`,
                onEvent: `/ip hotspot user disable [find name=${ticket.name}]\r\n/system schedule remove [find name=${ticket.name}]`,
                // onEvent: `/ip hotspot active remove [find user=${ticket}]\r\n/ip hotspot user disable [find name=${ticket}]\r\n/system schedule remove [find name=${ticket}]`,
                startDate: clock[0].date,
                startTime: clock[0].time,
                })
                }
            }
           }
            //console.log(ticket.name)
        })
    }
   // console.log(allTicket)
    setTimeout(() => {
        api.close()
      }, 9000);
    } catch (error) {
        
    }
}

module.exports = {
    setDisableIfNot,
    DoingUserDelete,
    PurgeUnUseTicket
}