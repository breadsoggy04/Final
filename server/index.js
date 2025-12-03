/**
 * ReciPeasy Server - Main Entry Point
 * CS 409 Web Programming - UIUC Final Project
 * 
 * satisfies: RESTful API requirement
 * satisfies: backend server requirement
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const recipesRoutes = require('./routes/recipesRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
// satisfies: database requirement
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Request logging middleware (for development)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
// satisfies: RESTful API endpoints requirement
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/favorites', favoritesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'ReciPeasy API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: `Cannot ${req.method} ${req.path}` 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║     🍳 ReciPeasy Server is Running! 🍳     ║
  ╠════════════════════════════════════════════╣
  ║  Local:  http://localhost:${PORT}             ║
  ║  API:    http://localhost:${PORT}/api         ║
  ╚════════════════════════════════════════════╝
  `);
});

module.exports = app;

