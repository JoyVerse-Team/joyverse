/**
 * ===============================================================
 * Authentication Middleware for JoyVerse Backend
 * ===============================================================
 * 
 * This middleware module provides authentication and authorization
 * functions for protecting API endpoints.
 * 
 * Functions:
 * 1. verifyToken - Validates JWT tokens for general authentication
 * 2. verifyAdmin - Checks admin role and permissions
 * 
 * Usage:
 * - Apply verifyToken to routes that require user authentication
 * - Apply verifyAdmin to routes that require admin privileges
 * 
 * Security Features:
 * - JWT token validation with expiration checking
 * - Role-based access control for admin functions
 * - Graceful error handling with appropriate HTTP status codes
 */

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Middleware to verify JWT token for authentication
 * 
 * This middleware:
 * 1. Extracts JWT token from Authorization header
 * 2. Validates token signature and expiration
 * 3. Attaches decoded admin data to request object
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Function} next - Express next middleware function
 */
const verifyToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header (format: "Bearer <token>")
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if token is provided
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Attach decoded admin data to request for use in subsequent middleware
    req.admin = decoded;
    
    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Handle invalid or expired tokens
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

/**
 * Middleware to verify admin role and permissions
 * 
 * This middleware:
 * 1. Checks if user has admin privileges
 * 2. Verifies admin account is active
 * 3. Attaches admin data to request object
 * 
 * Note: This middleware should be used after verifyToken
 * 
 * @param {Object} req - Express request object (must have req.admin from verifyToken)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyAdmin = async (req, res, next) => {
  try {
    // Find admin in database using ID from verified token
    const admin = await Admin.findById(req.admin.id);
    
    // Check if admin exists and is active
    if (!admin || !admin.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }
    
    // Attach full admin data to request object
    req.adminData = admin;
    
    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Handle database errors or other server issues
    res.status(500).json({ 
      success: false, 
      message: 'Server error.' 
    });
  }
};

// Export middleware functions for use in routes
module.exports = { verifyToken, verifyAdmin };