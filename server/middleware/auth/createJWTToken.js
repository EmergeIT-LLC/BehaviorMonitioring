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

function createRefreshToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET, // separate secret from access token
    {
      expiresIn: "7d",               // typical refresh lifetime
      issuer: process.env.HOST,
      audience: process.env.ClientHost
    }
  );
}

module.exports = {
  createJWTToken,
  createRefreshToken
};