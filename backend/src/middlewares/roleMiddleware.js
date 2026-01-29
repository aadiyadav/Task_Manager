function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user

    if (!user || !user.role) {
      return res.status(403).json({ message: 'Forbidden: Missing role' })
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' })
    }

    return next()
  }
}

module.exports = {
  requireRole,
}

