import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Check whether the logged-in user is an admin
  const isAdmin = user?.role === 'admin'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-slate-700 hover:bg-slate-100'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container-page flex items-center justify-between h-16">
          <Link to="/inventory" className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">
              📦
            </span>
            <span className="font-bold text-lg text-slate-900">
              Inventory System
            </span>
          </Link>

          <nav aria-label="Primary">
            <ul className="flex items-center gap-1">
              <li>
                <Link
                  to="/inventory"
                  className={navLinkClass('/inventory')}
                >
                  Inventory
                </Link>
              </li>

              {/* Only admins can see Add Product */}
              {isAdmin && (
                <li>
                  <Link
                    to="/products/add"
                    className={navLinkClass('/products/add')}
                  >
                    Add Product
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm text-slate-700">
                {user?.username || 'User'}
              </span>

              <span className="text-xs text-slate-500 capitalize">
                {user?.role || 'staff'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="container-page py-4 text-center text-sm text-slate-500">
          Inventory Management System &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}