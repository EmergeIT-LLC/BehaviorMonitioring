const crypto = require('crypto');
const prodStatus = process.env.IN_PROD;
const clientOrigin = process.env.ClientHost;
const amplifyOrigin = process.env.AmplifyHost;

const setCookie = async (res, name, options = {}) => {
    return new Promise((resolve, reject) => {
        if (!res || typeof res.cookie !== 'function') {
            reject(new TypeError('The first argument must be an Express response object'));
            return;
        }

        // Default options
        const defaultOptions = {
            daysToExpire: 1 / 3, // Default expiration time: 8 hours
            path: '/',
            domain: prodStatus === "true" ? [clientOrigin, amplifyOrigin] : clientOrigin,
            secure: prodStatus === "true",
            sameSite: 'Lax',
            httpOnly: true // Set the cookie as HTTP-only by default
        };

        // Merge default options with provided options
        const mergedOptions = { ...defaultOptions, ...options };

        const { daysToExpire, domain, ...cookieOptions } = mergedOptions;

        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
        cookieOptions.expires = expirationDate;

        const randomValue = crypto.randomBytes(6).toString('hex');

        if (Array.isArray(domain)) {
            domain.forEach((domainItem) => {
                res.cookie(name, randomValue, { ...cookieOptions, domain: domainItem });
            });
        } else {
            res.cookie(name, randomValue, cookieOptions);
        }

        resolve({ message: 'Cookie set successfully', name, value: randomValue, options: { ...cookieOptions, expirationTime: expirationDate } });
    });
};

const getCookie = (req, name) => {
    if (!req || !req.headers || typeof req.headers.cookie !== 'string') {
        return null;
    }

    const cookies = req.headers.cookie.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (decodeURIComponent(cookieName) === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
};

const updateCookieExpiration = async (req, res, name) => {
    try {
        const daysToExpire = 1 / 3; // Default expiration time: 8 hours

        const cookieValue = req.cookies[name];

        if (cookieValue !== undefined) {
            const cookieSettings = await setCookie(res, name, cookieValue, { daysToExpire });
            return cookieSettings; // Return the value received from setCookie
        }
        return null; // Return null if no cookie value is found
    } catch (error) {
        throw error; // Rethrow any errors that occur during the process
    }
};

const deleteCookie = async (res, name, options = {}) => {
    return new Promise((resolve, reject) => {
        if (!res || typeof res.cookie !== 'function') {
            reject(new TypeError('The first argument must be an Express response object'));
            return;
        }

        const defaultOptions = {
            path: '/',
            domain: prodStatus === "true" ? clientOrigin : undefined
        };

        const mergedOptions = { ...defaultOptions, ...options };

        const { domain, ...cookieOptions } = mergedOptions;

        if (Array.isArray(domain)) {
            domain.forEach((domainItem) => {
                res.cookie(name, '', { ...cookieOptions, domain: domainItem, expires: new Date(0) });
            });
        } else {
            res.cookie(name, '', { ...cookieOptions, expires: new Date(0) });
        }

        resolve({ message: 'Cookie deleted successfully', name, options: { ...cookieOptions, expirationTime: new Date(0) } });
    });
};

module.exports = {
    setCookie,
    getCookie,
    updateCookieExpiration,
    deleteCookie
};