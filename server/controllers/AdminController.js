const adminQueries = require('../middleware/helpers/AdminQueries');
const currentDateTime = require('../functions/base/currentDateTime');
const { formatDateString } = require('../functions/base/dateTimeFormat');
const generateUsername = require('../functions/users/generateUsername');
const { verifyAdminAuthorization } = require('../middleware/helpers/authorizationHelper');

class AdminController {
    /**
     * Add a new employee
     */
    async addNewEmployee(req, res) {
        try {
            const employeeData = await verifyAdminAuthorization(req, res);
            if (!employeeData) return;

            const fName = req.body.fName;
            const lName = req.body.lName;
            let username = fName + "." + lName;
            const email = req.body.email;
            const pNumber = req.body.pNumber;
            const role = req.body.role;
                
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
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
        } catch (error) {
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
        }
    }

    /**
     * Delete an employee
     */
    async deleteAnEmployee(req, res) {
        try {
            const employeeData = await verifyAdminAuthorization(req, res);
            if (!employeeData) return;

            const eID = req.body.employeeID;

            if (await adminQueries.adminDeleteAnEmployeeByID(eID)) {
                return res.json({ statusCode: 201, serverMessage: 'Account has been updated' });
            }
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
        } catch (error) {
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
        }
    }

    /**
     * Update employee details
     */
    async updateAnEmployeeDetail(req, res) {
        try {
            const employeeData = await verifyAdminAuthorization(req, res);
            if (!employeeData) return;

            const eID = req.body.employeeID;
            const fName = req.body.fName;
            const lName = req.body.lName;
            const email = req.body.email;
            const pNumber = req.body.pNumber;
            const role = req.body.role;

            if (await adminQueries.adminUpdateEmployeeAccountByID(fName, lName, email, pNumber, role, eID)) {
                return res.json({ statusCode: 201, serverMessage: 'Account has been updated' });
            }
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
        } catch (error) {
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
        }
    }

    /**
     * Update employee account status
     */
    async updateAnEmployeeAccountStatus(req, res) {
        try {
            const employeeData = await verifyAdminAuthorization(req, res);
            if (!employeeData) return;

            const eID = req.body.employeeID;
            const accountStatus = req.body.accountStatus;

            if (await adminQueries.adminUpdateEmployeeAccountByID(accountStatus, eID)) {
                return res.json({ statusCode: 201, serverMessage: 'Account has been updated' });
            }
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
        } catch (error) {
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
        }
    }

    /**
     * Add a new home
     */
    async addNewHome(req, res) {
        try {
            const employeeData = await verifyAdminAuthorization(req, res);
            if (!employeeData) return;

            const name = req.body.name;
            const streetAddress = req.body.streetAddress;
            const city = req.body.city;
            const state = req.body.state;
            const zipCode = req.body.zipCode;

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
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
        } catch (error) {
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
        }
    }

    /**
     * Delete a home
     */
    async deleteAHome(req, res) {
        try {
            const employeeData = await verifyAdminAuthorization(req, res);
            if (!employeeData) return;

            const hID = req.body.homeID;

            if (await adminQueries.adminDeleteAHomeByID(hID)) {
                return res.json({ statusCode: 201, serverMessage: 'Home has been deleted' });
            }
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
        } catch (error) {
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
        }
    }

    /**
     * Update a home
     */
    async updateAHome(req, res) {
        try {
            const employeeData = await verifyAdminAuthorization(req, res);
            if (!employeeData) return;

            const hID = req.body.homeID;
            const name = req.body.name;
            const streetAddress = req.body.streetAddress;
            const city = req.body.city;
            const state = req.body.state;
            const zipCode = req.body.zipCode;

            if (await adminQueries.adminUpdateHomeByID(name, streetAddress, city, state, zipCode, hID)) {
                return res.json({ statusCode: 201, serverMessage: 'Home has been updated' });
            }
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred' });
        } catch (error) {
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
        }
    }
}

module.exports = new AdminController();
