/**
 * ReciPeasy App - Main Application Component
 * CS 409 Web Programming - UIUC Final Project
 * 
 * satisfies: frontend routing requirement
 * satisfies: responsive design requirement
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import RecipeDetail from './pages/RecipeDetail'
import SavedRecipes from './pages/SavedRecipes'
import './App.css'

/**
 * Protected Route wrapper - redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

/**
 * Public Route wrapper - redirects to dashboard if already authenticated
 */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }
  
  if (user) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          
          {/* Main dashboard - accessible to all */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Recipe detail - accessible to all */}
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          
          {/* Protected routes - require authentication */}
          <Route 
            path="/saved" 
            element={
              <ProtectedRoute>
                <SavedRecipes />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

