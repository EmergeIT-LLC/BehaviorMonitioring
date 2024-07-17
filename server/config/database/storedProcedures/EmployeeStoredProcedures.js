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

async function employeeUpdateEmployeeAccountWithoutPasswordByUsername(fName, lName, email, phone_number, pWord, uName) {
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

async function employeeUpdateEmployeeAccountWithoutPasswordByID(fName, lName, email, phone_number, pWord, eID) {
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

async function employeeSetEmployeeCredentialsByUsername(pWord, uName) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET password = ? WHERE username = ?', [pWord, uName], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeSetEmployeeCredentialsByID(pWord, eID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Employee SET password = ? WHERE employeeID = ?', [pWord, eID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

/*-------------------------------------------------ABA--------------------------------------------------*/
async function behaviorSkillExistByID(bsID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM BehaviorAndSkill WHERE bsID = ?', [bsID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}


async function employeeAddFrequencyBehaviorData(bsID, cID, cName, sDate, sTime, count, enteredBy, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO BehaviorData (bsID, clientID, clientName, sessionDate, sessionTime, count, entered_by, date_entered, time_entered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [bsID, cID, cName, sDate, sTime, count, enteredBy, dateEntered, timeEntered], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeAddRateBehaviorData(bsID, cID, cName, sDate, sTime, count, duration, enteredBy, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO BehaviorData (bsID, clientID, clientName, sessionDate, sessionTime, count, duration, entered_by, date_entered, time_entered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [bsID, cID, cName, sDate, sTime, count, duration, enteredBy, dateEntered, timeEntered], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function employeeAddDurationBehaviorData(bsID, cID, cName, sDate, sTime, trial, enteredBy, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO BehaviorData (bsID, clientID, clientName, sessionDate, sessionTime, trial, entered_by, date_entered, time_entered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [bsID, cID, cName, sDate, sTime, trial, enteredBy, dateEntered, timeEntered], function (err) {
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