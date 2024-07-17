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
        db.run('INSERT INTO BehaviorAndSkill (name, definition, measurement, category, type, clientID, clientName, entered_by, date_entered, time_entered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, def, meas, cat, type, cID, cName, enteredBy, dateEntered, timeEntered], function (err) {
            if (err) {
                reject({ message: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if new user is added, false otherwise
            }
        });
    });
}

async function abaAddFrequencyBehaviorData(bsID, cID, cName, sDate, sTime, count, enteredBy, dateEntered, timeEntered) {
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

async function abaAddRateBehaviorData(bsID, cID, cName, sDate, sTime, count, duration, enteredBy, dateEntered, timeEntered) {
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

async function abaAddDurationBehaviorData(bsID, cID, cName, sDate, sTime, trial, enteredBy, dateEntered, timeEntered) {
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
    abaClientExistByID,
    abaAddClientData,
    behaviorSkillExistByID,
    abaAddBehaviorOrSkill,
    abaAddFrequencyBehaviorData,
    abaAddRateBehaviorData,
    abaAddDurationBehaviorData
}