require('dotenv').config();
const express = require('express');
const router = express.Router();
const employeeQueries = require('../config/database/storedProcedures/EmployeeStoredProcedures');
const emailHandler = require('../config/email/emailTemplate');
const currentDateTime = require('../functions/basic/currentDateTime');
const cookieMonster = require('../config/cookies/cookieHandler');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

/*--------------------------------------------Authentication---------------------------------------------*/
router.post('/validateEmployeeAccount', async (req, res) => {
    try {
        const uName = req.body.username;
        
        if (await employeeQueries.employeeExistByUsername(uName)) {
            const employeeData = await employeeQueries.employeeDataByUsername(uName.toLowerCase());

            if (employeeData.account_status === "In Verification") {
                return res.json({ statusCode: 200, locatedAccount: true });
            }
            return res.json({ statusCode: 401, locatedAccount: false });            
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/validateEmployeeAccount', async (req, res) => {
    try {
        const uName = req.body.username;
        const password = req.body.password;
    
        if (await employeeQueries.employeeExistByUsername(uName)) {
            const employeeData = await employeeQueries.employeeDataByUsername(uName.toLowerCase());

            if (employeeData.account_status === "In Verification") {
                bcrypt.hash(password, saltRounds, async function(err, hash) {
                    if (err) {
                        return res.json({ statusCode: 403, accountVerified: false, serverMessage: 'A server error occurred', errorMessage: err.message });
                    }
                    else if (await employeeQueries.employeeSetEmployeeCredentialsByUsername(hash, uName)) {
                        if (await employeeQueries.employeeUpdateEmployeeAccountStatusByUsername("Active", uName)) {
                            return res.json({ statusCode: 200, accountVerified: true });
                        }
                        else {
                            return res.json({ statusCode: 403, accountVerified: false, serverMessage: 'A server error occurred', errorMessage: 'Unable to activate account' });
                        }
                    }
                });
            }
            return res.json({ statusCode: 401, locatedAccount: false });            
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/verifyEmployeeLogin', async (req, res) => {
    try {
        const uName = req.body.username;
        const password = req.body.password;

        if (await employeeQueries.employeeExistByUsername(uName.toLowerCase())) {
            const employeePassword = await employeeQueries.employeePasswordByUsername(uName.toLowerCase());

            if (employeePassword.password.length > 0 || employeePassword.password !== null) {
                const bcryptResult = await new Promise((resolve, reject) => {
                    bcrypt.compare(password, employeePassword.password, (err, result) => {
                        if (err){
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });

                if (bcryptResult) {
                    const employeeData = await employeeQueries.employeeDataByUsername(uName.toLowerCase());
                    
                    if (employeeData.role === "root" || employeeData.role === "admin") {
                        return res.json({ statusCode: 200, loginStatus: true, isAdmin: true });
                    }
                    else {
                        return res.json({ statusCode: 200, loginStatus: true, isAdmin: false });
                    }
                }
                else {
                    return res.json({ statusCode: 401, serverMessage: 'Password is incorrect' });
                }
            }
            else {
                //Need to send the verification email to the employee and return 401 code if email is successfully sent...
                return res.json({ statusCode: 401, serverMessage: 'User needs to authenticate their account' });
            }
        }
        else {
            return res.json({ statusCode: 401, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/verifyEmployeeLogout', async (req, res) => {
    try {
        const uName = req.body.username;

        let cookieSettings = await cookieMonster.deleteCookie(res, 'bmAuthServices-' + uName.toLowerCase())

        return res.json({ statusCode: 200, loginStatus: false, isAdmin: false, cookie: cookieSettings });
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

/*-----------------------------------------------Employee-----------------------------------------------*/
router.post('/getEmployeeData', async (req, res) => {
    try {
        const uName = req.body.username;

        if (await employeeQueries.employeeExistByUsername(uName.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(uName.toLowerCase());
            if (employeeData.length > 0) {
                return res.json({ statusCode: 200, employeeData: employeeData });
            }
        }
        else {
            return res.json({ statusCode: 401, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/updateEmployeeData', async (req, res) => {
    try {
        const eID = req.body.employeeID;
        const fName = req.body.fName;
        const lName = req.body.lName;
        const email = req.body.email;
        const pNumber = req.body.pNumber;
        const pWord = req.body.password;
        const newPWord = req.body.newPassword

        if (await employeeQueries.employeeExistByID(eID)) {
            const employeePassword = await employeeQueries.employeePasswordById(eID);

            const bcryptResult = await new Promise((resolve, reject) => {
                bcrypt.compare(pWord, employeePassword.password, (err, result) => {
                    if (err){
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });

            if (bcryptResult) {
                bcrypt.hash(newPWord, saltRounds, async function(err, hash) {
                    if (err) {
                        return res.json({ statusCode: 500, updateStatus: false, serverMessage: 'Account update failed' });
                    }
                    else if (await employeeQueries.employeeUpdateEmployeeAccountByID(fName, lName, email, pNumber, hash, eID)) {
                        return res.json({statusCode: 200, updateStatus: true });
                    }
                });
            }
            else {
                return res.json({ statusCode: 401, updateStatus: false, serverMessage: 'Incorrect credentials' });
            }
        }
        else {
            return res.json({ statusCode: 401, updateStatus: false, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

/*-------------------------------------------------ABA--------------------------------------------------*/
router.post('/addBehaviorData', async (req, res) => {
    try {
        const bsID = req.body.bsID;
        const clientID = req.body.clientID;
        const clientName = req.body.clientName;
        const sessionDate = req.body.sessionDate;
        const sessionTime = req.body.sessionTime;
        const count = req.body.count;
        const duration = req.body.duration;
        const trial = req.body.trial;
        const employeeUsername = req.body.employeeUsername;
        
        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin" || employeeData.role === "ABA") {
                if (await employeeQueries.behaviorSkillExistByID(bsID)) {
                    if (count > 0) {
                        if (duration > 0) { //If Count and Duration
                            if (await employeeQueries.employeeAddRateBehaviorData(bsID, clientID, clientName, sessionDate, sessionTime, count, duration, employeeData.fName + " " + employeeData.lName, await currentDateTime.getCurrentDate(), await currentDateTime.getCurrentTime() + " EST")) {
                                return res.json({statusCode: 200, behaviorAdded: true});
                            }
                            else { //Error adding duration behavior
                                return res.json({statusCode: 500, behaviorAdded: false});
                            }
                        } //If count only
                        else if (await employeeQueries.employeeAddFrequencyBehaviorData(bsID, clientID, clientName, sessionDate, sessionTime, count, employeeData.fName + " " + employeeData.lName, await currentDateTime.getCurrentDate(), await currentDateTime.getCurrentTime() + " EST")) {
                            return res.json({statusCode: 200, behaviorAdded: true});
                        }
                        else { //Error adding frequency behavior
                            return res.json({statusCode: 500, behaviorAdded: false});
                        }
                    }
                    else if (trial > 0) { //If trial behavior
                        if (await employeeQueries.employeeAddDurationBehaviorData(bsID, clientID, clientName, sessionDate, sessionTime, trial, employeeData.fName + " " + employeeData.lName, await currentDateTime.getCurrentDate(), await currentDateTime.getCurrentTime() + " EST"))  {
                            return res.json({statusCode: 200, behaviorAdded: true});
                        }
                        else { //Error adding trial behavior
                            return res.json({statusCode: 500, behaviorAdded: false});
                        }
                    }
                    else { //Conditions for behavior not met...
                        return res.json({statusCode: 500, behaviorAdded: false});
                    }
                }
                else {
                    return res.json({ statusCode: 500, serverMessage: 'Behavior does not exist' });
                }
            }
            else {
                return res.json({ statusCode: 401, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

module.exports = router;