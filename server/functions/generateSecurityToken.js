async function generateRandomToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const length = 16;
            let token = '';
        
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                token += charset[randomIndex];
            }
        
            resolve(token);        
        }
        catch (error) {
            reject(error);
        }
    })
}

module.exports = generateRandomToken;