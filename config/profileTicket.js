const {setApiInfos} = require("../helpers/routerOsConnect");
const {Interfaces} = require("../helpers/interfaces");
const regex =
  /^:local\s+\w+;\:log\s+warning\s+"doing\s+\$[\w-]+";\/tool\s+fetch\s+url="http:\/\/[\d\.]+:\d+\/api\/tickets\/setactive\/\$[\w-]+"\s+keep-result=no\s+mode=http;$/;
/**
 *
 * @returns
 */
async function getUserProfile() {
  const data = await setApiInfos();
  const api = data.api;
  const userProfile = await (await api.connect())
    .menu("/ip/hotspot/user/profile")
    .getAll();
  api.close();
  return userProfile;
}
/**
 *
 * @param {object} profileData
 */
async function setScriptToProfile(profileData) {
  const address = Interfaces().ether || Interfaces().wlan;
  const data = await setApiInfos();
  const api = data.api;
  const {id} = profileData;
  const userProfile = await (await api.connect())
    .menu("/ip/hotspot/user/profile")
    .edit(
      {
        comment: "Modifier par ADNA",
        sharedUsers: 1,
        rateLimit: "2M/6M",
        onLogin: `:local userr;:log warning "doing $user";/tool fetch url="http://${address}:4000/api/tickets/setactive/$user" keep-result=no mode=http;`
      },
      {id}
    );
  api.close();
  return userProfile;
}
/**
 *
 * @returns
 */
async function getDeleteCron() {
  const data = await setApiInfos();
  const api = data.api;
  const deleteCron = await (await api.connect())
    .menu("/sys/scheduler")
    .getAll();
  api.close();
  return deleteCron.filter((d) => d.name === "Delete Cron");
}
/**
 *
 */
async function addDeleteCron() {
  const data = await setApiInfos();
  const api = data.api;
  const clock = await getClock();
  await (await api.connect()).menu("/sys/scheduler").add({
    name: "Delete Cron",
    interval: "14d",
    onEvent: `/ip hotspot user remove [find disabled]`,
    comment: "Delete scheduler",
    startDate: clock[0].date,
    startTime: clock[0].time
  });
  api.close();
}
/**
 *
 * @returns
 */
async function getClock() {
  const data = await setApiInfos();
  const api = data.api;
  const clock = await (await api.connect()).menu("/system/clock").getAll();
  api.close();
  return clock;
}
/**
 *
 */
async function ConfigMikrotik() {
  try {
    const userProfile = await getUserProfile();
    const defaultProfile = userProfile.filter((i) => i.name === "default")[0];
    if (defaultProfile.onLogin === "") {
      setScriptToProfile(defaultProfile);
    }
    const DeleteCron = await getDeleteCron();
    if (DeleteCron.length === 0) {
      addDeleteCron();
    }
    const disableCron = await getDisabledCron();
    if (disableCron.length === 0) {
      setdisabledUnusedOrUsedTicket();
    }
    setSysUser();
  } catch (error) {}
}
/**
 *
 */
async function setdisabledUnusedOrUsedTicket() {
  const data = await setApiInfos();
  const api = data.api;
  const clock = await getClock();
  await (await api.connect()).menu("/sys/scheduler").add({
    name: "Disabled Cron",
    interval: "7d",
    onEvent: `\n
        /ip hotspot user print
        # Check if limit-uptime is equal to uptime
        :foreach i in=[/ip hotspot user find] do={ 
        :local limit [/ip hotspot user get $i limit-uptime];
        :local uptime [/ip hotspot user get $i uptime]; 
        \n
        # If limit-uptime is not equal to uptime, log it.
        :if ($limit = $uptime) do={ 
            /ip hotspot user disable $i
            :log warning "User $i disabled"
        }  
        }\n
        /ip hotspot user disable [/ip hotspot user find uptime=0 name!="default-trial"]`,
    comment: "Disable scheduler",
    startDate: clock[0].date,
    startTime: clock[0].time
  });
  api.close();
}
/**
 *
 * @returns
 */

async function getDisabledCron() {
  const data = await setApiInfos();
  const api = data.api;
  const disableCron = await (await api.connect())
    .menu("/sys/scheduler")
    .getAll();
  api.close();
  disableCron.filter((d) => d.name === "Disabled Cron");
  return disableCron.filter((d) => d.name === "Disabled Cron");
}

async function getSysUser() {
  const data = await setApiInfos();
  const api = data.api;
  const sysUser = await (await api.connect()).menu("/user").getAll();
  api.close();
  return sysUser.filter((s) => s.name === "machine");
}
/**
 *
 * @returns
 */
async function setSysUser() {
  try {
    const sysUser = await getSysUser();
    if (sysUser.length === 0) {
      const data = await setApiInfos();
      const api = data.api;
      await (
        await api.connect()
      ).add({
        name: "machine",
        group: "full",
        comment: "ADNA machine user",
        password: "12345"
      });
      return;
    }
  } catch (error) {}
}

module.exports = {
  ConfigMikrotik
};
