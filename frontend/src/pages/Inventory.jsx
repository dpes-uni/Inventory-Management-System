import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { getProducts, deleteProduct } from '../services/productService'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDelete = async (id) => {
    const product = products.find((p) => p._id === id)
    const confirmed = window.confirm(
      `Delete "${product?.name || 'this product'}"? This action cannot be undone.`
    )
    if (!confirmed) return

    setDeletingId(id)
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.')
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0)

  return (
    <Layout>
      <div className="container-page">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
            <p className="text-sm text-slate-500">{products.length} product(s) in stock</p>
          </div>
          <Link to="/products/add" className="btn btn-primary">
            + Add Product
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading products..." />
        ) : error ? (
          <div
            role="alert"
            className="card p-6 text-center border-red-200 bg-red-50"
          >
            <p className="text-red-700 mb-4">{error}</p>
            <button type="button" onClick={loadProducts} className="btn btn-secondary">
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="card p-12 text-center">
            <span className="text-5xl" aria-hidden="true">
              📦
            </span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">No products yet</h2>
            <p className="mt-1 text-sm text-slate-500">
              Get started by adding your first product.
            </p>
            <Link to="/products/add" className="btn btn-primary mt-6 inline-flex">
              Add Product
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200" aria-label="Products table">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <Link
                          to={`/products/${product._id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                        {product.description}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`badge ${
                            product.quantity > 0 ? 'badge-in' : 'badge-out'
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          to={`/products/${product._id}/edit`}
                          className="text-sm text-blue-600 hover:underline mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="text-sm text-red-600 hover:underline disabled:opacity-50"
                        >
                          {deletingId === product._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}