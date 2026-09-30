const app = require('./app')
const env = require('./config/env')
const mongoose = require('mongoose')

// Connect to MongoDB
mongoose
  .connect(env.mongoUri, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  })
  .then(async () => {
    console.log('MongoDB connected')

    // Seed a default test user in development mode only
    if (env.nodeEnv !== 'production') {
      const User = require('./models/User')
      const exists = await User.findOne({ username: 'testuser' })
      if (!exists) {
        await new User({ username: 'testuser', passwordHash: 'testpass' }).save()
        console.log('Default test user created (testuser / testpass)')
      }
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

const server = app.listen(env.port, () => {
  console.log(`Backend server running in ${env.nodeEnv} mode on port ${env.port}`)
  console.log(`Health check: http://localhost:${env.port}/health`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...')
  server.close(() => process.exit(0))
})

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...')
  server.close(() => process.exit(0))
})