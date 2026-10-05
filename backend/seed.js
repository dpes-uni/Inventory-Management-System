const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./src/models/User')

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/inventory_management'

// Deployment seed accounts. These are only for testing the deployed app;
// do not use these credentials in real production deployments.
const testAccounts = [
  { username: 'testuser', password: 'testpass', role: 'admin' },
  { username: 'staffuser', password: 'staffpass', role: 'staff' },
]

// Hash passwords with bcrypt before storing, matching the User model's
// pre-save hook (bcrypt.hash(password, 12)). updateOne() bypasses that hook,
// so plaintext passwords would be stored and logins would fail.
async function seed() {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  })

  console.log('MongoDB connected (seed)')

  for (const { username, password, role } of testAccounts) {
    const passwordHash = await bcrypt.hash(password, 12)
    const result = await User.updateOne(
      { username },
      {
        $set: {
          username,
          passwordHash,
          role,
        },
      },
      { upsert: true },
    )
    console.log(`${result.upsertedCount ? 'Created' : 'Updated'} ${role} account: ${username}`)
  }

  await mongoose.disconnect()
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed error:', err)
    process.exit(1)
  })