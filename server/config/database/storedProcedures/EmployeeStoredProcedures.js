const db = require('../dbConnection');

async function employeeExistByUsername(uName) {
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

async function employeeExistByID(uID) {
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

async function employeeDataByUsername(uName) {
    return new Promise((resolve, reject) => {
        db.all('SELECT employeeID, fName, lName, username, email, phone_number, role, account_status FROM employee WHERE username = ?', [uName], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows[0]); // Resolve rows if user found
            }
        });
    });
}

async function employeeDataById(uID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT employeeID, fName, lName, username, email, phone_number, role, account_status FROM employee WHERE employeeID = ?', [uID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows[0]); // Resolve rows if user found
            }
        });
    });
}

async function employeePasswordByUsername(uName) {
    return new Promise((resolve, reject) => {
        db.all('SELECT password FROM employee WHERE username = ?', [uName], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows[0]); // Resolve rows if user found
            }
        });
    });
}

async function employeePasswordById(uID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT password FROM employee WHERE employeeID = ?', [uID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows[0]); // Resolve rows if user found
            }
        });
    });
}

async function employeeUpdateEmployeeAccountByUsername(fName, lName, email, phone_number, pWord, uName) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET fName = ?, lName = ?, email = ?, phone_number = ?, password = ? WHERE username = ?', [fName, lName, email, phone_number, pWord, uName], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeUpdateEmployeeAccountByID(fName, lName, email, phone_number, pWord, eID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET fName = ?, lName = ?, email = ?, phone_number = ?, password = ? WHERE employeeID = ?', [fName, lName, email, phone_number, pWord, eID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeUpdateEmployeeAccountStatusByUsername(accountStatus, uName) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET account_status = ? WHERE username = ?', [accountStatus, uName], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeUpdateEmployeeStatusAccountByID(accountStatus, eID) {
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

module.exports = {
    employeeExistByUsername,
    employeeExistByID,
    employeeDataByUsername,
    employeeDataById,
    employeePasswordByUsername,
    employeePasswordById,
    employeeUpdateEmployeeAccountByUsername,
    employeeUpdateEmployeeAccountByID,
    employeeUpdateEmployeeAccountStatusByUsername,
    employeeUpdateEmployeeStatusAccountByID
}