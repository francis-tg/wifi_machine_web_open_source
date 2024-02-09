const os = require("os");

// class Interfaces{
//     constructor(){
//         this.interfaces = os.networkInterfaces();
//         this.getinterface = Object.values(this.interfaces);
//         this.getinterfaceKey = Object.keys(this.interfaces);
//         this.IpReg = /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/
//         // this.IpReg = /[0-9]{2,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/
//         // console.log(this.IpReg.exec("Mon Ip est 192.168.1.50"))
//         console.log(this.getinterfaceKey)
//         this.getinterface.map((Mapinterface)=>{
//             Mapinterface.map((address)=>{
//                 if(this.IpReg.test(address.address)===true){
//                     if(address.address!=='127.0.0.1'){
//                         console.log(address.address)
//                     }
//                 }
//             })
//         })

//     }

// }

/**
 *
 * @returns {object}
 */

function Interfaces() {
  const interfaces = os.networkInterfaces();
  const plateform = os.platform();
  const getinterface = Object.values(interfaces);
  const getinterfaceKey = Object.keys(interfaces);
  const IpReg = /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/;
  const ether = /eth+/;
  const wifi = /Wi-Fi+/;
  const wlan = /wlan+/;
  const Ethernet = /Ethernet+/;
  const result = {
    wlan: "",
    ether: ""
  };
  if (plateform === "win32") {
    getinterfaceKey.map((key) => {
      if (wifi.test(key)) {
        interfaces[key].map((address) => {
          if (IpReg.test(address.address) === true) {
            if (address.address !== "127.0.0.1") {
              return (result.wlan = address.address);
            }
          }
        });
      }
      if (Ethernet.test(key)) {
        interfaces[key].map((address) => {
          if (IpReg.test(address.address) === true) {
            if (address.address !== "127.0.0.1") {
              return (result.ether = address.address);
            }
          }
        });
      }
    });
  }
  if (plateform === "linux") {
    // console.log(getinterface)
    getinterfaceKey.map((key) => {
      if (wlan.test(key)) {
        interfaces[key].map((address) => {
          if (IpReg.test(address.address) === true) {
            if (address.address !== "127.0.0.1") {
              return (result.wlan = address.address);
            }
          }
        });
      }
      if (ether.test(key)) {
        interfaces[key].map((address) => {
          if (IpReg.test(address.address) === true) {
            if (address.address !== "127.0.0.1") {
              return (result.ether = address.address);
            }
          }
        });
      }
    });
  }
  return result;
}
module.exports = {Interfaces};
