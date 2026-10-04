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

    // Create/update development test accounts
    if (env.nodeEnv !== 'production') {
      const User = require('./models/User')

      // -------------------------
      // ADMIN ACCOUNT
      // -------------------------
      let adminUser = await User.findOne({
        username: 'testuser',
      })

      if (!adminUser) {
        adminUser = await new User({
          username: 'testuser',
          passwordHash: 'testpass',
          role: 'admin',
        }).save()

        console.log(
          'Default admin created (testuser / testpass)'
        )
      } else if (adminUser.role !== 'admin') {
        adminUser.role = 'admin'
        await adminUser.save()

        console.log(
          'Existing testuser updated to admin'
        )
      }

      // -------------------------
      // STAFF ACCOUNT
      // -------------------------
      let staffUser = await User.findOne({
        username: 'staffuser',
      })

      if (!staffUser) {
        staffUser = await new User({
          username: 'staffuser',
          passwordHash: 'staffpass',
          role: 'staff',
        }).save()

        console.log(
          'Default staff created (staffuser / staffpass)'
        )
      } else if (staffUser.role !== 'staff') {
        staffUser.role = 'staff'
        await staffUser.save()

        console.log(
          'Existing staffuser updated to staff'
        )
      }
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

const server = app.listen(env.port, () => {
  console.log(
    `Backend server running in ${env.nodeEnv} mode on port ${env.port}`
  )

  console.log(
    `Health check: http://localhost:${env.port}/health`
  )
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