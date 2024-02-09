function getGatewayFromCIDR(ipAddress, cidr) {
  const ipParts = ipAddress.split(".");
  const subnetParts = [];
  let subnetMask;

  // Calculate the subnet mask based on the CIDR notation
  for (let i = 0; i < 4; i++) {
    if (cidr >= 8) {
      subnetParts.push(255);
      cidr -= 8;
    } else {
      let octet = 0;
      for (let j = 7; j > 7 - cidr; j--) {
        octet += 2 ** j;
      }
      subnetParts.push(octet);
      cidr = 0;
    }
  }

  subnetMask = subnetParts.join(".");

  // Perform bitwise AND operation between IP address and subnet mask
  const ipPartsDecimal = ipParts.map((part) => parseInt(part));
  const subnetPartsDecimal = subnetParts.map((part) => parseInt(part));
  const gatewayParts = ipPartsDecimal.map(
    (part, index) => part & subnetPartsDecimal[index],
  );

  return gatewayParts.join(".");
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

// Example usage
const cidr = "192.168.1.254/24";
const route = getRouteFromCIDR(cidr);
console.log("Route:", route);
