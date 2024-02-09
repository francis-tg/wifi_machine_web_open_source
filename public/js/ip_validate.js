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
/**
 *
 * @param {string} netmask
 * @returns
 */
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
function getRouteFromCIDR(cidr) {
  const [networkAddress, subnetBits] = cidr.split("/");
  const subnetBytes = Math.ceil(subnetBits / 8);
  const subnetMask = new Array(4).fill(0);

  for (let i = 0; i < subnetBytes; i++) {
    subnetMask[i] = 255;
  }

  const subnetBitsRemaining = subnetBits % 8;
  if (subnetBitsRemaining > 0) {
    subnetMask[subnetBytes] = 256 - Math.pow(2, 8 - subnetBitsRemaining);
  }

  const networkAddressParts = networkAddress.split(".");
  let routeParts = networkAddressParts.map(
    (part, index) => part & subnetMask[index],
  );
  const getlast = routeParts.pop();
  routeParts = [...routeParts, getlast + 1];

  return routeParts.join(".");
}

const Ip_address = document.querySelectorAll("[ip_address]");
const Netmasks = document.querySelectorAll("[netmask]");
const gateaway = document.querySelectorAll("[gateway]");
const regex = /^(?:\d{1,3}\.){3}\d{1,3}\/([1-9]|[1-2][0-9]|3[0-2])$/;

Ip_address.forEach((ip_address, i) => {
  ip_address.addEventListener("keyup", () => {
    if (ip_address.value !== "" && regex.test(ip_address.value)) {
      Netmasks[i].value = extractCidr(ip_address.value);
      gateaway[i].ariaPlaceholder = getRouteFromCIDR(ip_address.value);
      gateaway[i].value = getRouteFromCIDR(ip_address.value);
    }
  });
});

/* window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#gateway").setAttribute("readonly", true);
  //ip_address.value = `${ip_address.value}/${getCIDRFromNetmask(netmask.value)}`;
});
 */
