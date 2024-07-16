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

/*--------------------------------------------Authentication---------------------------------------------*/

/*-----------------------------------------------Employee-----------------------------------------------*/

/*-------------------------------------------------ABA--------------------------------------------------*/

module.exports = router;