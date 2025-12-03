/**
 * Authentication Routes
 * CS 409 Web Programming - UIUC Final Project
 * 
 * satisfies: RESTful auth routes requirement
 * Routes:
 *   POST /api/auth/signup - Create new user
 *   POST /api/auth/login  - Login and get JWT
 *   GET  /api/auth/me     - Get current user (protected)
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', authController.signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user's info
 * @access  Private (requires JWT)
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

/**
 * @route   PUT /api/auth/preferences
 * @desc    Update user preferences (protein goal, max time)
 * @access  Private (requires JWT)
 */
router.put('/preferences', authMiddleware, authController.updatePreferences);

module.exports = router;

