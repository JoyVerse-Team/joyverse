const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: String, // Will store plain text passwords dont forget to chamge later
  organization: String,
  license: String,
  experience: String,
  bio: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Therapist', therapistSchema);
