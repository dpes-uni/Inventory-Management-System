const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const env = require('./config/env')

const app = express()

// Security & parsing middleware
app.use(helmet())
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
)
app.use(morgan('dev'))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'inventory-management-system-backend',
    timestamp: new Date().toISOString(),
  })
})

// Mount route handlers
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))

// Central error handler
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' })
})

module.exports = app