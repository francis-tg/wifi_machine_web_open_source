module.exports.Controller = (app) => {
  // money enter routes logs
  const dashboard = require("../dashboard");
  app.use("/", dashboard);
  // money enter routes logs
  const logs = require("../api/logs");
  app.use("/api/logs", logs);
  // mikrotik routes
  const mikrotikdatas = require("../api/mikrotik");
  app.use("/api/mikrotik", mikrotikdatas);
  // tickets routes
  const tickets = require("../api/tickets");
  app.use("/api/tickets", tickets);
  // tickets routes
  const machineroute = require("../machine_routes");
  app.use("/mroute", machineroute);
  // tickets routes
  const mikrotikroute = require("../mikrotik_routes");
  app.use("/mkroute", mikrotikroute);
  // users routes
  const users = require("../users");
  app.use("/users", users);
  // Dashboard routes ===> Device
  const device = require("../devices");
  app.use("/devices", device);
  // Dashboard routes ===> ticket
  const ticket = require("../tickets");
  app.use("/tickets", ticket);
  // Dashboard routes ===> settings
  const settings = require("../settings");
  app.use("/settings", settings);
  // Dashboard routes ===> statistics
  const statistics = require("../statistics");
  app.use("/statistics", statistics);
  const config = require("../config");
  app.use("/config", config);
};
