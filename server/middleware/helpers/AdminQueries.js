const { Employee, Home } = require('../../models');

/*-----------------------------------------------Employee-----------------------------------------------*/
async function adminExistByUsername(uName) {
    try {
        const employee = await Employee.findOne({
            where: { username: uName }
        });
        return employee !== null;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminExistByID(uID) {
    try {
        const employee = await Employee.findOne({
            where: { employeeID: uID }
        });
        return employee !== null;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminDataByUsername(uName) {
    try {
        const employee = await Employee.findOne({
            where: { username: uName },
            attributes: ['employeeID', 'fName', 'lName', 'username', 'email', 'phone_number', 'role', 'account_status', 'entered_by', 'date_entered', 'time_entered']
        });
        return employee ? employee.get({ plain: true }) : null;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminDataById(uID) {
    try {
        const employee = await Employee.findOne({
            where: { employeeID: uID },
            attributes: ['employeeID', 'fName', 'lName', 'username', 'email', 'phone_number', 'role', 'account_status', 'entered_by', 'date_entered', 'time_entered']
        });
        return employee ? employee.get({ plain: true }) : null;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminAddNewEmployee(fName, lName, username, email, phone_number, role, account_status, enteredBy, compID, compName, dateEntered, timeEntered) {
    try {
        await Employee.create({
            fName, 
            lName, 
            username, 
            email, 
            phone_number, 
            role, 
            account_status,
            entered_by: enteredBy, 
            companyID: compID, 
            companyName: compName, 
            date_entered: dateEntered, 
            time_entered: timeEntered
        });
        return true;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminDeleteAnEmployeeByID(eID, compID) {
    try {
        const rowsDeleted = await Employee.destroy({
            where: { employeeID: eID, companyID }
        });
        return rowsDeleted > 0;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminDeleteAnEmployeeByUsername(uName, compID) {
    try {
        const rowsDeleted = await Employee.destroy({
            where: { username: uName, companyID }
        });
        return rowsDeleted > 0;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminUpdateEmployeeAccountStatusByUsername(accountStatus, uName, compID) {
    try {
        const [rowsUpdated] = await Employee.update(
            { account_status: accountStatus },
            { where: { username: uName, companyID } }
        );
        return rowsUpdated > 0;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminUpdateEmployeeAccountStatusByID(accountStatus, eID, compID) {
    try {
        const [rowsUpdated] = await Employee.update(
            { account_status: accountStatus },
            { where: { employeeID: eID, companyID } }
        );
        return rowsUpdated > 0;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminUpdateEmployeeAccountByUsername(fName, lName, email, phone_number, role, uName, compID) {
    try {
        const [rowsUpdated] = await Employee.update(
            { fName, lName, email, phone_number, role },
            { where: { username: uName, companyID } }
        );
        return rowsUpdated > 0;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminUpdateEmployeeAccountByID(fName, lName, email, phone_number, role, eID, compID) {
    try {
        const [rowsUpdated] = await Employee.update(
            { fName, lName, email, phone_number, role },
            { where: { employeeID: eID, companyID } }
        );
        return rowsUpdated > 0;
    } catch (err) {
        throw { message: err.message };
    }
}

/*-----------------------------------------------Home-----------------------------------------------*/
async function homeExistByName(name, compID) {
    try {
        const home = await Home.findOne({
            where: { name, companyID: compID }
        });
        return home !== null;
    } catch (err) {
        throw { message: err.message };
    }
}

async function homeExistByID(hID, compID) {
    try {
        const home = await Home.findOne({
            where: { homeID: hID, companyID: compID }
        });
        return home !== null;
    } catch (err) {
        throw { message: err.message };
    }
}

async function homeDataByName(name, compID) {
    try {
        const home = await Home.findOne({
            where: { name, companyID: compID },
            attributes: ['homeID', 'name', 'street_address', 'city', 'state', 'zip_code', 'entered_by', 'companyID', 'companyName', 'date_entered', 'time_entered']
        });
        return home ? home.get({ plain: true }) : null;
    } catch (err) {
        throw { message: err.message };
    }
}

async function homeDataById(hID, compID) {
    try {
        const home = await Home.findOne({
            where: { homeID: hID, companyID: compID },
            attributes: ['homeID', 'name', 'street_address', 'city', 'state', 'zip_code', 'entered_by', 'date_entered', 'companyID', 'companyName', 'time_entered']
        });
        return home ? home.get({ plain: true }) : null;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminAddNewHome(name, streetAddress, city, state, zipCode, enteredBy, compID, compName, dateEntered, timeEntered) {
    try {
        await Home.create({
            name, 
            street_address: streetAddress, 
            city, 
            state, 
            zip_code: zipCode, 
            entered_by: enteredBy, 
            companyID: compID, 
            companyName: compName, 
            date_entered: dateEntered, 
            time_entered: timeEntered
        });
        return true;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminDeleteAHomeByID(hID, compID) {
    try {
        const rowsDeleted = await Home.destroy({
            where: { homeID: hID, companyID: compID }
        });
        return rowsDeleted > 0;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminDeleteAHomeByName(name, compID) {
    try {
        const rowsDeleted = await Home.destroy({
            where: { name, companyID: compID }
        });
        return rowsDeleted > 0;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminUpdateHomeByName(name, streetAddress, city, state, zipCode, currentName, compID) {
    try {
        const [rowsUpdated] = await Home.update(
            { name, street_address: streetAddress, city, state, zip_code: zipCode },
            { where: { name: currentName, companyID: compID } }
        );
        return rowsUpdated > 0;
    } catch (err) {
        throw { message: err.message };
    }
}

async function adminUpdateHomeByID(name, streetAddress, city, state, zipCode, hID, compID) {
    try {
        const [rowsUpdated] = await Home.update(
            { name, street_address: streetAddress, city, state, zip_code: zipCode },
            { where: { homeID: hID, companyID: compID } }
        );
        return rowsUpdated > 0;
    } catch (err) {
        throw { message: err.message };
    }
}

module.exports = {
    adminExistByUsername,
    adminExistByID,
    adminDataByUsername,
    adminDataById,
    adminAddNewEmployee,
    adminDeleteAnEmployeeByID,
    adminDeleteAnEmployeeByUsername,
    adminUpdateEmployeeAccountStatusByUsername,
    adminUpdateEmployeeAccountStatusByID,
    adminUpdateEmployeeAccountByUsername,
    adminUpdateEmployeeAccountByID,
    homeExistByName,
    homeExistByID,
    homeDataByName,
    homeDataById,
    adminAddNewHome,
    adminDeleteAHomeByID,
    adminDeleteAHomeByName,
    adminUpdateHomeByName,
    adminUpdateHomeByID
}