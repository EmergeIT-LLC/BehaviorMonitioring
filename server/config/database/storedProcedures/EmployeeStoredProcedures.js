const db = require('../dbConnection');

/*-------------------------------------------------Employee--------------------------------------------------*/
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
        db.all('SELECT employeeID, fName, lName, username, email, phone_number, role, account_status, companyID, companyName, FROM employee WHERE username = ?', [uName], (err, rows) => {
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
        db.all('SELECT employeeID, fName, lName, username, email, phone_number, role, account_status, companyID, companyName, FROM employee WHERE employeeID = ?', [uID], (err, rows) => {
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

async function employeeUpdateEmployeeAccountByUsername(fName, lName, email, phone_number, pWord, uName, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET fName = ?, lName = ?, email = ?, phone_number = ?, password = ? WHERE username = ? and companyID = ?', [fName, lName, email, phone_number, pWord, uName, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeUpdateEmployeeAccountByID(fName, lName, email, phone_number, pWord, eID, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET fName = ?, lName = ?, email = ?, phone_number = ?, password = ? WHERE employeeID = ? and companyID = ?', [fName, lName, email, phone_number, pWord, eID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeUpdateEmployeeAccountWithoutPasswordByUsername(fName, lName, email, phone_number, pWord, uName, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET fName = ?, lName = ?, email = ?, phone_number = ?, password = ? WHERE username = ? and companyID = ?', [fName, lName, email, phone_number, pWord, uName, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeUpdateEmployeeAccountWithoutPasswordByID(fName, lName, email, phone_number, pWord, eID, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET fName = ?, lName = ?, email = ?, phone_number = ?, password = ? WHERE employeeID = ? and companyID = ?', [fName, lName, email, phone_number, pWord, eID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeUpdateEmployeeAccountStatusByUsername(accountStatus, uName, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET account_status = ? WHERE username = ? and companyID = ?', [accountStatus, uName, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeUpdateEmployeeStatusAccountByID(accountStatus, eID, compID) {
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

async function employeeSetEmployeeCredentialsByUsername(pWord, uName, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET password = ? WHERE username = ? and companyID = ?', [pWord, uName, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeSetEmployeeCredentialsByID(pWord, eID, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET password = ? WHERE employeeID = ? and companyID = ?', [pWord, eID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

/*-------------------------------------------------ABA--------------------------------------------------*/
async function behaviorSkillExistByID(bsID, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM BehaviorAndSkill WHERE bsID = ? and companyID = ?', [bsID, compID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function employeeAddFrequencyBehaviorData(bsID, cID, cName, sDate, sTime, count, enteredBy, compID, compName, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO BehaviorData (bsID, clientID, clientName, sessionDate, sessionTime, count, entered_by, companyID, companyName, date_entered, time_entered, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [bsID, cID, cName, sDate, sTime, count, enteredBy, compID, compName, dateEntered, timeEntered, "Active"], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeAddRateBehaviorData(bsID, cID, cName, sDate, sTime, count, duration, enteredBy, compID, compName, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO BehaviorData (bsID, clientID, clientName, sessionDate, sessionTime, count, duration, entered_by, companyID, companyName, date_entered, time_entered, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [bsID, cID, cName, sDate, sTime, count, duration, enteredBy, compID, compName, dateEntered, timeEntered, "Active"], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeAddDurationBehaviorData(bsID, cID, cName, sDate, sTime, trial, enteredBy, compID, compName, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO BehaviorData (bsID, clientID, clientName, sessionDate, sessionTime, duration, entered_by, companyID, companyName, date_entered, time_entered, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [bsID, cID, cName, sDate, sTime, trial, enteredBy, compID, compName, dateEntered, timeEntered, "Active"], function (err) {
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
    employeeUpdateEmployeeAccountWithoutPasswordByUsername,
    employeeUpdateEmployeeAccountWithoutPasswordByID,
    employeeUpdateEmployeeAccountStatusByUsername,
    employeeUpdateEmployeeStatusAccountByID,
    employeeSetEmployeeCredentialsByUsername,
    employeeSetEmployeeCredentialsByID,
    behaviorSkillExistByID,
    employeeAddFrequencyBehaviorData,
    employeeAddRateBehaviorData,
    employeeAddDurationBehaviorData
}