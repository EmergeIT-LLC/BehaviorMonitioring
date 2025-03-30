require('dotenv').config();
const express = require('express');
const router = express.Router();
//Import Queries
const abaQueries = require('../config/database/storedProcedures/ABAStoredProcedures');
const employeeQueries = require('../config/database/storedProcedures/EmployeeStoredProcedures');
const emailHandler = require('../config/email/emailTemplate');
const currentDateTime = require('../functions/basic/currentDateTime');
const cookieMonster = require('../config/cookies/cookieHandler');
const { addDays, addYears } = require('../functions/basic/addDayYear');
const { formatDateString, formatTimeString } = require('../functions/basic/dateTimeFormat');

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
        let behaviorPlanDueDate = await formatDateString(await addDays(intakeDate, 90));
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (!behaviorProvided) {
                    if (await abaQueries.abaAddClientData(cFName, cLName, DOB, intakeDate, ghName, medicadeNum, behaviorPlanDueDate, employeeData.fName + " " + employeeData.lName, await formatDateString(await currentDateTime.getCurrentDate()), await currentDateTime.getCurrentTime() + " EST")) {
                        return res.json({ statusCode: 200, clientAdded: true });
                    }
                    else {
                        return res.json({ statusCode: 500, clientAdded: false, serverMessage: 'Unable add a client' });
                    }
                }
                else {
                    behaviorPlanDueDate = await formatDateString(await addYears(intakeDate, 1));
                    if (await abaQueries.abaAddClientData(cFName, cLName, DOB, intakeDate, ghName, medicadeNum, behaviorPlanDueDate, employeeData.fName + " " + employeeData.lName, await formatDateString(await currentDateTime.getCurrentDate()), await currentDateTime.getCurrentTime() + " EST")) {
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
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    const clientData = await abaQueries.abaGetClientDataByID(cID, employeeData.companyID);

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
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {

                const clientData = await abaQueries.abaGetAllClientData();

                if (clientData){
                    return res.json({ statusCode: 200, clientData: clientData });
                }
                else {
                    return res.json({ statusCode: 400, serverMessage: 'Unable to locate client data' });
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
        const behaviors = req.body.behaviors;
        const employeeUsername = req.body.employeeUsername;
        const failedBehaviors = [];

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                for (let i = 0; i < behaviors.length; i++) {
                    const name = behaviors[i].behaviorName;
                    const def = behaviors[i].behaviorDefinition;
                    const meas = behaviors[i].behaviorMeasurement;
                    const cat = behaviors[i].behaviorCategory;
                    const type = behaviors[i].type;
                    const cID = behaviors[i].clientID;
                    const clientName = behaviors[i].clientName;

                    if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                        const clientData = await abaQueries.abaGetClientDataByID(cID, employeeData.companyID);

                        if (clientData){
                            if (!await abaQueries.abaAddBehaviorOrSkill(name, def, meas, cat, type, cID, clientData.fName + " " + clientData.lName, employeeData.fName + " " + employeeData.lName, employeeData.companyID, employeeData.companyName, await formatDateString(await currentDateTime.getCurrentDate()), await currentDateTime.getCurrentTime() + " EST")) {
                                failedBehaviors.push({ name, def, meas, cat, type, cID, clientName });
                            }
                        }
                        else {
                            return res.json({ statusCode: 500, behaviorsAdded: false, serverMessage: 'Unable to locate client data' });
                        }
                    }
                    else {
                        return res.json({ statusCode: 400, behaviorsAdded: false, serverMessage: 'Client does not exist' });
                    }
                }

                if (failedBehaviors.length > 0) {
                    return res.json({ statusCode: 500, behaviorsAdded: false, serverMessage: 'Some behaviors failed to add', failedBehaviors: failedBehaviors });
                }
                else {
                    return res.json({ statusCode: 204, behaviorsAdded: true, serverMessage: 'All behaviors added successfully' });
                }
            }
            else {
                return res.json({ statusCode: 401, behaviorsAdded: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, behaviorsAdded: false, serverMessage: 'Unauthorized user' });
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
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    const clientData = await abaQueries.abaGetClientDataByID(cID, employeeData.companyID);

                    if (clientData){
                        if (await abaQueries.abaAddBehaviorOrSkill(name, def, meas, cat, type, cID, clientData.fName + " " + clientData.lName, employeeData.fName + " " + employeeData.lName, employeeData.companyID, employeeData.companyName, await formatDateString(await currentDateTime.getCurrentDate()), await currentDateTime.getCurrentTime() + " EST")) {
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

router.post('/getTargetBehavior', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const bID = req.body.behaviorID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.behaviorSkillExistByID(bID, employeeData.companyID)) {
                    const behaviorSkillData = await abaQueries.abaGetBehaviorDataById(cID, bID, employeeData.companyID);

                    if (behaviorSkillData.length > 0){
                        return res.json({ statusCode: 200, behaviorSkillData: behaviorSkillData });
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'Unable to locate behavior data' });
                    }
                }
                else {
                    return res.json({ statusCode: 400, serverMessage: 'Behavior does not exist' });
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

router.post('/getClientTargetBehavior', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    const behaviorSkillData = await abaQueries.abaGetBehaviorOrSkill(cID, 'Behavior', employeeData.companyID);

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

router.post('/getAClientTargetBehavior', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const bsID = req.body.behaviorID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    const behaviorSkillData = await abaQueries.abaGetABehaviorOrSkill(cID, bsID, 'Behavior', employeeData.companyID);

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

router.post('/getArchivedBehavior', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const bID = req.body.behaviorID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.behaviorSkillExistByID(bID, employeeData.companyID)) {
                    const behaviorSkillData = await abaQueries.abaGetArchivedBehaviorDataById(cID, bID, employeeData.companyID);

                    if (behaviorSkillData.length > 0){
                        return res.json({ statusCode: 200, behaviorSkillData: behaviorSkillData });
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'Unable to locate behavior data' });
                    }
                }
                else {
                    return res.json({ statusCode: 400, serverMessage: 'Behavior does not exist' });
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

router.post('/getClientArchivedBehavior', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    const behaviorSkillData = await abaQueries.abaGetBehaviorOrSkill(cID, 'Behavior', employeeData.companyID);
                    const archivedBehaviorSkillData = await abaQueries.abaGetArchivedBehaviorOrSkill(cID, 'Behavior', employeeData.companyID);

                    if (archivedBehaviorSkillData.length > 0){
                        return res.json({ statusCode: 200, behaviorSkillData: archivedBehaviorSkillData });
                    }
                    else if (behaviorSkillData.length > 0){
                        return res.json({ statusCode: 200, behaviorSkillData: archivedBehaviorSkillData });
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

router.post('/getAClientArchivedBehavior', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const bsID = req.body.behaviorID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    const behaviorSkillData = await abaQueries.abaGetABehaviorOrSkill(cID, bsID, 'Behavior', employeeData.companyID);
                    const archivedBehaviorSkillData = await abaQueries.abaGetAArchivedBehaviorOrSkill(cID, bsID, 'Behavior', employeeData.companyID);

                    if (archivedBehaviorSkillData.length > 0){
                        return res.json({ statusCode: 200, behaviorSkillData: archivedBehaviorSkillData });
                    }
                    else if (behaviorSkillData.length > 0){
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

router.post('/getAArchivedBehaviorData', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const bID = req.body.behaviorID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.behaviorSkillExistByID(bID, employeeData.companyID)) {
                    const behaviorSkillData = await abaQueries.abaGetBehaviorDataById(cID, bID, employeeData.companyID);
                    const archivedBehaviorSkillData = await abaQueries.abaGetArchivedBehaviorDataById(cID, bID, employeeData.companyID);

                    if (archivedBehaviorSkillData.length > 0){
                        return res.json({ statusCode: 200, behaviorSkillData: archivedBehaviorSkillData });
                    }
                    else if (behaviorSkillData.length > 0){
                        return res.json({ statusCode: 200, behaviorSkillData: behaviorSkillData });
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'Unable to locate behavior data' });
                    }
                }
                else {
                    return res.json({ statusCode: 400, serverMessage: 'Behavior does not exist' });
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

router.post('/submitTargetBehavior', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const targetAmount = req.body.targetAmt;
        const selectedTargetIds = req.body.selectedTargets;
        const selectedMeasurementTypes = req.body.selectedMeasurementTypes;
        const datesTargetsOccured = req.body.dates;
        const timesTargetsOccured = req.body.times;
        const count = req.body.count;
        const duration = req.body.duration;
        const employeeUsername = req.body.employeeUsername;

        //For successful/failed adds
        let addedSuccessfully = true;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    const clientData = await abaQueries.abaGetClientDataByID(cID, employeeData.companyID);
    
                    for (let i = 0; i < targetAmount; i++) {
                        if (await abaQueries.behaviorSkillExistByID(selectedTargetIds[i], employeeData.companyID)) {

                            switch (selectedMeasurementTypes[i]) {
                                case "Frequency":
                                    if (!await abaQueries.abaAddFrequencyBehaviorData(selectedTargetIds[i], cID, clientData.fName + " " + clientData.lName, datesTargetsOccured[i], timesTargetsOccured[i], count[i], employeeData.fName + " " + employeeData.lName, employeeData.companyID, employeeData.companyName, await formatDateString(await currentDateTime.getCurrentDate()), await currentDateTime.getCurrentTime() + " EST")) {
                                        addedSuccessfully = false;
                                    }
                                    break;    
                                case "Duration":
                                    if (!await abaQueries.abaAddDurationBehaviorData(selectedTargetIds[i], cID, clientData.fName + " " + clientData.lName, datesTargetsOccured[i], timesTargetsOccured[i], duration[i], employeeData.fName + " " + employeeData.lName, employeeData.companyID, employeeData.companyName, await formatDateString(await currentDateTime.getCurrentDate()), await currentDateTime.getCurrentTime() + " EST")) {
                                        addedSuccessfully = false;
                                    }
                                    break;
                                case "Rate":
                                    if (!await abaQueries.abaAddRateBehaviorData(selectedTargetIds[i], cID, clientData.fName + " " + clientData.lName, datesTargetsOccured[i], timesTargetsOccured[i], count[i], duration[i], employeeData.fName + " " + employeeData.lName, employeeData.companyID, employeeData.companyName, await formatDateString(await currentDateTime.getCurrentDate()), await currentDateTime.getCurrentTime() + " EST")) {
                                        addedSuccessfully = false;
                                    }
                                    break; 
                            }
                            //If data failed to add
                            if (addedSuccessfully === false) {
                                return res.json({ statusCode: 400, behaviorAdded: false, serverMessage: 'Target behavior id, ' + selectedTargetIds[i] + ', does not exist', Data: {index: i, Date: datesTargetsOccured[i], time: timesTargetsOccured[i], count: count[i], duration: duration[i]} });
                            }
                        } //Skip if behavior does not exist...
                    }
                    //Return statement for when forloop finishes with no fail points
                    return res.json({ statusCode: 201, behaviorAdded: true, serverMessage: 'All behavior data added' });
                }
                else {
                    return res.json({ statusCode: 400, behaviorAdded: false, serverMessage: 'Client does not exist' });
                }
            }
            else {
                return res.json({ statusCode: 401, behaviorAdded: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, behaviorAdded: false, serverMessage: 'Unauthorized user' });
        }
    }
    catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/mergeBehaviors', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const targetBehaviorId = req.body.targetBehaviorId;
        const mergeBehaviorIds = req.body.mergeBehaviorIds;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());
            
            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    if (await abaQueries.behaviorSkillExistByID(targetBehaviorId, employeeData.companyID)) {
                        const targetBehaviorData = await abaQueries.abaGetBehaviorOrSkill(targetBehaviorId, "Behavior", employeeData.companyID);
    
                        for (let i = 0; i < mergeBehaviorIds.length; i++) {
                            let mergeBehaviorData = await abaQueries.abaGetBehaviorOrSkill(mergeBehaviorIds[i], "Behavior", employeeData.companyID); 
    
                            if (mergeBehaviorData.measurment === targetBehaviorData.measurment) {
                                const dataExists = await abaQueries.abaGetBehaviorDataById(cID, mergeBehaviorIds[i], employeeData.companyID);

                                if (dataExists.length > 0) {
                                    if (!await abaQueries.abaMergeBehaviorDataById(cID, targetBehaviorId, mergeBehaviorIds[i], employeeData.companyID)) {
                                        throw new Error("An error occured while merging " + mergeBehaviorData.name);
                                    }
                                    else {
                                        if (!await abaQueries.abaDeleteBehaviorOrSkillByID(cID, mergeBehaviorIds[i], employeeData.companyID)) {
                                            throw new Error("An error occured while deleting " + mergeBehaviorData.name);
                                        }
                                    }
                                }
                                else {
                                    if (!await abaQueries.abaDeleteBehaviorOrSkillByID(cID, mergeBehaviorIds[i], employeeData.companyID)) {
                                        throw new Error("An error occured while deleting " + mergeBehaviorData.name);
                                    }
                                }
                            }
                        }
                    //Behaviors merged successfully
                    return res.json({ statusCode: 200, behaviorMerged: true, serverMessage: 'All behavior data merged successfully' });       
                    }

                }
                else {
                    return res.json({ statusCode: 400, behaviorMerged: false, serverMessage: 'Client does not exist' });
                }
            }
            else {
                return res.json({ statusCode: 401, behaviorMerged: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, behaviorMerged: false, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, behaviorMerged: false, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/archiveBehavior', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const behaviorId = req.body.behaviorId;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());
            
            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    if (await abaQueries.behaviorSkillExistByID(behaviorId, employeeData.companyID)) {
                        const behaviorData = await abaQueries.abaGetBehaviorOrSkill(behaviorId, "Behavior", employeeData.companyID);
                        const archiveDeletionDate = await formatDateString(await addYears(await formatDateString(await currentDateTime.getCurrentDate()), 7));
    
                        if (await abaQueries.abaFoundBehaviorDataById(cID, behaviorId, employeeData.companyID)) {
                            if (!await abaQueries.abaArchiveBehaviorDataByID('Archived', cID, behaviorId, employeeData.companyID)) {
                                throw new Error("An error occured while archiving " + behaviorData.name + "'s data");
                            }
                            else {
                                if (!await abaQueries.abaArchiveBehaviorOrSkillByID(cID, behaviorId, await formatDateString(await currentDateTime.getCurrentDate()), archiveDeletionDate, employeeData.companyID)) {
                                    throw new Error("An error occured while archiving " + behaviorData.name);
                                }
                            }
                        }
                        else {
                            if (!await abaQueries.abaArchiveBehaviorOrSkillByID(cID, behaviorId, await formatDateString(await currentDateTime.getCurrentDate()), archiveDeletionDate, employeeData.companyID)) {
                                throw new Error("An error occured while archiving " + behaviorData.name);
                            }
                        }
                    //Behaviors merged successfully
                    return res.json({ statusCode: 200, behaviorMerged: true, serverMessage: 'All behavior data archived successfully' });       
                    }

                }
                else {
                    return res.json({ statusCode: 400, behaviorMerged: false, serverMessage: 'Client does not exist' });
                }
            }
            else {
                return res.json({ statusCode: 401, behaviorMerged: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, behaviorMerged: false, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/deleteBehavior', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const behaviorId = req.body.behaviorId;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());
            
            if (employeeData.role === "root" || employeeData.role === "Admin") {
                let behaviorData = await abaQueries.abaGetBehaviorOrSkill(behaviorId, "Behavior", employeeData.companyID); 

                if (await abaQueries.abaFoundBehaviorDataById(cID, behaviorId)) {
                    if (!await abaQueries.abaDeleteBehaviorDataByID(cID, behaviorId, employeeData.companyID)) {
                        throw new Error("An error occured while deleting " + behaviorData.name + "'s data");
                    }
                    else {
                        if (!await abaQueries.abaDeleteBehaviorOrSkillByID(cID, behaviorId, employeeData.companyID)) {
                            throw new Error("An error occured while deleting " + behaviorData.name);
                        }
                    }
                }
                else {
                    if (!await abaQueries.abaDeleteBehaviorOrSkillByID(cID, behaviorId, employeeData.companyID)) {
                        throw new Error("An error occured while deleting " + behaviorData.name);
                    }
                }
            //Behaviors deleted successfully
            return res.json({ statusCode: 200, behaviorAdded: true, serverMessage: 'All behavior data deleted successfully' });       
            }
            else {
                return res.json({ statusCode: 401, behaviorAdded: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, behaviorAdded: false, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/deleteBehaviorData', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const behaviorId = req.body.behaviorId;
        const behaviorDataId = req.body.behaviorDataId;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());
            
            if (employeeData.role === "root" || employeeData.role === "Admin") {
                let behaviorData = await abaQueries.abaGetBehaviorOrSkill(behaviorId, "Behavior", employeeData.companyID);

                if (await abaQueries.abaGetBehaviorDataByBehaviorId(cID, behaviorId, behaviorDataId, employeeData.companyID)) {
                    if (!await abaQueries.abaDeleteBehaviorDataByBehaviorID(cID, behaviorId, behaviorDataId, employeeData.companyID)) {
                        throw new Error("An error occured while deleting " + behaviorData.name + "'s data");
                    }
                    else {
                        //Behaviors deleted successfully
                        return res.json({ statusCode: 200, serverMessage: 'Behavior data deleted successfully' });
                    }     
                }
                else {
                    throw new Error('Unable to locate selected behavior data');
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

router.post('/activateBehavior', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const behaviorId = req.body.behaviorId;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());
            
            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    if (await abaQueries.behaviorSkillExistByID(behaviorId, employeeData.companyID)) {
                        const behaviorData = await abaQueries.abaGetArchivedBehaviorOrSkill(behaviorId, "Behavior", employeeData.companyID);
    
                        if (await abaQueries.abaGetArchivedBehaviorDataById(cID, behaviorId) > 0) {
                            if (!await abaQueries.abaReactivateBehaviorDataByID('Active', cID, behaviorId, null, null)) {
                                throw new Error("An error occured while reactivating " + behaviorData.name + "'s data");
                            }
                            else {
                                if (!await abaQueries.abaReactivateBehaviorOrSkillByID(cID, behaviorId, null, null, employeeData.companyID)) {
                                    throw new Error("An error occured while reactivating " + behaviorData.name);
                                }
                            }
                        }
                        else {
                            if (!await abaQueries.abaReactivateBehaviorOrSkillByID(cID, behaviorId, null, null, employeeData.companyID)) {
                                throw new Error("An error occured while archiving " + behaviorData.name);
                            }
                        }
                    //Behaviors reactivated successfully
                    return res.json({ statusCode: 200, behaviorMerged: true, serverMessage: 'The behavior data reactivated successfully' });       
                    }

                }
                else {
                    return res.json({ statusCode: 400, behaviorMerged: false, serverMessage: 'Client does not exist' });
                }
            }
            else {
                return res.json({ statusCode: 401, behaviorMerged: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, behaviorMerged: false, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/deleteArchivedBehavior', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const behaviorId = req.body.behaviorId;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());
            
            if (employeeData.role === "root" || employeeData.role === "Admin") {
                let behaviorData = await abaQueries.abaGetBehaviorOrSkill(behaviorId, "Behavior", employeeData.companyID); 

                if (await abaQueries.abaFoundBehaviorDataById(cID, behaviorId, employeeData.companyID)) {
                    if (!await abaQueries.abaDeleteBehaviorDataByID(cID, behaviorId, employeeData.companyID)) {
                        throw new Error("An error occured while deleting " + behaviorData.name + "'s data");
                    }
                    else {
                        if (!await abaQueries.abaDeleteBehaviorOrSkillByID(cID, behaviorId, employeeData.companyID)) {
                            throw new Error("An error occured while deleting " + behaviorData.name);
                        }
                    }
                }
                else {
                    if (!await abaQueries.abaDeleteBehaviorOrSkillByID(cID, behaviorId, employeeData.companyID)) {
                        throw new Error("An error occured while deleting " + behaviorData.name);
                    }
                }
            //Behaviors deleted successfully
            return res.json({ statusCode: 200, behaviorAdded: true, serverMessage: 'All behavior data merged successfully' });       
            }
            else {
                return res.json({ statusCode: 401, behaviorAdded: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, behaviorAdded: false, serverMessage: 'Unauthorized user' });
        }
    } catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/deleteArchivedBehaviorData', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const behaviorId = req.body.behaviorId;
        const behaviorDataId = req.body.behaviorDataId;
        const employeeUsername = req.body.employeeUsername;


        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());
            
            if (employeeData.role === "root" || employeeData.role === "Admin") {
                let behaviorData = await abaQueries.abaGetBehaviorOrSkill(behaviorId, "Behavior", employeeData.companyID);

                if (await abaQueries.abaGetArchivedBehaviorDataByBehaviorId(cID, behaviorId, behaviorDataId, employeeData.companyID)) {
                    if (!await abaQueries.abaDeleteArchivedBehaviorDataByBehaviorID(cID, behaviorId, behaviorDataId, employeeData.companyID)) {
                        throw new Error("An error occured while deleting " + behaviorData.name + "'s data");
                    }
                    else {
                        //Behaviors deleted successfully
                        return res.json({ statusCode: 200, serverMessage: 'Behavior data deleted successfully' });
                    }     
                }
                else {
                    throw new Error('Unable to locate selected behavior data');
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

router.post('/submitSessionNotes', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const sessionDate = req.body.sessionDate;
        const sessionTime = req.body.sessionTime;
        const sessionNotes = req.body.sessionNotes;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    const clientData = await abaQueries.abaGetClientDataByID(cID, employeeData.companyID);

                    //Store notes into notes table
                    if (await abaQueries.abaAddSessionNoteData(cID, clientData.fName + " " + clientData.lName, await formatDateString(sessionDate), await formatTimeString(sessionTime), sessionNotes, employeeData.fName + " " + employeeData.lName, employeeData.companyID, employeeData.companyName, await formatDateString(await currentDateTime.getCurrentDate()), await currentDateTime.getCurrentTime() + " EST")) {
                        return res.json({ statusCode: 201, behaviorAdded: true, serverMessage: 'All submission notes stored' });
                    }
                    else {
                        return res.json({ statusCode: 400, behaviorAdded: false, serverMessage: 'Unable to store notes' });
                    }
    
                }
                else {
                    return res.json({ statusCode: 400, behaviorAdded: false, serverMessage: 'Client does not exist' });
                }
            }
            else {
                return res.json({ statusCode: 401, behaviorAdded: false, serverMessage: 'Unauthorized user' });
            }
        }
        else {
            return res.json({ statusCode: 401, behaviorAdded: false, serverMessage: 'Unauthorized user' });
        }
    }
    catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/getSessionNotes', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    const sessionNotesData = await abaQueries.abaGetSessionNotes(cID, employeeData.companyID);

                    if (sessionNotesData.length > 0){
                        return res.json({ statusCode: 200, sessionNotesData: sessionNotesData });
                    }
                    else {
                        return res.json({ statusCode: 400, serverMessage: 'Unable to locate client data' });
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
    }
    catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/getASessionNote', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const sessionNoteId = req.body.sessionNoteId;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());
            
            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID)) {
                    const sessionNoteData = await abaQueries.abaGetSessionNoteById(cID, sessionNoteId, employeeData.companyID);
                    
                    if (sessionNoteData.length > 0){
                        return res.json({ statusCode: 200, sessionNoteData: sessionNoteData });
                    }
                    else {
                        return res.json({ statusCode: 400, serverMessage: 'Unable to locate client data' });
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
    }
    catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});

router.post('/getClientSkillAquisition', async (req, res) => {
    try {
        const cID = req.body.clientID;
        const employeeUsername = req.body.employeeUsername;

        if (await employeeQueries.employeeExistByUsername(employeeUsername.toLowerCase())) {
            const employeeData = await employeeQueries.employeeDataByUsername(employeeUsername.toLowerCase());

            if (employeeData.role === "root" || employeeData.role === "Admin") {
                if (await abaQueries.abaClientExistByID(cID, employeeData.companyID, employeeData.companyName)) {
                    const behaviorSkillData = await abaQueries.abaGetBehaviorOrSkill(cID, 'Skill', employeeData.companyID);

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

router.post('/submitSkillAquisition', async (req, res) => {
    try {
        //
    }
    catch (error) {
        return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
    }
});
module.exports = router;