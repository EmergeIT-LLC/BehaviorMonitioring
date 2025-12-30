const logAuthEvent = require('../middleware/helpers/authLog');
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../auth/tokens');
const { setRefreshCookie, clearRefreshCookie } = require('../auth/cookies');
const { insertRefreshToken, findRefreshToken, revokeRefreshToken, rotateRefreshToken } = require('../auth/refreshTokenStore');
const { getOrCreateDeviceId } = require('../auth/device');
const employeeQueries = require('../middleware/helpers/EmployeeQueries');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

class AuthController {
    /**
     * Validate and activate employee account
     */
    async validateEmployeeAccount(req, res) {
        try {
            const uName = req.body.username;
            const password = req.body.password;

            if (await employeeQueries.employeeExistByUsername(uName)) {
                const employeeData = await employeeQueries.employeeDataByUsername(uName.toLowerCase());

                if (employeeData.account_status === "In Verification") {
                    bcrypt.hash(password, saltRounds, async function (err, hash) {
                        if (err) {
                            return res.json({ statusCode: 403, accountVerified: false, serverMessage: 'A server error occurred', errorMessage: err.message });
                        }
                        else if (await employeeQueries.employeeSetEmployeeCredentialsByUsername(hash, uName)) {
                            if (await employeeQueries.employeeUpdateEmployeeAccountStatusByUsername("Active", uName)) {
                                return res.json({ statusCode: 200, accountVerified: true });
                            }
                            else {
                                return res.json({ statusCode: 403, accountVerified: false, serverMessage: 'A server error occurred', errorMessage: 'Unable to activate account' });
                            }
                        }
                    });
                }
                return res.json({ statusCode: 401, locatedAccount: false });
            }
        } catch (error) {
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
        }
    }

    /**
     * Verify employee login credentials
     */
    async verifyEmployeeLogin(req, res) {
        try {
            const uName = req.body.username;
            const password = req.body.password;

            if (await employeeQueries.employeeExistByUsername(uName.toLowerCase())) {
                const employeePassword = await employeeQueries.employeePasswordByUsername(uName.toLowerCase());

                if (employeePassword?.password && employeePassword.password.length > 0) {
                    const bcryptResult = await new Promise((resolve, reject) => {
                        bcrypt.compare(password, employeePassword.password, (err, result) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(result);
                            }
                        });
                    });

                    if (bcryptResult) {
                        const employeeData = await employeeQueries.employeeDataByUsername(uName.toLowerCase());
                        const accessPayload = {
                            sub: employeeData.employeeID,
                            email: employeeData.email,
                            companyID: employeeData.companyID,
                            roles: [employeeData.role],
                        };
                        const accessToken = createAccessToken(accessPayload);
                        const refreshToken = createRefreshToken(employeeData.employeeID);
                        const deviceId = getOrCreateDeviceId(req, res);

                        await insertRefreshToken({ 
                            userId: employeeData.employeeID, 
                            token: refreshToken, 
                            ttlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7), 
                            userAgent: req.headers['user-agent'], 
                            ipAddress: req.ip, 
                            deviceId, 
                            lastUsedAt: new Date() 
                        });

                        setRefreshCookie(res, refreshToken);
                        await logAuthEvent("EMPLOYEE_LOGIN_SUCCESS", { 
                            userId: employeeData.employeeID, 
                            email: employeeData.email, 
                            ip: req.ip, 
                            userAgent: req.headers['user-agent'] 
                        });
                        
                        return res.json({ 
                            statusCode: 200, 
                            loginStatus: true, 
                            accessToken: accessToken, 
                            user: { 
                                uName: uName.toLowerCase(), 
                                compName: employeeData.companyName, 
                                compID: employeeData.companyID, 
                                isAdmin: employeeData.role === "root" || employeeData.role === "admin" 
                            } 
                        });
                    }
                    else {
                        await logAuthEvent("EMPLOYEE_LOGIN_FAILED", { 
                            email: uName.toLowerCase(), 
                            ip: req.ip, 
                            userAgent: req.headers['user-agent'], 
                            details: 'Incorrect password' 
                        });
                        return res.json({ statusCode: 401, serverMessage: 'Password is incorrect' });
                    }
                }
                else {
                    await logAuthEvent("EMPLOYEE_LOGIN_FAILED", { 
                        email: uName.toLowerCase(), 
                        ip: req.ip, 
                        userAgent: req.headers['user-agent'], 
                        details: 'User needs to authenticate their account' 
                    });
                    return res.json({ statusCode: 401, serverMessage: 'User needs to authenticate their account' });
                }
            }
            else {
                await logAuthEvent("EMPLOYEE_LOGIN_FAILED", { 
                    email: uName.toLowerCase(), 
                    ip: req.ip, 
                    userAgent: req.headers['user-agent'], 
                    details: 'Unauthorized user' 
                });
                return res.json({ statusCode: 401, serverMessage: 'Unauthorized user' });
            }
        } catch (error) {
            await logAuthEvent("EMPLOYEE_LOGIN_ERROR", { 
                email: req.body.username.toLowerCase(), 
                ip: req.ip, 
                userAgent: req.headers['user-agent'], 
                details: error.message 
            });
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
        }
    }

    /**
     * Handle employee logout
     */
    async verifyEmployeeLogout(req, res) {
        try {
            const cookieName = process.env.COOKIE_NAME || "bmRefreshToken";
            const refreshToken = req.cookies?.[cookieName];

            if (refreshToken) {
                await revokeRefreshToken(refreshToken);
            }

            clearRefreshCookie(res);

            await logAuthEvent("EMPLOYEE_LOGOUT", { 
                email: req.body.username?.toLowerCase(), 
                ip: req.ip, 
                userAgent: req.headers['user-agent'] 
            });
            return res.json({ statusCode: 200, loginStatus: false, isAdmin: false });
        } catch (error) {
            await logAuthEvent("EMPLOYEE_LOGOUT_ERROR", { 
                email: req.body.username?.toLowerCase(), 
                ip: req.ip, 
                userAgent: req.headers['user-agent'], 
                details: error.message 
            });
            return res.json({ statusCode: 500, serverMessage: 'A server error occurred', errorMessage: error.message });
        }
    }

    /**
     * Refresh access token using refresh token
     */
    async refresh(req, res) {
        const cookieName = process.env.COOKIE_NAME || "bmRefreshToken";
        const refreshToken = req.cookies?.[cookieName];

        if (!refreshToken) {
            return res.status(401).json({ error: "Missing refresh token" });
        }

        try {
            const decoded = verifyRefreshToken(refreshToken);

            const rows = await findRefreshToken(refreshToken);
            if (!rows || rows.length === 0) return res.status(401).json({ error: "Refresh token not recognized" });
            const row = rows[0];

            const isExpired = new Date(row.expires_at).getTime() <= Date.now();
            if (row.revoked || isExpired) {
                clearRefreshCookie(res);
                return res.status(401).json({ error: "Invalid refresh token" });
            }

            const employeeData = await employeeQueries.employeeDataById(decoded.sub);

            if (!employeeData) {
                clearRefreshCookie(res);
                return res.status(401).json({ error: "User not found" });
            }

            const newAccessToken = createAccessToken({
                sub: employeeData.employeeID,
                email: employeeData.email,
                companyID: employeeData.companyID,
                roles: [employeeData.role]
            });

            const newRefreshToken = createRefreshToken(employeeData.employeeID);
            
            // Revoke old token
            await rotateRefreshToken(refreshToken, newRefreshToken);
            
            // Insert new token (catch duplicate error in case of concurrent requests)
            try {
                await insertRefreshToken({
                    userId: employeeData.employeeID,
                    token: newRefreshToken,
                    ttlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7),
                    userAgent: req.headers['user-agent'],
                    ipAddress: req.ip,
                    deviceId: row.device_id,
                    lastUsedAt: new Date()
                });
            } catch (insertError) {
                if (insertError.name !== 'SequelizeUniqueConstraintError') {
                    throw insertError;
                }
                // Token already exists (concurrent request), continue anyway
            }

            setRefreshCookie(res, newRefreshToken);

            return res.json({ accessToken: newAccessToken });
        } catch (err) {
            clearRefreshCookie(res);
            return res.status(401).json({ error: "Invalid refresh token" });
        }
    }
}

module.exports = new AuthController();
