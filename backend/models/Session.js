const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist' },
  game: { type: String, default: 'snake' },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  isActive: { type: Boolean, default: true },
  durationInSeconds: Number,
  totalWords: Number,
  rounds: [
    {
      roundNumber: Number,
      word: String,
      difficulty: String,
      timeTakenSeconds: Number,
      finalEmotion: String,
      emotionSampleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EmotionSample' }]
    }
  ]
});

module.exports = mongoose.model('Session', sessionSchema);
