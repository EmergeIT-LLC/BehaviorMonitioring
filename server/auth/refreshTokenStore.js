function addDaysISO(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
}

async function insertRefreshToken(db, { userId, token, ttlDays, userAgent, ipAddress }) {
    const expiresAt = addDaysISO(ttlDays);

    await db.run(
        `INSERT INTO refresh_tokens (user_id, token, expires_at, user_agent, ip_address, device_id, last_used_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, [userId, token, expiresAt, userAgent || null, ipAddress || null, deviceId || null, new Date().toISOString()]
    );

    return expiresAt;
}

async function findRefreshToken(db, token) {
    return db.all(`SELECT * FROM refresh_tokens WHERE token = ?`, [token]);
}

async function revokeRefreshToken(db, token) {
    await db.run(
        `UPDATE refresh_tokens SET revoked = 1, revoked_at = CURRENT_TIMESTAMP WHERE token = ?`, [token]
    );
}

async function rotateRefreshToken(db, oldToken, newToken) {
    await db.run(
        `UPDATE refresh_tokens SET revoked = 1, revoked_at = CURRENT_TIMESTAMP, replaced_by_token = ? WHERE token = ?`, [newToken, oldToken]
    );
}

async function touchRefreshToken(db, token) {
    return db.run(
        `UPDATE refresh_tokens SET last_used_at = ? WHERE token = ?`,
        [new Date().toISOString(), token]
    );
}

module.exports = { insertRefreshToken, findRefreshToken, revokeRefreshToken, rotateRefreshToken, touchRefreshToken };