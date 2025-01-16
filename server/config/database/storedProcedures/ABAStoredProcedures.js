const db = require('../dbConnection');

/*-------------------------------------------------client--------------------------------------------------*/
async function abaClientExistByID(cID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM client WHERE clientID = ?', [cID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function abaAddClientData(fName, lName, DOB, intakeDate, groupHomeName, medicadeNum, behaviorPlanDueDate, enteredBy, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO client (fName, lName, DOB, intake_Date, group_home_name, medicaid_id_number, behavior_plan_due_date, entered_by, date_entered, time_entered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [fName, lName, DOB, intakeDate, groupHomeName, medicadeNum, behaviorPlanDueDate, enteredBy, dateEntered, timeEntered], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaGetClientDataByID(cID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT clientID, fName, lName, DOB, intake_Date, group_home_name, medicaid_id_number, behavior_plan_due_date, entered_by, date_entered, time_entered FROM client WHERE clientID = ?', [cID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows[0]);
            }
        });
    });
}

async function abaGetAllClientData() {
    return new Promise((resolve, reject) => {
        db.all('SELECT clientID, fName, lName, DOB, intake_Date, group_home_name, medicaid_id_number, behavior_plan_due_date, entered_by, date_entered, time_entered FROM client', [], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows);
            }
        });
    });
}

async function abaUpdateClientData(fName, lName, DOB, intakeDate, groupHomeName, medicadeNum, behaviorPlanDueDate, cID) {
    return new Promise((resolve, reject) => {
        db.run('UDATE client SET fName = ?, lName = ?, DOB = ?, intake_Date = ?, group_home_name = ?, medicaid_id_number = ?, behavior_plan_due_date = ?, WHERE clientID = ?', [fName, lName, DOB, intakeDate, groupHomeName, medicadeNum, behaviorPlanDueDate, cID], function (err) {
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

async function abaAddBehaviorOrSkill(name, def, meas, cat, type, cID, cName, enteredBy, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO BehaviorAndSkill (name, definition, measurement, category, type, clientID, clientName, entered_by, date_entered, time_entered, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, def, meas, cat, type, cID, cName, enteredBy, dateEntered, timeEntered, "Active"], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaUpdateBehaviorOrSkill(name, def, meas, cat, type, cID, cName, bsID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE BehaviorAndSkill SET name = ?, definition= ?, measurement= ?, category= ?, type= ?, clientID = ?, clientName = ? WHERE bsID = ?', [name, def, meas, cat, type, cID, cName, bsID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaGetBehaviorOrSkill(cID, BorS) {
    return new Promise((resolve, reject) => {
        db.all('SELECT bsID, name, definition, measurement, category, type, clientID, clientName, entered_by, date_entered, time_entered, status FROM BehaviorAndSkill WHERE clientID = ? and type = ? and status = ?', [cID, BorS, "Active"], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function abaAddFrequencyBehaviorData(bsID, cID, cName, sDate, sTime, count, enteredBy, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO BehaviorData (bsID, clientID, clientName, sessionDate, sessionTime, count, entered_by, date_entered, time_entered, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [bsID, cID, cName, sDate, sTime, count, enteredBy, dateEntered, timeEntered, "Active"], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaAddRateBehaviorData(bsID, cID, cName, sDate, sTime, count, duration, enteredBy, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO BehaviorData (bsID, clientID, clientName, sessionDate, sessionTime, count, duration, entered_by, date_entered, time_entered, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [bsID, cID, cName, sDate, sTime, count, duration, enteredBy, dateEntered, timeEntered, "Active"], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaAddDurationBehaviorData(bsID, cID, cName, sDate, sTime, trial, enteredBy, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO BehaviorData (bsID, clientID, clientName, sessionDate, sessionTime, duration, entered_by, date_entered, time_entered, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [bsID, cID, cName, sDate, sTime, trial, enteredBy, dateEntered, timeEntered, "Active"], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaGetBehaviorDataById(cID, bsID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT bsID, clientID, clientName, sessionDate, sessionTime, count, duration, trial, entered_by, date_entered, time_entered, status FROM BehaviorData WHERE bsID = ? and clientID = ? and status = ?', [bsID, cID, "Active"], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaMergeBehaviorDataById(cID, tBSID, mBsID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE BehaviorData SET bsID = ? WHERE bsID = ? and clientID = ?', [tBSID, mBsID, cID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaDeleteBehaviorDataByID(cID, bsID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM BehaviorData WHERE bsID = ? and clientID = ?', [bsID, cID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaDeleteBehaviorOrSkillByID(cID, bsID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM BehaviorAndSkill WHERE bsID = ? and clientID = ?', [bsID, cID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaArchiveBehaviorDataByID(cID, bsID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE BehaviorData SET status = ?, WHERE bsID = ? and clientID = ?', [bsID, cID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaArchiveBehaviorOrSkillByID(cID, bsID, dateArchived, dateToDeleteArchive) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE BehaviorAndSkill SET status = ?, archived_date = ?, archived_deletion_date = ? WHERE bsID = ? and clientID = ?', ["Archived", dateArchived, dateToDeleteArchive, bsID, cID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

module.exports = {
    abaClientExistByID,
    abaAddClientData,
    abaGetClientDataByID,
    abaUpdateClientData,
    abaGetAllClientData,
    behaviorSkillExistByID,
    abaGetBehaviorDataById,
    abaAddBehaviorOrSkill,
    abaUpdateBehaviorOrSkill,
    abaGetBehaviorOrSkill,
    abaAddFrequencyBehaviorData,
    abaAddRateBehaviorData,
    abaAddDurationBehaviorData,
    abaMergeBehaviorDataById,
    abaDeleteBehaviorDataByID,
    abaDeleteBehaviorOrSkillByID,
    abaArchiveBehaviorDataByID,
    abaArchiveBehaviorOrSkillByID
}