require('dotenv').config();
const sendGridAPI = process.env.SENDGRID_API_KEY;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendGridAPI);
const businessEmail = '';
const businessPOCEmail = 'jonathan.dameus@emerge-it.net';

module.exports = {
};