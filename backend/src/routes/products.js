const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const { authenticate } = require('../middleware/auth')

/**
 * @route GET /api/products
 * @desc Get all products
 * @access Private
 */
router.get('/', authenticate, async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})

/**
 * @route GET /api/products/:id
 * @desc Get single product by ID
 * @access Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product' })
  }
})

/**
 * @route POST /api/products
 * @desc Create new product
 * @access Private
 */
router.post('/', authenticate, async (req, res) => {
  try {
    // Validate request body
    const { error } = Product.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const product = new Product(req.body)
    await product.save()

    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product' })
  }
})

/**
 * @route PUT /api/products/:id
 * @desc Update existing product
 * @access Private
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Validate request body
    const { error } = Product.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product' })
  }
})

/**
 * @route DELETE /api/products/:id
 * @desc Delete product
 * @access Private
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' })
  }
})

module.exports = router