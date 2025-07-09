const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
    required: true,
    validate: {
      validator: function(v) {
        // Accept both ObjectId and string formats
        return mongoose.Types.ObjectId.isValid(v) || typeof v === 'string';
      },
      message: 'userId must be a valid ObjectId or string'
    }
  },
  gameName: String,
  roundsPlayed: Number,
  durationSeconds: Number,
  emotionSamples: [
    {
      word: String,
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
      emotion: String,
      confidence: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
