const adminQueries = require('../middleware/helpers/AdminQueries');
const currentDateTime = require('../functions/base/currentDateTime');
const { formatDateString } = require('../functions/base/dateTimeFormat');
const generateUsername = require('../functions/users/generateUsername');

class AdminController {
    /**
     * Add a new employee
     */
    async addNewEmployee(req, res) {
        try {
            const fName = req.body.fName;
            const lName = req.body.lName;
            let username = fName + "." + lName;
            const email = req.body.email;
            const pNumber = req.body.pNumber;
            const role = req.body.role;
            const employeeUsername = req.body.employeeUsername;

            if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
                const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

                if (employeeData.role === "root" || employeeData.role === "admin") {
                    
                    if (await adminQueries.adminExistByUsername(username.toLowerCase())) {
                        username = await generateUsername(fName, lName, role);
                    }

                    if (await adminQueries.adminAddNewEmployee(
                        fName, 
                        lName, 
                        username.toLowerCase(), 
                        email, 
                        pNumber, 
                        role, 
                        employeeData.fName + " " + employeeData.lName, 
                        await formatDateString(await currentDateTime.getCurrentDate()), 
                        await currentDateTime.getCurrentTime() + " EST"
                    )) {
                        return res.json({ statusCode: 201, serverMessage: 'New ' + role.toLowerCase() + ' added' });
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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
    }

    /**
     * Delete an employee
     */
    async deleteAnEmployee(req, res) {
        try {
            const eID = req.body.employeeID;
            const employeeUsername = req.body.employeeUsername;

            if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
                const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

                if (employeeData.role === "root" || employeeData.role === "admin") {
                    if (await adminQueries.adminDeleteAnEmployeeByID(eID)) {
                        return res.json({ statusCode: 201, serverMessage: 'Account has been updated' });
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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
    }

    /**
     * Update employee details
     */
    async updateAnEmployeeDetail(req, res) {
        try {
            const eID = req.body.employeeID;
            const fName = req.body.fName;
            const lName = req.body.lName;
            const email = req.body.email;
            const pNumber = req.body.pNumber;
            const role = req.body.role;
            const employeeUsername = req.body.employeeUsername;

            if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
                const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

                if (employeeData.role === "root" || employeeData.role === "admin") {
                    if (await adminQueries.adminUpdateEmployeeAccountByID(fName, lName, email, pNumber, role, eID)) {
                        return res.json({ statusCode: 201, serverMessage: 'Account has been updated' });
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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
    }

    /**
     * Update employee account status
     */
    async updateAnEmployeeAccountStatus(req, res) {
        try {
            const eID = req.body.employeeID;
            const accountStatus = req.body.accountStatus;
            const employeeUsername = req.body.employeeUsername;

            if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
                const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

                if (employeeData.role === "root" || employeeData.role === "admin") {
                    if (await adminQueries.adminUpdateEmployeeAccountByID(accountStatus, eID)) {
                        return res.json({ statusCode: 201, serverMessage: 'Account has been updated' });
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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
    }

    /**
     * Add a new home
     */
    async addNewHome(req, res) {
        try {
            const name = req.body.name;
            const streetAddress = req.body.streetAddress;
            const city = req.body.city;
            const state = req.body.state;
            const zipCode = req.body.zipCode;
            const employeeUsername = req.body.employeeUsername;

            if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
                const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

                if (employeeData.role === "root" || employeeData.role === "admin") {
                    if (await adminQueries.adminAddNewHome(
                        name, 
                        streetAddress, 
                        city, 
                        state, 
                        zipCode, 
                        employeeData.fName + " " + employeeData.lName, 
                        await formatDateString(await currentDateTime.getCurrentDate()), 
                        await currentDateTime.getCurrentTime() + " EST"
                    )) {
                        return res.json({ statusCode: 201, serverMessage: 'New home added' });
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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
    }

    /**
     * Delete a home
     */
    async deleteAHome(req, res) {
        try {
            const hID = req.body.homeID;
            const employeeUsername = req.body.employeeUsername;

            if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
                const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

                if (employeeData.role === "root" || employeeData.role === "admin") {
                    if (await adminQueries.adminDeleteAHomeByID(hID)) {
                        return res.json({ statusCode: 201, serverMessage: 'Home has been deleted' });
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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
    }

    /**
     * Update a home
     */
    async updateAHome(req, res) {
        try {
            const hID = req.body.homeID;
            const name = req.body.name;
            const streetAddress = req.body.streetAddress;
            const city = req.body.city;
            const state = req.body.state;
            const zipCode = req.body.zipCode;
            const employeeUsername = req.body.employeeUsername;
        
            if (await adminQueries.adminExistByUsername(employeeUsername.toLowerCase())) {
                const employeeData = await adminQueries.adminDataByUsername(employeeUsername.toLowerCase());

                if (employeeData.role === "root" || employeeData.role === "admin") {
                    if (await adminQueries.adminUpdateHomeByID(name, streetAddress, city, state, zipCode, hID)) {
                        return res.json({ statusCode: 201, serverMessage: 'Home has been updated' });
                    }
                    else {
                        return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
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
    }
}

module.exports = new AdminController();
