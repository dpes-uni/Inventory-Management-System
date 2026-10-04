import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { getProducts, deleteProduct } from '../services/productService'
import { useAuth } from '../context/AuthContext'

export default function Inventory() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadProducts = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load products. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDelete = async (id) => {
    // Extra frontend protection
    if (!isAdmin) {
      setError('Admin access is required to delete products.')
      return
    }

    const product = products.find((p) => p._id === id)

    const confirmed = window.confirm(
      `Delete "${product?.name || 'this product'}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setDeletingId(id)
    setError(null)

    try {
      await deleteProduct(id)

      setProducts((prev) =>
        prev.filter((productItem) => productItem._id !== id)
      )
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to delete product.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0)

  // Dashboard statistics
  const totalProducts = products.length

  const totalUnits = products.reduce(
    (total, product) =>
      total + Number(product.quantity || 0),
    0
  )

  const lowStockProducts = products.filter(
    (product) => Number(product.quantity || 0) <= 5
  ).length

  // Search products by name or description
  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) {
      return products
    }

    return products.filter((product) => {
      const name = product.name?.toLowerCase() || ''
      const description =
        product.description?.toLowerCase() || ''

      return (
        name.includes(search) ||
        description.includes(search)
      )
    })
  }, [products, searchTerm])

  return (
    <Layout>
      <div className="container-page">
        {/* Dashboard heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">
                Inventory Dashboard
              </h1>

              {!isAdmin && (
                <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                  View Only
                </span>
              )}
            </div>

            <p className="mt-1 text-slate-500">
              {isAdmin
                ? 'Manage and monitor your product inventory.'
                : 'View and search the current product inventory.'}
            </p>
          </div>

          {/* Only admins can add products */}
          {isAdmin && (
            <Link
              to="/products/add"
              className="btn btn-primary"
            >
              + Add Product
            </Link>
          )}
        </div>

        {/* Dashboard cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {/* Total products */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Products
                  </p>

                  <p className="mt-2 text-4xl font-bold text-slate-900">
                    {totalProducts}
                  </p>
                </div>

                <span
                  className="text-4xl"
                  aria-hidden="true"
                >
                  📦
                </span>
              </div>
            </div>

            {/* Total units */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Units
                  </p>

                  <p className="mt-2 text-4xl font-bold text-slate-900">
                    {totalUnits}
                  </p>
                </div>

                <span
                  className="text-4xl"
                  aria-hidden="true"
                >
                  📊
                </span>
              </div>
            </div>

            {/* Low stock */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Low / Out of Stock
                  </p>

                  <p
                    className={`mt-2 text-4xl font-bold ${
                      lowStockProducts > 0
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {lowStockProducts}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Products with 5 units or fewer
                  </p>
                </div>

                <span
                  className="text-4xl"
                  aria-hidden="true"
                >
                  ⚠️
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <LoadingSpinner message="Loading products..." />
        ) : error ? (
          /* Error */
          <div
            role="alert"
            className="card p-6 text-center border-red-200 bg-red-50"
          >
            <p className="text-red-700 mb-4">
              {error}
            </p>

            <button
              type="button"
              onClick={loadProducts}
              className="btn btn-secondary"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          /* Empty inventory */
          <div className="card p-12 text-center">
            <span
              className="text-5xl"
              aria-hidden="true"
            >
              📦
            </span>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No products yet
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isAdmin
                ? 'Get started by adding your first product.'
                : 'There are currently no products in the inventory.'}
            </p>

            {isAdmin && (
              <Link
                to="/products/add"
                className="btn btn-primary mt-6 inline-flex"
              >
                Add Product
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="mb-8">
              <label
                htmlFor="product-search"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                Search Products
              </label>

              <input
                id="product-search"
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search by name or description..."
                className="form-input max-w-xl"
              />

              {searchTerm && (
                <p className="mt-2 text-sm text-slate-500">
                  Showing {filteredProducts.length} of{' '}
                  {products.length} product(s)
                </p>
              )}
            </div>

            {/* No search results */}
            {filteredProducts.length === 0 ? (
              <div className="card p-10 text-center">
                <span
                  className="text-4xl"
                  aria-hidden="true"
                >
                  🔎
                </span>

                <h2 className="mt-3 text-lg font-semibold text-slate-900">
                  No matching products
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Try another product name or description.
                </p>

                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="btn btn-secondary mt-5"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              /* Product table */
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table
                    className="min-w-full divide-y divide-slate-200"
                    aria-label="Products table"
                  >
                    <thead className="bg-slate-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase"
                        >
                          Name
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase"
                        >
                          Description
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase"
                        >
                          Price
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase"
                        >
                          Quantity
                        </th>

                        {/* Actions column only for admins */}
                        {isAdmin && (
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase"
                          >
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-slate-50"
                        >
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
                                Number(product.quantity) > 0
                                  ? 'badge-in'
                                  : 'badge-out'
                              }`}
                            >
                              {product.quantity}
                            </span>
                          </td>

                          {/* Admin actions */}
                          {isAdmin && (
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <Link
                                to={`/products/${product._id}/edit`}
                                className="text-sm text-blue-600 hover:underline mr-4"
                              >
                                Edit
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(product._id)
                                }
                                disabled={
                                  deletingId === product._id
                                }
                                className="text-sm text-red-600 hover:underline disabled:opacity-50"
                              >
                                {deletingId === product._id
                                  ? 'Deleting...'
                                  : 'Delete'}
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}