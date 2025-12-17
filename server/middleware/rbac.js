function requireRole(role) {
    return (req, res, next) => {
        const roles = req.user?.roles || [];
        if (!roles.includes(role)) return res.status(403).json({ error: "Forbidden" });
        next();
    };
}

function requirePermission(permission) {
    return (req, res, next) => {
        const perms = req.user?.permissions || [];
        if (!perms.includes(permission)) return res.status(403).json({ error: "Forbidden" });
        next();
    };
}

module.exports = { requireRole, requirePermission };