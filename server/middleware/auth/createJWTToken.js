const jwt = require('jsonwebtoken');
const prodStatus = process.env.IN_PROD === "true";

function createJWTToken(payload) {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
            issuer: prodStatus ? `${process.env.HOST}` : `${process.env.HOST}${process.env.PORT ? `:${process.env.PORT}` : ''}`,
            audience: process.env.ClientHost
        }
    );
}

module.exports = createJWTToken;