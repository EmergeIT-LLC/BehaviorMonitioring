//Queries imported
const adminQueries = require('../../config/database/storedProcedures/AdminStoredProcedures');
const employeeQueries = require('../../config/database/storedProcedures/EmployeeStoredProcedures');

//Function to generate a username
async function GenerateUsername (fName, lName, role) {
    return new Promise(async (resolve, reject) => {
        try {
            const primaryUsernameBase = fName.toLowerCase() + "." + lName.toLowerCase();
            let secondaryUsernameBase = fName.toLowerCase().charAt(0) + lName.toLowerCase();
            let usernameBase = primaryUsernameBase;
            let generatedUsername = usernameBase;

            let suffix = 1;
            let attempts = 0;
            const maxAttempts = 10;

            while (await checkIfUsernameExists(generatedUsername, role)) {
                generatedUsername = usernameBase + (suffix++);
                attempts++;

                if (attempts >= maxAttempts && usernameBase === primaryUsernameBase) {
                    usernameBase = secondaryUsernameBase;
                    generatedUsername = usernameBase;
                    suffix = 1;
                }
            }
            resolve(generatedUsername.toLowerCase());
        } catch (error) {
            reject(error);
        }
    });
}

//Checking is username exists
async function checkIfUsernameExists(generatedUsername, role) {
    if (role.toLowerCase() === "admin" || role.toLowerCase() === "root"){
        return adminQueries.adminExistbyUsername(generatedUsername);
    } else if (role.toLowerCase() === "employee") {
        return employeeQueries.employeeExistbyUsername(generatedUsername);
    }
}

module.exports = GenerateUsername;