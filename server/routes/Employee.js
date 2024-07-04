require('dotenv').config();
const express = require('express');
const router = express.Router();
//Import Queries
const behaviorPlanExpirationCountDown = require('../functions/behaviorPlanExpirationCountDown');
const dateTimeFormat = require('../functions/dateTimeFormat');
const generateSecurityToken = require('../functions/generateSecurityToken');
const generateUsername = require('../functions/generateUsername');
const emailHandler = require('../config/email/emailTemplate');
const cookieMonster = require('../config/cookies/cookieHandler');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { addYears } = require('date-fns');

module.exports = router;