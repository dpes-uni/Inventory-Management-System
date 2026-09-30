const mongoose = require('mongoose')
const Joi = require('joi')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer',
      },
    },
  },
  {
    timestamps: true,
  }
)

// Validation schema for request body
const productValidationSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  description: Joi.string().trim().max(500).required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().integer().min(0).required(),
})

// Static validation method
productSchema.statics.validate = function (product) {
  return productValidationSchema.validate(product)
}

module.exports = mongoose.model('Product', productSchema)