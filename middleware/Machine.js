const os = require("os");
const fs = require("fs");
  
const Machine = (req, res, next) => {
  if (os.platform() === "linux") {
    const machineGpio = require("../machine");
    gpioSupport() && machineGpio;
   return next();
  }
  return next();
};

function typeOfMachine(callback) {
  // Read the os-release file
  const osRelease = fs.readFileSync("/etc/os-release", "utf8");

  // Extract the ID value from the os-release file
  const osId = osRelease
    .split("\n")
    .find((line) => line.startsWith("ID="))
    .split("=")[1]
    .toLowerCase();

  // Check if the ID value is 'raspbian'
  if (osId === "raspbian") {
    gpioSupport() && callback();
  } else {
    return osId;
  }
}
function gpioSupport() {
  return fs.existsSync("/sys/class/gpio");
}

module.exports = {
  Machine
};
