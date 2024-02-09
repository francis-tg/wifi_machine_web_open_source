const db = require("./models");

/**
 *
 * @param {string} ip
 */
function extractCidr(ip) {
  const partIp = String(ip).split("/");
  return generateNetmask(partIp[1]);
}
/**
 *
 * @param {int|string} cidr
 * @returns
 */
function generateNetmask(cidr) {
  const bits = parseInt(cidr, 10);
  const mask = (0xffffffff << (32 - bits)) >>> 0;
  return [
    (mask >>> 24) & 0xff,
    (mask >> 16) & 0xff,
    (mask >> 8) & 0xff,
    mask & 0xff,
  ].join(".");
}

function getCIDRFromNetmask(netmask) {
  // Split the netmask into its four octets
  const octets = netmask.split(".");

  // Convert each octet to binary format
  const binaryOctets = octets.map((octet) => parseInt(octet, 10).toString(2));

  // Concatenate the four binary strings and count the number of 1s
  const binaryNetmask = binaryOctets.join("");
  const cidr = binaryNetmask.replace(/0+$/g, "").length;

  return cidr;
}

async function convertToMultipleOf5(number) {
  const forfait = await db.Times.findAll({ raw: true });
  return forfait.filter((time) => {
    if (
      number >= parseInt(time.price) - parseInt(time.price) * 0.19 &&
      number <= parseInt(time.price)
    ) {
      return time.price;
    }
  });
}

(async())