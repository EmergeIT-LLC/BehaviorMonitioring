const { AuthLog } = require("../../models");

function logAuthEvent(
  event,
  {
    userId = null,
    email = null,
    ip = null,
    userAgent = null,
    details = null,
  } = {}
) {
  const timestamp = new Date().toISOString();

  AuthLog.create({
    timestamp,
    event,
    userId,
    email,
    ip,
    userAgent,
    details
  }).catch(err => {
    console.error("Failed to insert auth log:", err.message);
  });
}

module.exports = logAuthEvent;