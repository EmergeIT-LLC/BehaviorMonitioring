require('dotenv').config();
const express = require('express');
const router = express.Router();
const logAuthEvent = require('../middleware/helpers/authLog');
const createJWTToken = require('../middleware/auth/createJWTToken');
const employeeQueries = require('../middleware/helpers/EmployeeQueries');
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
                    const token = createJWTToken(employeeData);
                    
                    if (employeeData.role === "root" || employeeData.role === "admin") {
                        await logAuthEvent("ADMIN_LOGIN_SUCCESS", { userId: employeeData.employeeID, email: employeeData.email, ip: req.ip, userAgent: req.headers['user-agent'] });
                        return res.json({ statusCode: 200, loginStatus: true, accessToken: token, user:{ uName: uName.toLowerCase(), compName: employeeData.companyName, compID: employeeData.companyID, isAdmin: true} });
                    }
                    else {
                        await logAuthEvent("EMPLOYEE_LOGIN_SUCCESS", { userId: employeeData.employeeID, email: employeeData.email, ip: req.ip, userAgent: req.headers['user-agent'] });
                        return res.json({ statusCode: 200, loginStatus: true, accessToken: token, user:{ uName: uName.toLowerCase(), compName: employeeData.compName, compID: employeeData.compID, isAdmin: false} });
                    }
                }
                else {
                    await logAuthEvent("EMPLOYEE_LOGIN_FAILED", { email: uName.toLowerCase(), ip: req.ip, userAgent: req.headers['user-agent'], details: 'Incorrect password' });
                    return res.json({ statusCode: 401, serverMessage: 'Password is incorrect' });
                }
            }
            else {
                //Need to send the verification email to the employee and return 401 code if email is successfully sent...
                await logAuthEvent("EMPLOYEE_LOGIN_FAILED", { email: uName.toLowerCase(), ip: req.ip, userAgent: req.headers['user-agent'], details: 'User needs to authenticate their account' });
                return res.json({ statusCode: 401, serverMessage: 'User needs to authenticate their account' });
            }
        }
        else {
            await logAuthEvent("EMPLOYEE_LOGIN_FAILED", { email: uName.toLowerCase(), ip: req.ip, userAgent: req.headers['user-agent'], details: 'Unauthorized user' });
            return res.json({ statusCode: 401, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        await logAuthEvent("EMPLOYEE_LOGIN_ERROR", { email: req.body.username.toLowerCase(), ip: req.ip, userAgent: req.headers['user-agent'], details: error.message });
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/verifyEmployeeLogout', async (req, res) => {
    try {
        const uName = req.body.username;

        await logAuthEvent("EMPLOYEE_LOGOUT", { email: uName.toLowerCase(), ip: req.ip, userAgent: req.headers['user-agent'] });
        return res.json({ statusCode: 200, loginStatus: false, isAdmin: false });
    } catch (error) {
        await logAuthEvent("EMPLOYEE_LOGOUT_ERROR", { email: req.body.username.toLowerCase(), ip: req.ip, userAgent: req.headers['user-agent'], details: error.message });
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});
module.exports = router;