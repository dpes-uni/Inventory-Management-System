import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { getProduct, deleteProduct } from '../services/productService'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadProduct = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProduct(id)
      setProduct(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProduct()
  }, [id])

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${product?.name}"? This action cannot be undone.`)
    if (!confirmed) return
    setDeleting(true)
    try {
      await deleteProduct(id)
      navigate('/inventory')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading product..." />
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="container-page">
          <div role="alert" className="card p-6 text-center border-red-200 bg-red-50">
            <p className="text-red-700 mb-4">{error}</p>
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

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0)

  return (
    <Layout>
      <div className="container-page max-w-3xl">
        <div className="mb-6">
          <Link to="/inventory" className="text-sm text-blue-600 hover:underline">
            &larr; Back to Inventory
          </Link>
        </div>

        <div className="card p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
              <p className="mt-1 text-slate-500">Product ID: {product._id}</p>
            </div>
            <span
              className={`badge ${product.quantity > 0 ? 'badge-in' : 'badge-out'}`}
            >
              {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-slate-500">Price</p>
              <p className="text-xl font-semibold text-slate-900">{formatPrice(product.price)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Quantity</p>
              <p className="text-xl font-semibold text-slate-900">{product.quantity}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm text-slate-500 mb-1">Description</p>
            <p className="text-slate-700 whitespace-pre-wrap">
              {product.description || 'No description provided.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-200">
            <Link
              to={`/products/${product._id}/edit`}
              className="btn btn-primary"
            >
              Edit Product
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="btn btn-danger"
            >
              {deleting ? 'Deleting...' : 'Delete Product'}
            </button>
            <Link to="/inventory" className="btn btn-secondary">
              Back to Inventory
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}