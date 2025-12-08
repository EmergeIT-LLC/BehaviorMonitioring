const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(__dirname + '/dataStorage.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("\nDB Configuration Error:\n" + err.message);
    }
});

module.exports = db;