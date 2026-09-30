/**
 * Tests for the authentication endpoints.
 *
 * Covers:
 *   - Successful login returns a JWT token and user object
 *   - Login with invalid credentials returns 401
 *   - Login with missing/invalid body returns 400
 *   - Protected endpoints reject requests without a token (401)
 *   - Protected endpoints reject requests with an invalid token (401)
 */

const { describe, it, before, after } = require('node:test')
const assert = require('node:assert')
const { startServer, stopServer, connectDB, disconnectDB, request, createTestUser } = require('./helpers')

describe('Authentication', { timeout: 30000 }, () => {
  before(async () => {
    await connectDB()
    await startServer()
  })

  after(async () => {
    await stopServer()
    await disconnectDB()
  })

  it('logs in successfully with valid credentials', async () => {
    const user = await createTestUser()
    const res = await request('POST', '/api/auth/login', {
      username: user.username,
      password: user.password,
    })

    assert.strictEqual(res.status, 200)
    assert.ok(res.data.token, 'Login should return a token')
    assert.strictEqual(res.data.user.username, user.username)
  })

  it('rejects login with an unknown username', async () => {
    const res = await request('POST', '/api/auth/login', {
      username: 'does_not_exist',
      password: 'password123',
    })

    assert.strictEqual(res.status, 401)
    assert.strictEqual(res.data.message, 'Invalid credentials')
  })

  it('rejects login with the wrong password', async () => {
    const user = await createTestUser()
    const res = await request('POST', '/api/auth/login', {
      username: user.username,
      password: 'wrongpassword',
    })

    assert.strictEqual(res.status, 401)
    assert.strictEqual(res.data.message, 'Invalid credentials')
  })

  it('rejects login with missing fields', async () => {
    const res = await request('POST', '/api/auth/login', {
      username: 'ab',
      password: '12345',
    })

    assert.strictEqual(res.status, 400)
    assert.ok(typeof res.data.message === 'string')
  })

  it('rejects login with an empty body', async () => {
    const res = await request('POST', '/api/auth/login', {})

    assert.strictEqual(res.status, 400)
  })

  it('rejects access to a protected endpoint without a token', async () => {
    const res = await request('GET', '/api/products')

    assert.strictEqual(res.status, 401)
    assert.strictEqual(res.data.message, 'Missing or invalid token')
  })

  it('rejects access to a protected endpoint with an invalid token', async () => {
    const res = await request('GET', '/api/products', null, 'invalidtoken')

    assert.strictEqual(res.status, 401)
    assert.strictEqual(res.data.message, 'Invalid token')
  })
})