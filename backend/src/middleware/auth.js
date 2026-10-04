const jwt = require('jsonwebtoken')
const User = require('../models/User')
const env = require('../config/env')

/**
 * Authenticate JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Missing or invalid token',
      })
    }

    const token = authHeader.substring(7)

    const decoded = jwt.verify(token, env.jwtSecret)

    // Fetch current user from database
    const user = await User.findById(decoded.id).select('-passwordHash')

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      })
    }

    req.user = user

    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token',
      })
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired',
      })
    }

    res.status(500).json({
      message: 'Authentication error',
    })
  }
}

/**
 * Allow only administrators
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required',
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Admin access required',
    })
  }

  next()
}

module.exports = {
  authenticate,
  requireAdmin,
}