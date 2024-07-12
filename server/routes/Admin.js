require('dotenv').config();
const express = require('express');
const router = express.Router();
const abaQueries = require('../config/database/storedProcedures/ABAStoredProcedures');
const adminQueries = require('../config/database/storedProcedures/AdminStoredProcedures');
const employeeQueries = require('../config/database/storedProcedures/EmployeeStoredProcedures');
const behaviorPlanExpirationCountDown = require('../functions/behaviorPlanExpirationCountDown');
const currentDateTime = require('../functions/currentDateTime');
const dateTimeFormat = require('../functions/dateTimeFormat');
const generateSecurityToken = require('../functions/generateSecurityToken');
const generateUsername = require('../functions/generateUsername');
const emailHandler = require('../config/email/emailTemplate');
const cookieMonster = require('../config/cookies/cookieHandler');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { addYears } = require('date-fns');

//Add new employee
router.post('/addNewEmployee', async (req, res) => {
    try {
        const fName = req.body.fName;
        const lName = req.body.lName;
        let username = fName + "." + lName;
        const email = req.body.email;
        const pNumber = req.body.pNumber;
        const role = req.body.role;
        const employeeUsername = req.body.employeeUsername;

        if (await adminQueries.adminExistbyUsername(employeeUsername.toLowerCase())) {
            const employeeData = await adminQueries.adminDatabyUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "admin") {
                
                if (await adminQueries.adminExistbyUsername(username.toLowerCase())) {
                    username = await generateUsername(fName, lName, role);
                }

                if (await adminQueries.adminAddNewEmployee(fName, lName, username.toLowerCase(), email, pNumber, role, employeeUsername, await currentDateTime.getCurrentDate(), await currentDateTime.getCurrentTime() + " EST")) {

                    //Need to send the verification email to the new employee and return 201 code if email is successfully sent...
                    return res.json({ statusCode: 201, serverMessage: 'New Admin Added' });
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