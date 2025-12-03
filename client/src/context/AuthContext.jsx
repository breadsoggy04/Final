/**
 * Authentication Context - Global Auth State
 * CS 409 Web Programming - UIUC Final Project
 * 
 * satisfies: frontend auth state management requirement
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await authAPI.getCurrentUser()
        setUser(response.user)
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem('token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  /**
   * Login user with email and password
   */
  const login = async (email, password) => {
    setError(null)
    try {
      const response = await authAPI.login(email, password)
      localStorage.setItem('token', response.token)
      setUser(response.user)
      return response
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      throw new Error(message)
    }
  }

  /**
   * Register new user
   */
  const signup = async (email, password) => {
    setError(null)
    try {
      const response = await authAPI.signup(email, password)
      localStorage.setItem('token', response.token)
      setUser(response.user)
      return response
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed'
      setError(message)
      throw new Error(message)
    }
  }

  /**
   * Logout user
   */
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setError(null)
  }

  /**
   * Update user preferences
   */
  const updatePreferences = async (preferences) => {
    try {
      const response = await authAPI.updatePreferences(preferences)
      setUser(response.user)
      return response
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update preferences'
      throw new Error(message)
    }
  }

  /**
   * Clear any auth errors
   */
  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updatePreferences,
    clearError,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

