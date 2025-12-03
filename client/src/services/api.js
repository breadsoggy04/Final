/**
 * API Service Layer - Backend Communication
 * CS 409 Web Programming - UIUC Final Project
 * 
 * satisfies: frontend API integration requirement
 */

import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      // Optionally redirect to login
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Authentication API calls
 * satisfies: auth API integration requirement
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {string} email 
   * @param {string} password 
   */
  signup: async (email, password) => {
    return api.post('/auth/signup', { email, password })
  },

  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   */
  login: async (email, password) => {
    return api.post('/auth/login', { email, password })
  },

  /**
   * Get current logged-in user
   */
  getCurrentUser: async () => {
    return api.get('/auth/me')
  },

  /**
   * Update user preferences
   * @param {Object} preferences - { default_protein_goal, default_max_time }
   */
  updatePreferences: async (preferences) => {
    return api.put('/auth/preferences', preferences)
  }
}

/**
 * Recipe API calls
 * satisfies: recipe search API integration requirement
 */
export const recipesAPI = {
  /**
   * Search recipes by ingredients with filters
   * @param {Object} params - Search parameters
   * @param {string|string[]} params.ingredients - Comma-separated or array of ingredients
   * @param {number} params.minProtein - Minimum protein in grams
   * @param {number} params.maxTime - Maximum cooking time in minutes
   */
  search: async ({ ingredients, minProtein = 0, maxTime = 999 }) => {
    return api.post('/recipes/search', {
      ingredients,
      minProtein,
      maxTime
    })
  },

  /**
   * Get detailed recipe information
   * @param {number} id - Spoonacular recipe ID
   */
  getDetail: async (id) => {
    return api.get(`/recipes/${id}`)
  }
}

/**
 * Favorites API calls
 * satisfies: favorites API integration requirement
 */
export const favoritesAPI = {
  /**
   * Get all favorites for current user
   */
  getAll: async () => {
    return api.get('/favorites')
  },

  /**
   * Add a recipe to favorites
   * @param {Object} recipe - Recipe data to save
   */
  add: async (recipe) => {
    return api.post('/favorites', {
      recipe_id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      ready_in_minutes: recipe.readyInMinutes,
      protein_grams: recipe.proteinGrams,
      calories: recipe.calories
    })
  },

  /**
   * Check if a recipe is favorited
   * @param {number} recipeId - Spoonacular recipe ID
   */
  check: async (recipeId) => {
    return api.get(`/favorites/check/${recipeId}`)
  },

  /**
   * Remove a recipe from favorites
   * @param {number} recipeId - Spoonacular recipe ID
   */
  remove: async (recipeId) => {
    return api.delete(`/favorites/${recipeId}`)
  }
}

export default api

