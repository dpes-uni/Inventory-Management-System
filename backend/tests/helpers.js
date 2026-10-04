/**
 * Shared test helpers for the Inventory Management System backend tests.
 *
 * Uses Node's built-in `node:test` runner and `fetch()` for HTTP requests,
 * so no external test libraries are required.
 */

const http = require('http')
const mongoose = require('mongoose')
const app = require('../src/app')

const PORT = 0 // Use a random free port to avoid conflicts
let server = null
let baseUrl = null

/**
 * Start an HTTP server on a random port and return its base URL.
 */
function startServer() {
  return new Promise((resolve, reject) => {
    server = http.createServer(app)
    server.listen(PORT, () => {
      const address = server.address()
      baseUrl = `http://127.0.0.1:${address.port}`
      resolve(baseUrl)
    })
    server.on('error', reject)
  })
}

/**
 * Stop the HTTP server.
 */
function stopServer() {
  return new Promise((resolve) => {
    if (!server) return resolve()
    server.close(() => {
      server = null
      resolve()
    })
  })
}

/**
 * Connect to MongoDB for the test database.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/inventory_management'
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  })
}

/**
 * Disconnect from MongoDB.
 */
async function disconnectDB() {
  await mongoose.disconnect()
}

/**
 * Make an HTTP request helper.
 *
 * @param {string} method - HTTP method
 * @param {string} path - Request path
 * @param {object} body - Optional request body
 * @param {string} token - Optional auth token
 * @returns {Promise<{status: number, data: any}>}
 */
async function request(method, path, body, token) {
  const url = `${baseUrl}${path}`
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  return { status: res.status, data }
}

/**
 * Create a test user in the database and return their credentials.
 */
async function createTestUser(role = 'staff') {
  const User = require('../src/models/User')
  const user = new User({
    username: `testuser_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    passwordHash: 'testpass',
    role,
  })
  await user.save()
  return { username: user.username, password: 'testpass', id: user._id }
}

/**
 * Login and return a JWT token.
 */
async function loginAs(user) {
  const res = await request('POST', '/api/auth/login', {
    username: user.username,
    password: user.password,
  })
  return res.data.token
}

/**
 * Clean a collection by name.
 */
async function cleanCollection(name) {
  if (mongoose.connection.db) {
    await mongoose.connection.db.collection(name).deleteMany({})
  }
}

module.exports = {
  startServer,
  stopServer,
  connectDB,
  disconnectDB,
  request,
  createTestUser,
  loginAs,
  cleanCollection,
}