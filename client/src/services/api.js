// client/src/services/api.js
// Centralized API client for ReciPeasy
// Falls back to /api (Vite proxy) but can be overridden via VITE_API_BASE_URL

import axios from 'axios'

const normalizeBaseUrl = (url) => {
  if (!url) return '/api'
  const trimmed = url.replace(/\/+$/, '')
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)

// Base axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Auth API
 * Matches backend routes under /api/auth
 *
 * Expected backend endpoints:
 *  POST /api/auth/login       -> { token, user }
 *  POST /api/auth/signup      -> { token, user }
 *  GET  /api/auth/me          -> { user }
 *  PUT  /api/auth/preferences -> { user }
 */
export const authAPI = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    return res.data
  },

  signup: async (email, password) => {
    const res = await api.post('/auth/signup', { email, password })
    return res.data
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me')
    return res.data
  },

  updatePreferences: async (preferences) => {
    const res = await api.put('/auth/preferences', preferences)
    return res.data
  },
}

/**
 * Recipes API
 * Matches backend routes under /api/recipes
 *
 * Expected backend endpoint:
 *  POST /api/recipes/search -> { recipes: [...] }
 */
export const recipesAPI = {
  search: async ({ ingredients, minProtein, maxTime }) => {
    const res = await api.post('/recipes/search', {
      ingredients,
      minProtein,
      maxTime,
    })
    return res.data
  },
}

/**
 * Favorites API
 * Matches backend routes under /api/favorites
 *
 * Expected backend endpoint:
 *  GET /api/favorites -> { favorites: [...] }
 */
export const favoritesAPI = {
  getAll: async () => {
    const res = await api.get('/favorites')
    return res.data
  },
  // You can add add/remove later if needed:
  // add: async (recipe) => { ... }
  // remove: async (id) => { ... }
}
