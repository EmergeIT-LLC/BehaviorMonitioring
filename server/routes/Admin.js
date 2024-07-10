require('dotenv').config();
const express = require('express');
const router = express.Router();
const abaQueries = require('../config/database/storedProcedures/ABAStoredProcedures');
const adminQueries = require('../config/database/storedProcedures/AdminStoredProcedures');
const employeeQueries = require('../config/database/storedProcedures/EmployeeStoredProcedures');
const behaviorPlanExpirationCountDown = require('../functions/behaviorPlanExpirationCountDown');
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
        const username = fName + "." + lName;
        const email = req.body.email;
        const pNumber = req.body.pNumber;
        const role = req.body.role;
        const employeeUsername = req.body.username;

        //

    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

module.exports = router;