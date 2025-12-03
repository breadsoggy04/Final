/**
 * User Model - MongoDB Schema for Users
 * CS 409 Web Programming - UIUC Final Project
 * 
 * satisfies: user authentication requirement
 * satisfies: database schema requirement
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    index: true // Index for faster lookups
  },
  password_hash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  // Optional profile fields for storing user preferences
  default_protein_goal: {
    type: Number,
    default: 0,
    min: 0,
    max: 200
  },
  default_max_time: {
    type: Number,
    default: 60,
    min: 5,
    max: 300
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

/**
 * Pre-save middleware to hash password
 * Uses bcrypt for secure password hashing
 * satisfies: bcrypt password hashing requirement
 */
userSchema.pre('save', async function(next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password_hash')) {
    return next();
  }
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare passwords
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {Promise<boolean>} - True if passwords match
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

/**
 * Instance method to return safe user object (without password)
 * @returns {Object} - User object without sensitive data
 */
userSchema.methods.toSafeObject = function() {
  return {
    id: this._id,
    email: this.email,
    default_protein_goal: this.default_protein_goal,
    default_max_time: this.default_max_time,
    created_at: this.created_at
  };
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model('User', userSchema);

module.exports = User;

