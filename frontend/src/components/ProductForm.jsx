import React, { useState } from 'react'

const initialForm = {
  name: '',
  description: '',
  price: '',
  quantity: '',
}

export default function ProductForm({ initialData, onSubmit, submitting, submitLabel }) {
  const [form, setForm] = useState(initialData || initialForm)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!form.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (form.price === '' || form.price === null) {
      newErrors.price = 'Price is required'
    } else if (Number(form.price) < 0) {
      newErrors.price = 'Price must be a positive number'
    }
    if (form.quantity === '' || form.quantity === null) {
      newErrors.quantity = 'Quantity is required'
    } else if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a non-negative whole number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Product form">
      <div className="mb-5">
        <label htmlFor="name" className="form-label">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          className="form-input"
          value={form.name}
          onChange={handleChange('name')}
          placeholder="Product name"
          aria-required="true"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && <p className="form-error" role="alert">{errors.name}</p>}
      </div>

      <div className="mb-5">
        <label htmlFor="description" className="form-label">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          className="form-input resize-y"
          value={form.description}
          onChange={handleChange('description')}
          placeholder="Product description"
          aria-required="true"
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && <p className="form-error" role="alert">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="price" className="form-label">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            className="form-input"
            value={form.price}
            onChange={handleChange('price')}
            placeholder="0.00"
            aria-required="true"
            aria-invalid={errors.price ? 'true' : 'false'}
          />
          {errors.price && <p className="form-error" role="alert">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="quantity" className="form-label">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            id="quantity"
            type="number"
            min="0"
            step="1"
            className="form-input"
            value={form.quantity}
            onChange={handleChange('quantity')}
            placeholder="0"
            aria-required="true"
            aria-invalid={errors.quantity ? 'true' : 'false'}
          />
          {errors.quantity && <p className="form-error" role="alert">{errors.quantity}</p>}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}