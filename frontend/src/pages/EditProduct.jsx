import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductForm from '../components/ProductForm'
import { getProduct, updateProduct } from '../services/productService'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setServerError(null)
      try {
        const data = await getProduct(id)
        if (!cancelled) {
          setProduct(data)
        }
      } catch (err) {
        if (!cancelled) {
          setServerError(err.response?.data?.message || 'Failed to load product.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id])

  const handleSubmit = async (productData) => {
    setSubmitting(true)
    setServerError(null)
    try {
      const updated = await updateProduct(id, productData)
      navigate(`/products/${updated._id}`)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update product.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading product..." />
      </Layout>
    )
  }

  if (serverError) {
    return (
      <Layout>
        <div className="container-page max-w-2xl">
          <div role="alert" className="card p-6 text-center border-red-200 bg-red-50">
            <p className="text-red-700 mb-4">{serverError}</p>
            <Link to="/inventory" className="btn btn-secondary">
              Back to Inventory
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return <Navigate to="/inventory" replace />
  }

  return (
    <Layout>
      <div className="container-page max-w-2xl">
        <div className="mb-6">
          <Link to="/inventory" className="text-sm text-blue-600 hover:underline">
            &larr; Back to Inventory
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit Product</h1>
          <p className="text-sm text-slate-500">Update the details for {product.name}.</p>
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
            initialData={{
              name: product.name,
              description: product.description,
              price: product.price,
              quantity: product.quantity,
            }}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </Layout>
  )
}