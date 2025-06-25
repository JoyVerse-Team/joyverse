const mongoose = require('mongoose');

const emotionSampleSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  userId: { type: String, required: true },
  roundNumber: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now },
  emotion: { type: String, required: true },
  confidence: { type: Number, default: 0.5, min: 0, max: 1 },
  word: String,
  timeTaken: Number
});

module.exports = mongoose.model('EmotionSample', emotionSampleSchema);
