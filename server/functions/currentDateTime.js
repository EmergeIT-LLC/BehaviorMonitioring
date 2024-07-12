const options = { timeZone: 'America/New_York' };

async function getCurrentDate() {
    return new Promise((resolve, reject) => {
        try {
            const currentDate = new Date();
            resolve(currentDate.toLocaleDateString('en-US', options));
        } catch (error) {
            reject(error);
        }
    });
}

async function getCurrentTime() {
    return new Promise((resolve, reject) => {
        try {
            const currentDate = new Date();
            resolve(currentDate.toLocaleTimeString('en-US', options));        
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    getCurrentDate,
    getCurrentTime
}