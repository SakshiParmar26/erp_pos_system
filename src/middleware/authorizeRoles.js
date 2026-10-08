const authorizeRoles = (permission) => {
    return (req, res, next) => {

        if (!req.employee) {
            return res.status(401).json({
                error: "Unauthorized. User not authenticated."
            });
        }

        const permissions = req.employee.permissions || [];

        if (!permissions.includes(permission)) {
            return res.status(403).json({
                error: `Forbidden. Missing required permission: ${permission}`
            });
        }

        next();
    };
};

module.exports = { authorizeRoles };