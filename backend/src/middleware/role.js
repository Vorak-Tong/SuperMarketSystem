const permitRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (
      !req.user ||
      !allowedRoles.some(role =>
        req.user.role_name?.toLowerCase().includes(role.toLowerCase())
      )
    ) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};

export default permitRoles; 