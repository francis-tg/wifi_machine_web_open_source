const fs = require("fs");
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const print = (file, printerAddress) => {
  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON, // Printer type: 'star' or 'epson'
    //Printer interface
    interface: `/dev/usb/lp0`, //"tcp://192.168.1.8:9100",
    //interface: `tcp://192.168.1.8:9100`, //"tcp://192.168.1.8:9100", //  // Printer interface
    characterSet: "SLOVENIA", // Printer character set - default: SLOVENIA
    removeSpecialCharacters: false, // Removes special characters - default: false
    lineCharacter: "=", // Set character for lines - default: "-"
    options: {
      // Additional options
      timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
    },
  });
  console.log("/dev/usb/lp0");
  // Check if printer is connected
  printer.isPrinterConnected().then((isConnected) => {
    if (isConnected) {
      printer.printImage(`./${file}`).then(() => {
        printer.beep();
        printer.cut();
        printer.execute().then(() => {
          // Delete file after print
          setTimeout(() => {
            deleteFile(`./${file}`);
            console.log("Impression terminée");
          }, 5000);
        });
      });
      return true;
    } else {
      console.log("Printer not connected");
      return false;
    }
  });
};

function deleteFile(file) {
  fs.unlink(file, function (err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
    console.log("File deleted!");
  });
}

module.exports = { print };
