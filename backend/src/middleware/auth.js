const jwt = require('jsonwebtoken')
const User = require('../models/User')
const env = require('../config/env')

/**
 * Authenticate JWT token from Authorization header
 * Attaches user to request if token is valid
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid token' })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, env.jwtSecret)

    // Fetch user from DB to ensure they still exist
    const user = await User.findById(decoded.id).select('-passwordHash')
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    // Attach user to request for route handlers
    req.user = user
    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    res.status(500).json({ message: 'Authentication error' })
  }
}

module.exports = { authenticate }