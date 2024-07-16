require('dotenv').config();
const express = require('express');
const router = express.Router();
//Import Queries
const employeeQueries = require('../config/database/storedProcedures/EmployeeStoredProcedures');
const behaviorPlanExpirationCountDown = require('../functions/basic/behaviorPlanExpirationCountDown');
const dateTimeFormat = require('../functions/basic/dateTimeFormat');
const generateSecurityToken = require('../functions/basic/generateSecurityToken');
const generateUsername = require('../functions/basic/generateUsername');
const emailHandler = require('../config/email/emailTemplate');
const cookieMonster = require('../config/cookies/cookieHandler');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { addYears } = require('date-fns');

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
                    if (await employeeQueries.employeeUpdateEmployeeAccountStatusByUsername("Active", uName))
                    return res.json({ statusCode: 200, accountVerified: true });
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
                    return res.json({ statusCode: 403, serverMessage: 'Password is incorrect' });
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

/*-------------------------------------------------ABA--------------------------------------------------*/

module.exports = router;