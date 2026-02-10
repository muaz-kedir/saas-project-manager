// RBAC middleware
module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    const role = req.user.role;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions"
      });
    }

    next();
  };
};
