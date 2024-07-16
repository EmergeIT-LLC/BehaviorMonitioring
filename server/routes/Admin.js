require('dotenv').config();
const express = require('express');
const router = express.Router();
const abaQueries = require('../config/database/storedProcedures/ABAStoredProcedures');
const adminQueries = require('../config/database/storedProcedures/AdminStoredProcedures');
const employeeQueries = require('../config/database/storedProcedures/EmployeeStoredProcedures');
const behaviorPlanExpirationCountDown = require('../functions/basic/behaviorPlanExpirationCountDown');
const currentDateTime = require('../functions/basic/currentDateTime');
const dateTimeFormat = require('../functions/basic/dateTimeFormat');
const generateSecurityToken = require('../functions/basic/generateSecurityToken');
const generateUsername = require('../functions/basic/generateUsername');
const emailHandler = require('../config/email/emailTemplate');
const cookieMonster = require('../config/cookies/cookieHandler');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

/*-----------------------------------------------Employee-----------------------------------------------*/
router.post('/addNewEmployee', async (req, res) => {
    try {
        const fName = req.body.fName;
        const lName = req.body.lName;
        let username = fName + "." + lName;
        const email = req.body.email;
        const pNumber = req.body.pNumber;
        const role = req.body.role;
        const employeeUsername = req.body.employeeUsername;

        if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "admin") {
                
                if (await adminQueries.adminExistByUsername(username.toLowerCase())) {
                    username = await generateUsername(fName, lName, role);
                }

                if (await adminQueries.adminAddNewEmployee(fName, lName, username.toLowerCase(), email, pNumber, role, employeeUsername, await currentDateTime.getCurrentDate(), await currentDateTime.getCurrentTime() + " EST")) {

                    //Need to send the verification email to the new employee and return 201 code if email is successfully sent...
                    return res.json({ statusCode: 201, serverMessage: 'New ' + role.toLowerCase() + ' added' });
                }
                else {
                    return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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

router.post('/deleteAnEmployee', async (req, res) => {
    try {
        const eID = req.body.employeeID;
        const employeeUsername = req.body.employeeUsername;

        if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "admin") {
                if (await adminQueries.adminDeleteAnEmployeeByID(eID)) {
                    return res.json({ statusCode: 201, serverMessage: 'Account has been updated' });
                }
                else {
                    return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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

router.post('/updateAnEmployeeDetail', async (req, res) => {
    try {
        const eID = req.body.employeeID;
        const fName = req.body.fName;
        const lName = req.body.lName;
        const email = req.body.email;
        const pNumber = req.body.pNumber;
        const role = req.body.role;
        const employeeUsername = req.body.employeeUsername;

        if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "admin") {
                if (await adminQueries.adminUpdateEmployeeAccountByID(fName, lName, email, pNumber, role, eID)) {
                    return res.json({ statusCode: 201, serverMessage: 'Account has been updated' });
                }
                else {
                    return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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

router.post('/updateAnEmployeeAccountStatus', async (req, res) => {
    try {
        const eID = req.body.employeeID;
        const accountStatus = req.body.accountStatus
        const employeeUsername = req.body.employeeUsername;

        if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "admin") {
                if (await adminQueries.adminUpdateEmployeeAccountByID(accountStatus, eID)) {
                    return res.json({ statusCode: 201, serverMessage: 'Account has been updated' });
                }
                else {
                    return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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

/*-----------------------------------------------Home-----------------------------------------------*/
router.post('/addNewHome', async (req, res) => {
    try {
        const name = req.body.name;
        const streetAddress = req.body.streetAddress;
        const city = req.body.city;
        const zipCode = req.body.zipCode;
        const employeeUsername = req.body.employeeUsername;

        if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "admin") {
                if (await adminQueries.adminAddNewHome(name, streetAddress, city, state, zipCode, employeeUsername, await currentDateTime.getCurrentDate(), await currentDateTime.getCurrentTime() + " EST")) {
                    return res.json({ statusCode: 201, serverMessage: 'New home added' });
                }
                else {
                    return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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

router.post('/deleteAHome', async (req, res) => {
    try {
        const hID = req.body.homeID;
        const employeeUsername = req.body.employeeUsername;

        if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "admin") {
                if (await adminQueries.adminDeleteAHomeByID(hID)) {
                    return res.json({ statusCode: 201, serverMessage: 'Home has been deleted' });
                }
                else {
                    return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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

router.post('/updateAHome', async (req, res) => {
    try {
        const hID = req.body.homeID;
        const name = req.body.name;
        const streetAddress = req.body.streetAddress;
        const city = req.body.city;
        const zipCode = req.body.zipCode;
        const employeeUsername = req.body.employeeUsername;
    
        if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "admin") {
                if (await adminQueries.adminUpdateHomeByID(name, streetAddress, city, state, zipCode, hID)) {
                    return res.json({ statusCode: 201, serverMessage: 'Home has been updated' });
                }
                else {
                    return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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