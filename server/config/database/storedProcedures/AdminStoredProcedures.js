const db = require('../dbConnection');

/*-----------------------------------------------Employee-----------------------------------------------*/
async function adminExistByUsername(uName) {
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

async function adminExistByID(uID) {
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

async function adminDataByUsername(uName) {
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

async function adminDataById(uID) {
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

async function adminDeleteAnEmployeeByID(eID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM Employee WHERE employeeID = ?', [eID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminDeleteAnEmployeeByUsername(uName) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM Employee WHERE username = ?', [uName], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminUpdateEmployeeAccountStatusByUsername(accountStatus, uName) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET account_status WHERE username = ?', [accountStatus, uName], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminUpdateEmployeeAccountStatusByID(accountStatus, eID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET account_status = ? WHERE employeeID = ?', [accountStatus, eID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminUpdateEmployeeAccountByUsername(fName, lName, email, phone_number, role, uName) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET fName = ?, lName = ?, email = ?, phone_number = ?, role = ? WHERE username = ?', [fName, lName, username, email, phone_number, role, uName], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminUpdateEmployeeAccountByID(fName, lName, email, phone_number, role, eID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET fName = ?, lName = ?, email = ?, phone_number = ?, role = ? WHERE employeeID = ?', [fName, lName, email, phone_number, role, eID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

/*-----------------------------------------------Home-----------------------------------------------*/
async function homeExistByName(name) {
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

async function homeExistByID(hID) {
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

async function homeDataByName(name) {
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

async function homeDataById(hID) {
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

async function adminDeleteAHomeByID(hID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM Home WHERE homeID = ?', [hID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminDeleteAHomeByName(name) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM Home WHERE name = ?', [name], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminUpdateHomeByName(name, streetAddress, city, state, zipCode, currentName) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET name = ?, street_address = ?, city = ?, state, zip_code = ? WHERE name = ?', [name, streetAddress, city, state, zipCode, currentName], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminUpdateHomeByID(name, streetAddress, city, state, zipCode, hID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET name = ?, street_address = ?, city = ?, state, zip_code = ? WHERE homeID = ?', [name, streetAddress, city, state, zipCode, hID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

module.exports = {
    adminExistByUsername,
    adminExistByID,
    adminDataByUsername,
    adminDataById,
    adminAddNewEmployee,
    adminDeleteAnEmployeeByID,
    adminDeleteAnEmployeeByUsername,
    adminUpdateEmployeeAccountStatusByUsername,
    adminUpdateEmployeeAccountStatusByID,
    adminUpdateEmployeeAccountByUsername,
    adminUpdateEmployeeAccountByID,
    homeExistByName,
    homeExistByID,
    homeDataByName,
    homeDataById,
    adminAddNewHome,
    adminDeleteAHomeByID,
    adminDeleteAHomeByName,
    adminUpdateHomeByName,
    adminUpdateHomeByID
}