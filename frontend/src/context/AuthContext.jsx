import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as loginService } from '../services/authService'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Restore session from localStorage on mount
  useEffect(() => {
    let cancelled = false
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (err) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
      }
    }
    if (!cancelled) setLoading(false)
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginService(credentials)
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authUser', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setToken(null)
    setUser(null)
  }, [])

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}