/**
 * Recipe Routes - Spoonacular API Integration
 * CS 409 Web Programming - UIUC Final Project
 * 
 * satisfies: external API integration requirement
 * satisfies: RESTful API requirement
 * Routes:
 *   POST /api/recipes/search - Search recipes by ingredients
 *   GET  /api/recipes/:id    - Get detailed recipe info
 */

const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');
const { optionalAuth } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/recipes/search
 * @desc    Search for recipes based on ingredients and filters
 * @access  Public (optional auth for personalization)
 * @body    { ingredients: string|array, minProtein?: number, maxTime?: number }
 */
router.post('/search', optionalAuth, recipesController.searchRecipes);

/**
 * @route   GET /api/recipes/:id
 * @desc    Get detailed information for a specific recipe
 * @access  Public
 * @param   id - Spoonacular recipe ID
 */
router.get('/:id', optionalAuth, recipesController.getRecipeDetail);

module.exports = router;

