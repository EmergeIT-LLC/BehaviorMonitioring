require('dotenv').config();
const express = require('express');
const router = express.Router();
//Import Queries
const behaviorPlanExpirationCountDown = require('../functions/basic/behaviorPlanExpirationCountDown');
const dateTimeFormat = require('../functions/basic/dateTimeFormat');
const generateSecurityToken = require('../functions/basic/generateSecurityToken');
const generateUsername = require('../functions/basic/generateUsername');
const emailHandler = require('../config/email/emailTemplate');
const cookieMonster = require('../config/cookies/cookieHandler');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { addYears } = require('date-fns');

/*-----------------------------------------------ABA-----------------------------------------------*/
router.post('/addNewClient', async (req, res) => {
    try {
        const cName = req.body.clientName;
        const DOB = req.body.dateOfBirth;
        const intakeDate = req.body.intakeDate;
        const ghName = req.body.ghName;
        const medicadeNum = req.body.medicadeNum;
        const employeeUsername = req.body.employeeUsername;

        //Add year to intake date to get behavior plan date

        //Complete buildout
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

module.exports = router;