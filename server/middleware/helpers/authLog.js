const db = require("../database/dbConnection");

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

  db.run('INSERT INTO auth_logs (timestamp, event, userId, email, ip, userAgent, details) VALUES (?, ?, ?, ?, ?, ?, ?)', [timestamp, event, userId, email, ip, userAgent, details], (err) => {
        if (err) {
            console.error("Failed to insert auth log:", err.message);
        }
    });
}

module.exports = logAuthEvent;