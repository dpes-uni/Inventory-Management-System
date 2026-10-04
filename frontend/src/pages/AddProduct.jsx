import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductForm from '../components/ProductForm'
import { createProduct } from '../services/productService'

export default function AddProduct() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  const handleSubmit = async (productData) => {
    setSubmitting(true)
    setServerError(null)
    try {
      const created = await createProduct(productData)
      navigate(`/products/${created._id}`)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create product.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="container-page max-w-2xl">
        <div className="mb-6">
          <Link to="/inventory" className="text-sm text-blue-600 hover:underline">
            &larr; Back to Inventory
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Add Product</h1>
          <p className="text-sm text-slate-500">Fill in the details for the new product.</p>
        </div>

        <div className="card p-8">
          {serverError && (
            <div
              role="alert"
              className="mb-6 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {serverError}
            </div>
          )}
          <ProductForm
            onSubmit={handleSubmit}
            submitting={submitting}
            submitLabel="Add Product"
          />
        </div>
      </div>
    </Layout>
  )
}