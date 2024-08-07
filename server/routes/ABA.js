require('dotenv').config();
const express = require('express');
const router = express.Router();
//Import Queries
const abaQueries = require('../config/database/storedProcedures/ABAStoredProcedures');
const employeeQueries = require('../config/database/storedProcedures/EmployeeStoredProcedures');
const emailHandler = require('../config/email/emailTemplate');
const currentDateTime = require('../functions/basic/currentDateTime');
const cookieMonster = require('../config/cookies/cookieHandler');
const { addDays, addYears } = require('date-fns');

/*-----------------------------------------------ABA-----------------------------------------------*/
router.post('/addNewClient', async (req, res) => {
    try {
        const cFName = req.body.clientFName;
        const cLName = req.body.clientLName;
        const DOB = req.body.dateOfBirth;
        const intakeDate = req.body.intakeDate;
        const ghName = req.body.ghName;
        const medicadeNum = req.body.medicadeNum;
        const behaviorProvided = req.body.behaviorProvided;
        let behaviorPlanDueDate = addDays(intakeDate, 90);
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (!behaviorProvided) {
                    if (await abaQueries.abaAddClientData(cFName, cLName, DOB, intakeDate, ghName, medicadeNum, behaviorPlanDueDate, employeeData.fName + " " + employeeData.lName, await currentDateTime.getCurrentDate(), await currentDateTime.getCurrentTime() + " EST")) {
                        return res.json({ statusCode: 200, clientAdded: true });
                    }
                    else {
                        return res.json({ statusCode: 500, clientAdded: false, serverMessage: 'Unable add a client' });
                    }
                }
                else {
                    behaviorPlanDueDate = addYears(intakeDate, 1);
                    if (await abaQueries.abaAddClientData(cFName, cLName, DOB, intakeDate, ghName, medicadeNum, behaviorPlanDueDate, employeeData.fName + " " + employeeData.lName, await currentDateTime.getCurrentDate(), await currentDateTime.getCurrentTime() + " EST")) {
                        return res.json({ statusCode: 200, clientAdded: true });
                    }
                    else {
                        return res.json({ statusCode: 500, clientAdded: false, serverMessage: 'Unable add a client' });
                    }
                }
            }
            else {
                return res.json({ statusCode: 401, clientAdded: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, clientAdded: false, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/getClientInfo', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID)) {
                    const clientData = await abaQueries.abaGetClientDataByID(cID);

                    if (clientData){
                        return res.json({ statusCode: 200, clientData: clientData });
                    }
                    else {
                        return res.json({ statusCode: 400, serverMessage: 'Client does not exist' });
                    }
                }
                else {
                    return res.json({ statusCode: 400, serverMessage: 'Client does not exist' });
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

router.post('/updateClientInfo', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const cFName = req.body.clientFName;
        const cLName = req.body.clientLName;
        const DOB = req.body.dateOfBirth;
        const intakeDate = req.body.intakeDate;
        const ghName = req.body.ghName;
        const medicadeNum = req.body.medicadeNum;
        let behaviorPlanDueDate = req.body.behaviorPlanDueDate;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (!behaviorProvided) {
                    if (await abaQueries.abaUpdateClientData(cFName, cLName, DOB, intakeDate, ghName, medicadeNum, behaviorPlanDueDate, cID)) {
                        return res.json({ statusCode: 200, clientAdded: true });
                    }
                    else {
                        return res.json({ statusCode: 500, clientAdded: false, serverMessage: 'Unable add a client' });
                    }
                }
            }
            else {
                return res.json({ statusCode: 401, clientAdded: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, clientAdded: false, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/deleteClientInfo', async (req, res) => {
    try {
        const cID = req.body.clientID;

        //Determine whether to terminate client or if all data related to client should be deleted...
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/getAllClientInfo', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {

                const clientData = await abaQueries.abaGetAllClientData();

                if (clientData){
                    return res.json({ statusCode: 200, clientData: clientData });
                }
                else {
                    return res.json({ statusCode: 400, serverMessage: 'Client does not exist' });
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

/*-----------------------------------------------ABA-----------------------------------------------*/
router.post('/addNewTargetBehavior', async (req, res) => {
    try {
        const name = req.body.name;
        const def = req.body.definition;
        const meas = req.body.measurment;
        const cat = req.body.category;
        const type = req.body.type;
        const cID = req.body.clientID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID)) {
                    const clientData = await abaQueries.abaGetClientDataByID(cID);

                    if (clientData){
                        if (await abaQueries.abaAddBehaviorOrSkill(name, def, meas, cat, type, cID, clientData.fName + " " + clientData.lName, employeeData.fName + " " + employeeData.lName, await currentDateTime.getCurrentDate(), await currentDateTime.getCurrentTime() + " EST")) {
                            return res.json({ statusCode: 200, clientAdded: true });
                        }
                        else {
                            return res.json({ statusCode: 500, clientAdded: false, serverMessage: 'Unable add a client' });
                        }
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'Unable to locate client data' });
                    }
                }
                else {
                    return res.json({ statusCode: 400, serverMessage: 'Client does not exist' });
                }
            }
            else {
                return res.json({ statusCode: 401, clientAdded: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, clientAdded: false, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/updateTargetBehavior', async (req, res) => {
    try {
        const bsID = req.body.bsID;
        const name = req.body.name;
        const def = req.body.definition;
        const cat = req.body.category;
        const type = req.body.type;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID)) {
                    const clientData = await abaQueries.abaGetClientDataByID(cID);

                    if (clientData){
                        if (await abaQueries.abaAddBehaviorOrSkill(name, def, meas, cat, type, cID, clientData.fName + " " + clientData.lName, employeeData.fName + " " + employeeData.lName, await currentDateTime.getCurrentDate(), await currentDateTime.getCurrentTime() + " EST")) {
                            return res.json({ statusCode: 200, clientAdded: true });
                        }
                        else {
                            return res.json({ statusCode: 500, clientAdded: false, serverMessage: 'Unable add a client' });
                        }
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'Unable to locate client data' });
                    }
                }
                else {
                    return res.json({ statusCode: 400, serverMessage: 'Client does not exist' });
                }
            }
            else {
                return res.json({ statusCode: 401, clientAdded: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, clientAdded: false, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/deleteTargetBehavior', async (req, res) => {
    try {
        const bsID = req.body.bsID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                //Determine whether to terminate target behavior or if all data related to client should be deleted...
            }
            else {
                return res.json({ statusCode: 401, clientAdded: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, clientAdded: false, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/getClientTargetBehavior', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID)) {
                    const behaviorSkillData = await abaQueries.abaGetBehaviorOrSkill(cID);

                    if (behaviorSkillData.length > 0){
                        return res.json({ statusCode: 200, behaviorSkillData: behaviorSkillData });
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'Unable to locate client data' });
                    }
                }
                else {
                    return res.json({ statusCode: 400, serverMessage: 'Client does not exist' });
                }
            }
            else {
                return res.json({ statusCode: 401, clientAdded: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, clientAdded: false, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});


module.exports = router;