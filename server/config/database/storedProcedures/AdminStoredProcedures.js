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

async function adminAddNewEmployee(fName, lName, username, email, phone_number, role, account_status, enteredBy, compID, compName, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO Employee (fName, lName, username, email, phone_number, role, entered_by, companyID, companyName, date_entered, time_entered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [fName, lName, username, email, phone_number, role, account_status, enteredBy, compID, compName, dateEntered, timeEntered], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminDeleteAnEmployeeByID(eID, compID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM Employee WHERE employeeID = ? and companyID = ?', [eID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminDeleteAnEmployeeByUsername(uName, compID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM Employee WHERE username = ? and companyID = ?', [uName, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminUpdateEmployeeAccountStatusByUsername(accountStatus, uName, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET account_status WHERE username = ? and companyID = ?', [accountStatus, uName, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminUpdateEmployeeAccountStatusByID(accountStatus, eID, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET account_status = ? WHERE employeeID = ? and companyID = ?', [accountStatus, eID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminUpdateEmployeeAccountByUsername(fName, lName, email, phone_number, role, uName, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET fName = ?, lName = ?, email = ?, phone_number = ?, role = ? WHERE username = ? and companyID = ?', [fName, lName, username, email, phone_number, role, uName, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminUpdateEmployeeAccountByID(fName, lName, email, phone_number, role, eID, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET fName = ?, lName = ?, email = ?, phone_number = ?, role = ? WHERE employeeID = ? and companyID = ?', [fName, lName, email, phone_number, role, eID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

/*-----------------------------------------------Home-----------------------------------------------*/
async function homeExistByName(name, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Home WHERE name = ? and companyID = ?', [name, compID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function homeExistByID(hID, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Home WHERE homeID = ? and companyID = ?', [hID, compID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function homeDataByName(name, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT homeID, name, street_address, city, state, zip_code, entered_by, companyID, companyName, date_entered, time_entered FROM Home WHERE name = ? and companyID = ?', [name, compID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows[0]); // Resolve rows if user found
            }
        });
    });
}

async function homeDataById(hID, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT homeID, name, street_address, city, state, zip_code, entered_by, date_entered, companyID, companyName, time_entered FROM Home WHERE homeID = ? and companyID = ?', [hID, compID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows[0]); // Resolve rows if user found
            }
        });
    });
}

async function adminAddNewHome(name, streetAddress, city, state, zipCode, enteredBy, compID, compName, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO Home (name, street_address, city, state, zip_code, entered_by, companyID, companyName, date_entered, time_entered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, streetAddress, city, state, zipCode, enteredBy, compID, compName, dateEntered, timeEntered], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminDeleteAHomeByID(hID, compID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM Home WHERE homeID = ? and companyID = ?', [hID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminDeleteAHomeByName(name, compID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM Home WHERE name = ? and companyID = ?', [name, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminUpdateHomeByName(name, streetAddress, city, state, zipCode, currentName, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET name = ?, street_address = ?, city = ?, state, zip_code = ? WHERE name = ? and companyID = ?', [name, streetAddress, city, state, zipCode, currentName, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function adminUpdateHomeByID(name, streetAddress, city, state, zipCode, hID, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET name = ?, street_address = ?, city = ?, state, zip_code = ? WHERE homeID = ? and companyID = ?', [name, streetAddress, city, state, zipCode, hID, compID], function (err) {
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