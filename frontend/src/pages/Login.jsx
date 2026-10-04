import React, { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isAuthenticated, loading, error } = useAuth()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/inventory'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login({ username, password })
  }

  return (
    <div className="container-page flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <span className="text-4xl" aria-hidden="true">
            📦
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your inventory account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate aria-label="Login form">
          <div className="mb-4">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoFocus
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          For assessment purposes only. Credentials are never stored as plaintext.
        </p>
      </div>
    </div>
  )
}