function setRefreshCookie(res, token) {
    res.cookie(process.env.COOKIE_NAME || "bmRefreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/auth/refresh",
        maxAge: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7) * 24 * 60 * 60 * 1000,
    });
}

function clearRefreshCookie(res) {
    res.clearCookie(process.env.COOKIE_NAME || "bmRefreshToken", {
        path: "/auth/refresh",
    });
}

module.exports = { setRefreshCookie, clearRefreshCookie };