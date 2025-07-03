const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
