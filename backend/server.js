/**
 * ===============================================================
 * JoyVerse Backend Server - Main Application Entry Point
 * ===============================================================
 * 
 * This is the central server file that:
 * 1. Configures Express.js application with middleware
 * 2. Establishes MongoDB database connection with retry logic
 * 3. Sets up API routes for authentication, games, therapists, and admin
 * 4. Provides error handling and graceful shutdown
 * 
 * Port Configuration:
 * - Default: 5000 (configurable via environment variable)
 * - Frontend connects to this server for all API requests
 * - Handles CORS for frontend-backend communication
 * 
 * Database:
 * - Uses MongoDB with Mongoose ODM
 * - Implements connection retry logic for reliability
 * - Graceful shutdown on process termination
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Import route modules for different API endpoints
const authRoutes = require('./routes/auth');           // User authentication & registration
const gameRoutes = require('./routes/game');           // Game session management & emotions
const therapistRoutes = require('./routes/therapist'); // Therapist dashboard & analytics
const adminRoutes = require('./routes/admin');         // Admin panel for therapist approval

const app = express();
const PORT = process.env.PORT || 5000; // Default to port 5000 if not specified

// ===============================================================
// MIDDLEWARE CONFIGURATION
// ===============================================================

// Enable Cross-Origin Resource Sharing (CORS) for frontend communication
app.use(cors());

// Parse incoming JSON payloads (for API requests)
app.use(express.json());

// ===============================================================
// DATABASE CONNECTION WITH RETRY LOGIC
// ===============================================================

/**
 * Establishes MongoDB connection with automatic retry mechanism
 * @param {number} retries - Number of retry attempts remaining
 */
const connectDB = async (retries = 5) => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    console.log('🔗 Attempting MongoDB connection...');
    console.log('📍 Connection URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    
    // Connect to MongoDB with optimized settings
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,        // Use new URL parser
      useUnifiedTopology: true,     // Use new Server Discovery and Monitoring engine
      serverSelectionTimeoutMS: 10000,  // Timeout after 10 seconds
      socketTimeoutMS: 45000,       // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10,              // Maximum number of connections in the pool
      retryWrites: true,            // Retry failed writes
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database name:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);

    // Implement retry logic with exponential backoff
    if (retries > 0) {
      console.log(`🔄 Retrying connection... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000); // Wait 5 seconds before retry
    } else {
      console.error('❌ Failed to connect after multiple attempts');
      process.exit(1); // Exit if all retries failed
    }
  }
};

// ===============================================================
// INITIALIZE DATABASE CONNECTION
// ===============================================================

// Connect to database
connectDB();

// ===============================================================
// DATABASE EVENT HANDLERS
// ===============================================================

// MongoDB connection event handlers for monitoring
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected');
});

// ===============================================================
// GRACEFUL SHUTDOWN HANDLER
// ===============================================================

// Handle process termination gracefully
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📴 MongoDB connection closed through app termination');
  process.exit(0);
});

// ===============================================================
// API ROUTES CONFIGURATION
// ===============================================================

// Mount route handlers with appropriate prefixes
app.use('/api', authRoutes);           // Authentication routes: /api/signup, /api/login
app.use('/api', gameRoutes);           // Game routes: /api/game/start, /api/game/emotion
app.use('/api/therapist', therapistRoutes); // Therapist routes: /api/therapist/students
app.use('/api', adminRoutes);          // Admin routes: /api/admin/login

// ===============================================================
// BASIC HEALTH CHECK ENDPOINT
// ===============================================================

// Basic route to verify server is running
app.get('/', (req, res) => {
  res.json({ 
    message: 'Joyverse Backend API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ===============================================================
// START SERVER
// ===============================================================

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Access the API at: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});
