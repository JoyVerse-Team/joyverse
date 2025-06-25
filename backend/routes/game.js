const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const EmotionSample = require('../models/EmotionSample');

// Start a new game session
router.post('/game/start', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Create new session
    const session = new Session({
      userId,
      startTime: new Date(),
      difficulty: 'medium', // Default starting difficulty
      isActive: true
    });

    await session.save();

    res.json({
      session_id: session._id,
      initial_difficulty: session.difficulty,
      message: 'Game session started successfully'
    });
  } catch (error) {
    console.error('Error starting game session:', error);
    res.status(500).json({ error: 'Failed to start game session' });
  }
});

// Submit emotion data and get next difficulty
router.post('/game/emotion', async (req, res) => {
  try {
    const { userId, sessionId, emotion, confidence, roundNumber, word, timeTaken } = req.body;

    if (!userId || !sessionId || !emotion) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Create emotion sample
    const emotionSample = new EmotionSample({
      sessionId,
      userId,
      emotion,
      confidence: confidence || 0.5,
      roundNumber: roundNumber || 1,
      word: word || '',
      timeTaken: timeTaken || 0,
      timestamp: new Date()
    });

    await emotionSample.save();

    // Determine next difficulty based on emotion
    let nextDifficulty = session.difficulty;
    let difficultyChanged = false;

    // Emotion-based difficulty adaptation logic
    const positiveEmotions = ['happy', 'excited', 'confident', 'proud'];
    const negativeEmotions = ['sad', 'frustrated', 'angry', 'anxious', 'fearful'];
    const neutralEmotions = ['neutral', 'calm', 'focused'];

    if (positiveEmotions.includes(emotion.toLowerCase())) {
      // Player seems happy/confident - can handle more challenge
      if (session.difficulty === 'easy' && confidence > 0.7) {
        nextDifficulty = 'medium';
        difficultyChanged = true;
      } else if (session.difficulty === 'medium' && confidence > 0.8) {
        nextDifficulty = 'hard';
        difficultyChanged = true;
      }
    } else if (negativeEmotions.includes(emotion.toLowerCase())) {
      // Player seems frustrated/struggling - reduce challenge
      if (session.difficulty === 'hard' && confidence > 0.6) {
        nextDifficulty = 'medium';
        difficultyChanged = true;
      } else if (session.difficulty === 'medium' && confidence > 0.7) {
        nextDifficulty = 'easy';
        difficultyChanged = true;
      }
    }
    // Neutral emotions maintain current difficulty

    // Update session difficulty if changed
    if (difficultyChanged) {
      session.difficulty = nextDifficulty;
      await session.save();
    }

    res.json({
      next_difficulty: nextDifficulty,
      difficulty_changed: difficultyChanged,
      message: difficultyChanged 
        ? `Difficulty adjusted to ${nextDifficulty} based on detected emotion: ${emotion}`
        : `Difficulty maintained at ${nextDifficulty}`
    });

  } catch (error) {
    console.error('Error processing emotion data:', error);
    res.status(500).json({ error: 'Failed to process emotion data' });
  }
});

// End game session
router.post('/game/end', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Find and update session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.endTime = new Date();
    session.isActive = false;
    await session.save();

    res.json({ message: 'Game session ended successfully' });
  } catch (error) {
    console.error('Error ending game session:', error);
    res.status(500).json({ error: 'Failed to end game session' });
  }
});

// Update difficulty based on emotion only (for real-time difficulty adaptation)
router.post('/game/update-difficulty', async (req, res) => {
  try {
    const { emotion } = req.body;

    if (!emotion) {
      return res.status(400).json({ error: 'Emotion is required' });
    }

    // Determine difficulty based on emotion
    let difficulty = 'medium'; // default

    // Emotion-based difficulty adaptation logic
    const positiveEmotions = ['happy', 'excited', 'confident', 'proud'];
    const negativeEmotions = ['sad', 'frustrated', 'angry', 'anxious', 'fearful', 'fear', 'sadness', 'anger', 'frustration'];
    const neutralEmotions = ['neutral', 'calm', 'focused'];

    if (positiveEmotions.includes(emotion.toLowerCase())) {
      // Player seems happy/confident - can handle more challenge
      difficulty = 'hard';
    } else if (negativeEmotions.includes(emotion.toLowerCase())) {
      // Player seems frustrated/struggling - reduce challenge
      difficulty = 'easy';
    } else {
      // Neutral emotions maintain medium difficulty
      difficulty = 'medium';
    }

    res.json({
      difficulty: difficulty,
      emotion: emotion,
      message: `Difficulty set to ${difficulty} based on detected emotion: ${emotion}`
    });

  } catch (error) {
    console.error('Error updating difficulty based on emotion:', error);
    res.status(500).json({ error: 'Failed to update difficulty based on emotion' });
  }
});

module.exports = router;
