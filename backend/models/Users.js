/**
 * User Model - MongoDB Schema for Child Users
 * 
 * This model represents child users in the Joyverse application.
 * Children are the primary users who play games and generate emotion data.
 * 
 * Schema Fields:
 * - pid: Unique identifier for the child (Player ID)
 * - name: Child's display name
 * - age: Child's age (used for age-appropriate content)
 * - gender: Child's gender (optional, for personalization)
 * - email: Child's email address (unique, required)
 * - passwordHash: Hashed password for authentication
 * - therapistId: Reference to assigned therapist (optional)
 * 
 * Relationships:
 * - Many-to-One with Therapist (one therapist can have multiple children)
 * - One-to-Many with Session (one child can have multiple game sessions)
 */

const mongoose = require('mongoose');

// Define the schema for child users
const userSchema = new mongoose.Schema({
  // Unique player identifier - used for easy identification
  pid: { 
    type: String, 
    required: true, 
    unique: true,
    index: true // Add index for faster queries
  },
  
  // Child's display name
  name: {
    type: String,
    trim: true // Remove whitespace
  },
  
  // Child's age - used for age-appropriate content and analytics
  age: {
    type: Number,
    min: 3, // Minimum age for the application
    max: 18 // Maximum age for child users
  },
  
  // Child's gender - optional field for personalization
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    lowercase: true
  },
  
  // Email address - required and unique
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  
  // Hashed password for authentication
  passwordHash: {
    type: String,
    required: true
  },
  
  // Reference to assigned therapist (optional)
  therapistId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Therapist',
    index: true
  }
}, {
  // Add timestamps for created and updated dates
  timestamps: true,
  
  // Add version key for document versioning (default is '__v')
  versionKey: '__v'
});

// Create compound index for efficient queries
userSchema.index({ pid: 1, email: 1 });

// Export the User model
module.exports = mongoose.model('User', userSchema);
