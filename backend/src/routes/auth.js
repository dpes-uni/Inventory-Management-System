const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const env = require('../config/env')
const Joi = require('joi')

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & get token
 * @access Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const schema = Joi.object({
      username: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .required(),

      password: Joi.string()
        .min(6)
        .required(),
    })

    const { error } = schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      })
    }

    const { username, password } = req.body

    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn,
      }
    )

    // Return authenticated user information
    res.json({
      token,

      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router