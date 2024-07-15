const db = require('../dbConnection');

//Employee
async function adminExistbyUsername(uName) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM employee WHERE username = ?', [uName], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function adminExistbyID(uID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM employee WHERE employeeID = ?', [uID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function adminDatabyUsername(uName) {
    return new Promise((resolve, reject) => {
        db.all('SELECT employeeID, fName, lName, username, email, phone_number, role, account_status, entered_by, date_entered, time_entered FROM employee WHERE username = ?', [uName], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows[0]); // Resolve rows if user found
            }
        });
    });
}

async function adminDatabyId(uID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT employeeID, fName, lName, username, email, phone_number, role, account_status, entered_by, date_entered, time_entered FROM employee WHERE employeeID = ?', [uID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows[0]); // Resolve rows if user found
            }
        });
    });
}

async function adminAddNewEmployee(fName, lName, username, email, phone_number, role, account_status, enteredBy, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO Employee (fName, lName, username, email, phone_number, role, entered_by, date_entered, time_entered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [fName, lName, username, email, phone_number, role, account_status, enteredBy, dateEntered, timeEntered], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

//Home
async function homeExistbyName(name) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Home WHERE name = ?', [name], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function homeExistbyID(hID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Home WHERE homeID = ?', [hID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function homeDatabyName(name) {
    return new Promise((resolve, reject) => {
        db.all('SELECT homeID, name, street_address, city, state, zip_code, entered_by, date_entered, time_entered FROM Home WHERE name = ?', [name], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows[0]); // Resolve rows if user found
            }
        });
    });
}

async function homeDatabyId(hID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT homeID, name, street_address, city, state, zip_code, entered_by, date_entered, time_entered FROM Home WHERE homeID = ?', [hID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows[0]); // Resolve rows if user found
            }
        });
    });
}

async function adminAddNewHome(name, streetAddress, city, state, zipCode, enteredBy, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO Home (name, street_address, city, state, zip_code, entered_by, date_entered, time_entered) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [name, streetAddress, city, state, zipCode, enteredBy, dateEntered, timeEntered], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

module.exports = {
    adminExistbyUsername,
    adminExistbyID,
    adminDatabyUsername,
    adminDatabyId,
    adminAddNewEmployee,
    homeExistbyName,
    homeExistbyID,
    homeDatabyName,
    homeDatabyId,
    adminAddNewHome
}