const mongoose = require("mongoose");
const sendSuccess = require("../utils/apiResponse");

const healthCheck = (req, res) =>
  sendSuccess(res, 200, "API is healthy.", {
    uptime: process.uptime(),
    databaseState: mongoose.connection.readyState,
    timestamp: new Date().toISOString(),
  });

module.exports = {
  healthCheck,
};
