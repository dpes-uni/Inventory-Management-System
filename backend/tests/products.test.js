/**
 * Tests for the product CRUD endpoints.
 *
 * Covers:
 *   - GET /api/products returns an array of products
 *   - POST /api/products creates a product (201) and rejects invalid data (400)
 *   - GET /api/products/:id returns a single product (200) or 404
 *   - PUT /api/products/:id updates a product (200) or 404
 *   - DELETE /api/products/:id deletes a product (200) or 404
 */

const { describe, it, before, after } = require('node:test')
const assert = require('node:assert')
const { startServer, stopServer, connectDB, disconnectDB, request, createTestUser, loginAs, cleanCollection } = require('./helpers')

describe('Products CRUD', { timeout: 30000 }, () => {
  let token = null

  before(async () => {
    await connectDB()
    await startServer()
    await cleanCollection('products')
    const user = await createTestUser()
    token = await loginAs(user)
  })

  after(async () => {
    await stopServer()
    await disconnectDB()
  })

  const validProduct = {
    name: 'Widget',
    description: 'A useful widget',
    price: 9.99,
    quantity: 120,
  }

  it('GET /api/products returns an empty array initially', async () => {
    const res = await request('GET', '/api/products', null, token)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.length, 0)
  })

  it('POST /api/products creates a new product', async () => {
    const res = await request('POST', '/api/products', validProduct, token)

    assert.strictEqual(res.status, 201)
    assert.strictEqual(res.data.name, validProduct.name)
    assert.strictEqual(res.data.description, validProduct.description)
    assert.strictEqual(res.data.price, validProduct.price)
    assert.strictEqual(res.data.quantity, validProduct.quantity)
    assert.ok(res.data._id)
  })

  it('POST /api/products rejects missing name', async () => {
    const res = await request('POST', '/api/products', { ...validProduct, name: '' }, token)

    assert.strictEqual(res.status, 400)
  })

  it('POST /api/products rejects negative price', async () => {
    const res = await request('POST', '/api/products', { ...validProduct, price: -5 }, token)

    assert.strictEqual(res.status, 400)
  })

  it('POST /api/products rejects non-integer quantity', async () => {
    const res = await request('POST', '/api/products', { ...validProduct, quantity: 1.5 }, token)

    assert.strictEqual(res.status, 400)
  })

  it('GET /api/products returns the created product', async () => {
    await request('POST', '/api/products', validProduct, token)
    const res = await request('GET', '/api/products', null, token)

    assert.strictEqual(res.status, 200)
    assert.ok(res.data.length >= 1)
  })

  it('GET /api/products/:id returns a single product', async () => {
    const created = await request('POST', '/api/products', validProduct, token)
    const res = await request('GET', `/api/products/${created.data._id}`, null, token)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data._id, created.data._id)
  })

  it('GET /api/products/:id returns 404 for a non-existent ID', async () => {
    const res = await request('GET', '/api/products/64f8d2a3b1c9e7f5a1b2c3d4', null, token)

    assert.strictEqual(res.status, 404)
    assert.strictEqual(res.data.message, 'Product not found')
  })

  it('PUT /api/products/:id updates a product', async () => {
    const created = await request('POST', '/api/products', validProduct, token)
    const res = await request('PUT', `/api/products/${created.data._id}`, {
      name: 'Widget Pro',
      description: 'An improved widget',
      price: 12.99,
      quantity: 80,
    }, token)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.name, 'Widget Pro')
    assert.strictEqual(res.data.price, 12.99)
    assert.strictEqual(res.data.quantity, 80)
  })

  it('PUT /api/products/:id returns 404 for a non-existent ID', async () => {
    const res = await request('PUT', '/api/products/64f8d2a3b1c9e7f5a1b2c3d4', validProduct, token)

    assert.strictEqual(res.status, 404)
    assert.strictEqual(res.data.message, 'Product not found')
  })

  it('PUT /api/products/:id rejects invalid data', async () => {
    const created = await request('POST', '/api/products', validProduct, token)
    const res = await request('PUT', `/api/products/${created.data._id}`, { ...validProduct, price: -1 }, token)

    assert.strictEqual(res.status, 400)
  })

  it('DELETE /api/products/:id deletes a product', async () => {
    const created = await request('POST', '/api/products', validProduct, token)
    const res = await request('DELETE', `/api/products/${created.data._id}`, null, token)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.message, 'Product deleted')
  })

  it('DELETE /api/products/:id returns 404 for a non-existent ID', async () => {
    const res = await request('DELETE', '/api/products/64f8d2a3b1c9e7f5a1b2c3d4', null, token)

    assert.strictEqual(res.status, 404)
    assert.strictEqual(res.data.message, 'Product not found')
  })

  it('DELETE /api/products/:id returns 404 when deleting again', async () => {
    const created = await request('POST', '/api/products', validProduct, token)
    await request('DELETE', `/api/products/${created.data._id}`, null, token)
    const res = await request('DELETE', `/api/products/${created.data._id}`, null, token)

    assert.strictEqual(res.status, 404)
  })
})