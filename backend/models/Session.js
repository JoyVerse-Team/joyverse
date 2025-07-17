/**
 * Session Model - MongoDB Schema for Game Sessions
 * 
 * This model represents individual game sessions in the Joyverse application.
 * Each session tracks a child's gameplay, including emotion data, difficulty progression,
 * and performance metrics.
 * 
 * Schema Fields:
 * - userId: Reference to the child user playing the game
 * - gameName: Name of the game being played
 * - roundsPlayed: Number of rounds completed in the session
 * - durationSeconds: Total duration of the game session
 * - emotionSamples: Array of emotion data collected during gameplay
 * 
 * Emotion Sample Structure:
 * - word: The word being processed when emotion was detected
 * - difficulty: Current difficulty level (easy/medium/hard)
 * - emotion: Detected emotion (happy, sad, angry, fear, surprise, disgust, neutral)
 * - confidence: Confidence score of the emotion detection (0-1)
 * 
 * Relationships:
 * - Many-to-One with User (one user can have multiple sessions)
 * - Used by therapists for analyzing child's emotional patterns
 */

const mongoose = require('mongoose');

// Define the schema for game sessions
const sessionSchema = new mongoose.Schema({
  // Reference to the user who owns this session
  userId: { 
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String for flexibility
    required: true,
    validate: {
      validator: function(v) {
        // Accept both ObjectId and string formats for backward compatibility
        return mongoose.Types.ObjectId.isValid(v) || typeof v === 'string';
      },
      message: 'userId must be a valid ObjectId or string'
    },
    index: true // Add index for faster user session queries
  },
  
  // Name of the game being played
  gameName: {
    type: String,
    required: true,
    enum: ['Snake Word Game', 'Word Catcher', 'Bouncy Letters'], // Supported games
    default: 'Snake Word Game'
  },
  
  // Number of rounds/words completed in this session
  roundsPlayed: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Total duration of the game session in seconds
  durationSeconds: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Array of emotion samples collected during gameplay
  emotionSamples: [{
    // The word being processed when emotion was detected
    word: {
      type: String,
      required: true,
      trim: true
    },
    
    // Current difficulty level when emotion was detected
    difficulty: { 
      type: String, 
      enum: ['easy', 'medium', 'hard'],
      required: true,
      default: 'easy'
    },
    
    // Detected emotion (standardized to 7 basic emotions)
    emotion: {
      type: String,
      required: true,
      enum: ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral'],
      lowercase: true
    },
    
    // Confidence score of the emotion detection (0-1)
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: 0.5
    },
    
    // Timestamp when this emotion was recorded
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Session status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Session end time (set when session is completed)
  endTime: {
    type: Date
  }
}, { 
  // Add timestamps for created and updated dates
  timestamps: true,
  
  // Add version key for document versioning (default is '__v')
  versionKey: '__v'
});

// Create compound indexes for efficient queries
sessionSchema.index({ userId: 1, createdAt: -1 }); // For user's recent sessions
sessionSchema.index({ userId: 1, isActive: 1 }); // For active sessions
sessionSchema.index({ gameName: 1, createdAt: -1 }); // For game-specific analytics

// Virtual field to get total emotion samples count
sessionSchema.virtual('totalEmotionSamples').get(function() {
  return this.emotionSamples.length;
});

// Method to calculate average confidence for the session
sessionSchema.methods.getAverageConfidence = function() {
  if (this.emotionSamples.length === 0) return 0;
  
  const totalConfidence = this.emotionSamples.reduce((sum, sample) => sum + sample.confidence, 0);
  return totalConfidence / this.emotionSamples.length;
};

// Method to get emotion distribution for the session
sessionSchema.methods.getEmotionDistribution = function() {
  const distribution = {};
  
  this.emotionSamples.forEach(sample => {
    distribution[sample.emotion] = (distribution[sample.emotion] || 0) + 1;
  });
  
  return distribution;
};

// Export the Session model
module.exports = mongoose.model('Session', sessionSchema);
