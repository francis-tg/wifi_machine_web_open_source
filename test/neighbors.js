const snmp = require("snmp-native");

// Configuration for MikroTik neighbor discovery
const config = {
  host: "192.168.5.208", // Replace with the actual IP address of your MikroTik device
  community: "public", // Replace with the SNMP community string of your MikroTik device
};

// Discover MikroTik neighbors using SNMP
function discoverMikroTikNeighbors() {
  const session = new snmp.Session({
    host: config.host,
    community: config.community,
  });

  session.getAll(
    { oid: [1, 3, 6, 1, 2, 1, 4, 22, 1, 2] },
    (error, varbinds) => {
      if (error) {
        console.error("An error occurred:", error);
      } else {
        console.log("Discovered MikroTik neighbors:");
        console.log(varbinds);
        varbinds.forEach((varbind) => {
          const ipAddress = varbind.oid.slice(-4).join(".");
          console.log(ipAddress);
        });
      }

      session.close();
    },
  );
}

// Call the function to discover MikroTik neighbors
discoverMikroTikNeighbors();
