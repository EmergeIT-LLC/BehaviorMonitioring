const jwt = require("jsonwebtoken");
const prodStatus = process.env.IN_PROD === "true";

function createAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_TTL || "15m",
        issuer: prodStatus ? `${process.env.HOST}` : `${process.env.HOST}${process.env.PORT ? `:${process.env.PORT}` : ""}`,
        audience: process.env.ClientHost,
        permissions: [], // permissions can be added here if needed
    });
}

// refresh should be MINIMAL
function createRefreshToken(userId) {
    return jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_TTL_DAYS ? `${process.env.REFRESH_TOKEN_TTL_DAYS}d` : "7d",
        issuer: prodStatus ? `${process.env.HOST}` : `${process.env.HOST}${process.env.PORT ? `:${process.env.PORT}` : ""}`,
        audience: process.env.ClientHost,
        permissions: [], // permissions can be added here if needed
    });
}

function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
        issuer: prodStatus ? `${process.env.HOST}` : `${process.env.HOST}${process.env.PORT ? `:${process.env.PORT}` : ""}`,
        audience: process.env.ClientHost,
        permissions: [], // permissions can be checked here if needed
    });
}

module.exports = { createAccessToken, createRefreshToken, verifyRefreshToken };