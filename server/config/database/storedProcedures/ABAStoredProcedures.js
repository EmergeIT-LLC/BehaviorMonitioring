const db = require('../dbConnection');

/*-------------------------------------------------client--------------------------------------------------*/
async function abaClientExistByID(cID, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM client WHERE clientID = ? and companyID = ?', [cID, compID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function abaAddClientData(fName, lName, DOB, intakeDate, groupHomeName, medicadeNum, behaviorPlanDueDate, enteredBy, compID, compName, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO client (fName, lName, DOB, intake_Date, group_home_name, medicaid_id_number, behavior_plan_due_date, entered_by, companyID, companyName, date_entered, time_entered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [fName, lName, DOB, intakeDate, groupHomeName, medicadeNum, behaviorPlanDueDate, enteredBy, compID, compName, dateEntered, timeEntered], function (err) {
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
        db.all('SELECT clientID, fName, lName, DOB, intake_Date, group_home_name, medicaid_id_number, behavior_plan_due_date, entered_by, date_entered, companyID, companyName, time_entered FROM client WHERE clientID = ?', [cID], (err, rows) => {
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
        db.all('SELECT clientID, fName, lName, DOB, intake_Date, group_home_name, medicaid_id_number, behavior_plan_due_date, entered_by, companyID, companyName, date_entered, time_entered FROM client', [], (err, rows) => {
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

/*-------------------------------------------------Behavior--------------------------------------------------*/
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

async function abaAddBehaviorOrSkill(name, def, meas, cat, type, cID, cName, enteredBy, compID, compName, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO BehaviorAndSkill (name, definition, measurement, category, type, clientID, clientName, entered_by, companyID, companyName, date_entered, time_entered, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, def, meas, cat, type, cID, cName, enteredBy, compID, compName, dateEntered, timeEntered, "Active"], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaUpdateBehaviorOrSkill(name, def, meas, cat, type, cID, cName, bsID, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE BehaviorAndSkill SET name = ?, definition= ?, measurement= ?, category= ?, type= ?, clientID = ?, clientName = ? WHERE bsID = ? and companyID = ?', [name, def, meas, cat, type, cID, cName, bsID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaGetBehaviorOrSkill(cID, BorS, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT bsID, name, definition, measurement, category, type, clientID, clientName, entered_by, date_entered, time_entered, status FROM BehaviorAndSkill WHERE clientID = ? and type = ? and companyID = ? and status = ?', [cID, BorS, compID, "Active"], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function abaGetABehaviorOrSkill(cID, bsID, BorS, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT bsID, name, definition, measurement, category, type, clientID, clientName, entered_by, date_entered, time_entered, status FROM BehaviorAndSkill WHERE clientID = ? and bsID = ? and type = ? and companyID = ? and status = ?', [cID, bsID, BorS, compID, "Active"], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function abaAddFrequencyBehaviorData(bsID, cID, cName, sDate, sTime, count, enteredBy, compID, compName, dateEntered, timeEntered) {
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

async function abaAddRateBehaviorData(bsID, cID, cName, sDate, sTime, count, duration, enteredBy, compID, compName, dateEntered, timeEntered) {
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

async function abaAddDurationBehaviorData(bsID, cID, cName, sDate, sTime, trial, enteredBy, compID, compName, dateEntered, timeEntered) {
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

async function abaGetBehaviorDataById(cID, bsID, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT behaviorDataID, bsID, clientID, clientName, sessionDate, sessionTime, count, duration, trial, entered_by, date_entered, time_entered, status FROM BehaviorData WHERE bsID = ? and clientID = ? and companyID = ? and status = ?', [bsID, cID, compID, "Active"], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaFoundBehaviorDataById(cID, bsID, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT behaviorDataID, bsID, clientID, clientName, sessionDate, sessionTime, count, duration, trial, entered_by, date_entered, time_entered, status FROM BehaviorData WHERE bsID = ? and clientID = ? and companyID = ? and status = ?', [bsID, cID, compID, "Active"], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaMergeBehaviorDataById(cID, tBSID, mBsID, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE BehaviorData SET bsID = ? WHERE bsID = ? and clientID = ? and companyID = ?', [tBSID, mBsID, cID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaDeleteBehaviorDataByID(cID, bsID, compID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM BehaviorData WHERE bsID = ? and clientID = ? and companyID = ?', [bsID, cID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaGetBehaviorDataByBehaviorId(cID, bsID, bdID, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT behaviorDataID, bsID, clientID, clientName, sessionDate, sessionTime, count, duration, trial, entered_by, date_entered, time_entered, status FROM BehaviorData WHERE bsID = ? and behaviorDataID = ? and clientID = ? and companyID = ? and status = ?', [bsID, bdID, cID, compID, "Active"], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaDeleteBehaviorDataByBehaviorID(cID, bsID, bdID, compID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM BehaviorData WHERE bsID = ? and behaviorDataID = ? and clientID = ? and companyID = ?', [bsID, bdID, cID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaDeleteBehaviorOrSkillByID(cID, bsID, compID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM BehaviorAndSkill WHERE bsID = ? and clientID = ? and companyID = ?', [bsID, cID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaArchiveBehaviorDataByID(newStatus, cID, bsID, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE BehaviorData SET status = ? WHERE bsID = ? and clientID = ? and companyID = ?', [newStatus, bsID, cID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaArchiveBehaviorOrSkillByID(cID, bsID, dateArchived, dateToDeleteArchive, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE BehaviorAndSkill SET status = ?, archived_date = ?, archived_deletion_date = ? WHERE bsID = ? and clientID = ? and companyID = ?', ["Archived", dateArchived, dateToDeleteArchive, bsID, cID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

/*-------------------------------------------------Behavior ARCHIVE--------------------------------------------------*/

async function archiveBehaviorSkillExistByID(bsID, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM BehaviorAndSkill WHERE bsID = ? and companyID = ? and status = ?', [bsID, compID, 'Archived'], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function abaReactivateBehaviorDataByID(newStatus, cID, bsID, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE BehaviorData SET status = ?, WHERE bsID = ? and clientID = ? and companyID = ?', [newStatus, bsID, cID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaReactivateBehaviorOrSkillByID(cID, bsID, dateArchived, dateToDeleteArchive, compID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE BehaviorAndSkill SET status = ?, archived_date = ?, archived_deletion_date = ? WHERE bsID = ? and clientID = ? and companyID = ?', ["Active", dateArchived, dateToDeleteArchive, bsID, cID, compID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaGetArchivedBehaviorDataById(cID, bsID, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT behaviorDataID, bsID, clientID, clientName, sessionDate, sessionTime, count, duration, trial, entered_by, date_entered, time_entered, status FROM BehaviorData WHERE bsID = ? and clientID = ? and companyID = ? and status = ?', [bsID, cID, compID, "Archived"], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaGetArchivedBehaviorOrSkill(cID, BorS, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT bsID, name, definition, measurement, category, type, clientID, clientName, entered_by, date_entered, time_entered, status FROM BehaviorAndSkill WHERE clientID = ? and type = ? and companyID = ? and status = ?', [cID, BorS, compID, "Archived"], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function abaDeleteArchivedBehaviorDataByID(cID, bsID, compID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM BehaviorData WHERE bsID = ? and clientID = ? and companyID = ? and status = ?', [bsID, cID, compID, 'Archived'], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaDeleteArchivedBehaviorOrSkillByID(cID, bsID, compID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM BehaviorAndSkill WHERE bsID = ? and clientID = ? and companyID = ? and status = ?', [bsID, cID, compID, 'Archived'], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaGetAArchivedBehaviorOrSkill(cID, bsID, BorS, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT bsID, name, definition, measurement, category, type, clientID, clientName, entered_by, date_entered, time_entered, status FROM BehaviorAndSkill WHERE clientID = ? and bsID = ? and type = ? and companyID = ? and status = ?', [cID, bsID, BorS, compID, "Archived"], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function abaGetArchivedBehaviorDataByBehaviorId(cID, bsID, bdID, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT behaviorDataID, bsID, clientID, clientName, sessionDate, sessionTime, count, duration, trial, entered_by, date_entered, time_entered, status FROM BehaviorData WHERE bsID = ? and behaviorDataID = ? and clientID = ? and companyID = ? and status = ?', [bsID, bdID, cID, compID, "Archived"], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaDeleteArchivedBehaviorDataByBehaviorID(cID, bsID, bdID, compID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM BehaviorData WHERE bsID = ? and behaviorDataID = ? and clientID = ? and companyID = ? and status = ?', [bsID, bdID, cID, compID, "Archived"], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

/*-------------------------------------------------Session Notes--------------------------------------------------*/
async function abaSessionNoteDataByClientID(cID, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT sessionNoteDataID, clientID, clientName, sessionDate, sessionTime, entered_by, date_entered, time_entered FROM SessionNoteData WHERE clientID = ? and companyID = ?', [cID, compID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function abaGetSessionNoteDataByClientID(cID, compID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT sessionNoteDataID, clientID, clientName, sessionDate, sessionTime, entered_by, date_entered, time_entered FROM SessionNoteData WHERE clientID = ? and companyID = ?', [cID, compID], (err, rows) => {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(rows); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function abaAddSessionNoteData(cID, cName, sDate, sTime, sNotes, enteredBy, compID, compName, dateEntered, timeEntered) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO SessionNoteData (clientID, clientName, sessionDate, sessionTime, sessionNotes, entered_by, companyID, companyName, date_entered, time_entered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [cID, cName, sDate, sTime, sNotes, enteredBy, compID, compName, dateEntered, timeEntered], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaDeleteSessionNoteDataByID(cID, snID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM SessionNoteData WHERE sessionNoteDataID = ? and clientID = ?', [snID, cID], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0);
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
    abaFoundBehaviorDataById,
    abaGetABehaviorOrSkill,
    abaAddBehaviorOrSkill,
    abaUpdateBehaviorOrSkill,
    abaGetBehaviorOrSkill,
    abaAddFrequencyBehaviorData,
    abaAddRateBehaviorData,
    abaAddDurationBehaviorData,
    abaMergeBehaviorDataById,
    abaDeleteBehaviorDataByID,
    abaDeleteBehaviorOrSkillByID,
    abaGetBehaviorDataByBehaviorId,
    abaDeleteBehaviorDataByBehaviorID,
    archiveBehaviorSkillExistByID,
    abaArchiveBehaviorDataByID,
    abaReactivateBehaviorOrSkillByID,
    abaReactivateBehaviorDataByID,
    abaArchiveBehaviorOrSkillByID,
    abaGetArchivedBehaviorDataById,
    abaGetArchivedBehaviorOrSkill,
    abaDeleteArchivedBehaviorDataByID,
    abaDeleteArchivedBehaviorOrSkillByID,
    abaGetArchivedBehaviorDataByBehaviorId,
    abaGetAArchivedBehaviorOrSkill,
    abaDeleteArchivedBehaviorDataByBehaviorID,
    abaAddSessionNoteData,
    abaSessionNoteDataByClientID,
    abaGetSessionNoteDataByClientID,
    abaDeleteSessionNoteDataByID
}