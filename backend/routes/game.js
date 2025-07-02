const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Session = require('../models/Session');
const EmotionSample = require('../models/EmotionSample');
const User = require('../models/Users');

// Start a new game session
router.post('/game/start', async (req, res) => {
  try {
    const { userId, therapistId, game } = req.body;

    // Validate required fields according to Session model
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: 'User ID is required' 
      });
    }

    // Validate userId exists in Users collection
    const user = await User.findOne({ pid: userId });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Validate therapistId if provided
    if (therapistId && !mongoose.Types.ObjectId.isValid(therapistId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid therapist ID format' 
      });
    }

    // Validate game type according to schema
    const validGames = ['snake']; // Add more games as they're implemented
    const gameType = game || 'snake';
    if (!validGames.includes(gameType)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid game type. Supported games: ' + validGames.join(', ')
      });
    }

    // Close any existing active sessions for this user
    await Session.updateMany(
      { userId: userId, isActive: true },
      { isActive: false, endTime: new Date() }
    );

    // Create new session according to Session model schema
    const session = new Session({
      userId,
      therapistId: therapistId || user.therapistId,
      game: gameType,
      startTime: new Date(),
      difficulty: 'medium', // Default starting difficulty as per schema
      isActive: true,
      rounds: [] // Initialize empty rounds array
    });

    await session.save();

    res.json({
      success: true,
      session_id: session._id,
      initial_difficulty: session.difficulty,
      game: session.game,
      message: 'Game session started successfully'
    });
  } catch (error) {
    console.error('Error starting game session:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        error: 'Validation error: ' + errors.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to start game session' 
    });
  }
});
  
// Submit emotion data and get next difficulty
router.post('/game/emotion', async (req, res) => {
  try {
    const { userId, sessionId, emotion, confidence, roundNumber, word, timeTaken } = req.body;

    // Validate required fields according to EmotionSample model
    if (!userId || !sessionId || !emotion) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: userId, sessionId, emotion' 
      });
    }

    // Validate sessionId format
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid session ID format' 
      });
    }

    // Validate confidence range according to schema (0-1)
    if (confidence !== undefined && (confidence < 0 || confidence > 1)) {
      return res.status(400).json({ 
        success: false,
        error: 'Confidence must be between 0 and 1' 
      });
    }

    // Find the session and validate it exists and is active
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ 
        success: false,
        error: 'Session not found' 
      });
    }

    if (!session.isActive) {
      return res.status(400).json({ 
        success: false,
        error: 'Session is not active' 
      });
    }

    // Validate that userId matches session
    if (session.userId !== userId) {
      return res.status(403).json({ 
        success: false,
        error: 'User ID does not match session' 
      });
    }

    // Validate emotion types (you can expand this list)
    const validEmotions = ['happy', 'sad', 'angry', 'fearful', 'surprised', 'disgusted', 'neutral', 
                          'frustrated', 'excited', 'confident', 'anxious', 'calm', 'focused', 'proud',
                          'fear', 'sadness', 'anger', 'frustration'];
    if (!validEmotions.includes(emotion.toLowerCase())) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid emotion type. Supported emotions: ' + validEmotions.join(', ')
      });
    }

    // Create emotion sample according to EmotionSample model schema
    const emotionSample = new EmotionSample({
      sessionId,
      userId,
      emotion: emotion.toLowerCase(),
      confidence: confidence || 0.5, // Default as per schema
      roundNumber: roundNumber || 1,  // Default as per schema
      word: word || '',
      timeTaken: timeTaken || 0,
      timestamp: new Date()  // Default as per schema
    });

    await emotionSample.save();

    // Determine next difficulty based on emotion (according to Session schema enum)
    let nextDifficulty = session.difficulty;
    let difficultyChanged = false;

    // Emotion-based difficulty adaptation logic
    const positiveEmotions = ['happy', 'excited', 'confident', 'proud', 'calm', 'focused'];
    const negativeEmotions = ['sad', 'frustrated', 'angry', 'anxious', 'fearful', 'fear', 'sadness', 'anger', 'frustration'];
    const neutralEmotions = ['neutral'];

    const emotionLower = emotion.toLowerCase();
    const confidenceThreshold = confidence || 0.5;

    if (positiveEmotions.includes(emotionLower)) {
      // Player seems happy/confident - can handle more challenge
      if (session.difficulty === 'easy' && confidenceThreshold > 0.7) {
        nextDifficulty = 'medium';
        difficultyChanged = true;
      } else if (session.difficulty === 'medium' && confidenceThreshold > 0.8) {
        nextDifficulty = 'hard';
        difficultyChanged = true;
      }
    } else if (negativeEmotions.includes(emotionLower)) {
      // Player seems frustrated/struggling - reduce challenge
      if (session.difficulty === 'hard' && confidenceThreshold > 0.6) {
        nextDifficulty = 'medium';
        difficultyChanged = true;
      } else if (session.difficulty === 'medium' && confidenceThreshold > 0.7) {
        nextDifficulty = 'easy';
        difficultyChanged = true;
      }
    }
    // Neutral emotions maintain current difficulty

    // Update session difficulty if changed and add to rounds
    if (difficultyChanged) {
      session.difficulty = nextDifficulty;
    }

    // Add/update round data in session according to Session schema
    const currentRound = roundNumber || 1;
    const existingRoundIndex = session.rounds.findIndex(r => r.roundNumber === currentRound);
    
    const roundData = {
      roundNumber: currentRound,
      word: word || '',
      difficulty: nextDifficulty,
      timeTakenSeconds: timeTaken || 0,
      finalEmotion: emotionLower,
      emotionSampleIds: [emotionSample._id]
    };

    if (existingRoundIndex >= 0) {
      // Update existing round
      session.rounds[existingRoundIndex] = roundData;
    } else {
      // Add new round
      session.rounds.push(roundData);
    }

    // Update total words if this is a completed word
    if (word) {
      session.totalWords = session.rounds.length;
    }

    await session.save();

    res.json({
      success: true,
      next_difficulty: nextDifficulty,
      difficulty_changed: difficultyChanged,
      emotion_recorded: emotionLower,
      confidence: confidenceThreshold,
      round_number: currentRound,
      message: difficultyChanged 
        ? `Difficulty adjusted to ${nextDifficulty} based on detected emotion: ${emotionLower}`
        : `Difficulty maintained at ${nextDifficulty}`
    });

  } catch (error) {
    console.error('Error processing emotion data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        error: 'Validation error: ' + errors.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to process emotion data' 
    });
  }
});

// End game session
router.post('/game/end', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        success: false,
        error: 'Session ID is required' 
      });
    }

    // Validate sessionId format
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid session ID format' 
      });
    }

    // Find and update session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ 
        success: false,
        error: 'Session not found' 
      });
    }

    if (!session.isActive) {
      return res.status(400).json({ 
        success: false,
        error: 'Session is already ended' 
      });
    }

    // Calculate session duration according to Session schema
    const endTime = new Date();
    const durationInSeconds = Math.floor((endTime - session.startTime) / 1000);

    // Update session with end data
    session.endTime = endTime;
    session.isActive = false;
    session.durationInSeconds = durationInSeconds;
    
    // Update totalWords if not already set
    if (!session.totalWords) {
      session.totalWords = session.rounds.length;
    }

    await session.save();

    res.json({ 
      success: true,
      message: 'Game session ended successfully',
      session_summary: {
        duration_seconds: durationInSeconds,
        total_words: session.totalWords,
        rounds_completed: session.rounds.length,
        final_difficulty: session.difficulty
      }
    });
  } catch (error) {
    console.error('Error ending game session:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to end game session' 
    });
  }
});

// Update difficulty based on emotion only (for real-time difficulty adaptation)
router.post('/game/update-difficulty', async (req, res) => {
  try {
    const { emotion, confidence } = req.body;

    if (!emotion) {
      return res.status(400).json({ 
        success: false,
        error: 'Emotion is required' 
      });
    }

    // Validate emotion types according to our supported list
    const validEmotions = ['happy', 'sad', 'angry', 'fearful', 'surprised', 'disgusted', 'neutral', 
                          'frustrated', 'excited', 'confident', 'anxious', 'calm', 'focused', 'proud',
                          'fear', 'sadness', 'anger', 'frustration'];
    
    const emotionLower = emotion.toLowerCase();
    if (!validEmotions.includes(emotionLower)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid emotion type. Supported emotions: ' + validEmotions.join(', ')
      });
    }

    // Validate confidence if provided
    if (confidence !== undefined && (confidence < 0 || confidence > 1)) {
      return res.status(400).json({ 
        success: false,
        error: 'Confidence must be between 0 and 1' 
      });
    }

    // Determine difficulty based on emotion (according to Session schema enum: easy, medium, hard)
    let difficulty = 'medium'; // default
    const confidenceLevel = confidence || 0.5;

    // Emotion-based difficulty adaptation logic
    const positiveEmotions = ['happy', 'excited', 'confident', 'proud', 'calm', 'focused'];
    const negativeEmotions = ['sad', 'frustrated', 'angry', 'anxious', 'fearful', 'fear', 'sadness', 'anger', 'frustration'];
    const neutralEmotions = ['neutral'];

    if (positiveEmotions.includes(emotionLower)) {
      // Player seems happy/confident - can handle more challenge
      difficulty = confidenceLevel > 0.7 ? 'hard' : 'medium';
    } else if (negativeEmotions.includes(emotionLower)) {
      // Player seems frustrated/struggling - reduce challenge
      difficulty = confidenceLevel > 0.6 ? 'medium' : 'easy';
    } else {
      // Neutral emotions maintain medium difficulty
      difficulty = 'medium';
    }

    res.json({
      success: true,
      difficulty: difficulty,
      emotion: emotionLower,
      confidence: confidenceLevel,
      message: `Difficulty set to ${difficulty} based on detected emotion: ${emotionLower} (confidence: ${(confidenceLevel * 100).toFixed(1)}%)`
    });

  } catch (error) {
    console.error('Error updating difficulty based on emotion:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update difficulty based on emotion' 
    });
  }
});

// Get session details with emotion samples (for therapists and analytics)
router.get('/game/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Validate sessionId format
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid session ID format' 
      });
    }

    // Find session with populated emotion samples
    const session = await Session.findById(sessionId)
      .populate('therapistId', 'name email')
      .lean();

    if (!session) {
      return res.status(404).json({ 
        success: false,
        error: 'Session not found' 
      });
    }

    // Get all emotion samples for this session
    const emotionSamples = await EmotionSample.find({ sessionId })
      .sort({ timestamp: 1 })
      .lean();

    // Calculate session statistics
    const stats = {
      total_emotions_recorded: emotionSamples.length,
      average_confidence: emotionSamples.length > 0 
        ? (emotionSamples.reduce((sum, sample) => sum + sample.confidence, 0) / emotionSamples.length).toFixed(2)
        : 0,
      emotion_distribution: {},
      difficulty_progression: session.rounds.map(round => ({
        round: round.roundNumber,
        difficulty: round.difficulty,
        emotion: round.finalEmotion
      }))
    };

    // Calculate emotion distribution
    emotionSamples.forEach(sample => {
      stats.emotion_distribution[sample.emotion] = (stats.emotion_distribution[sample.emotion] || 0) + 1;
    });

    res.json({
      success: true,
      session: {
        ...session,
        emotion_samples: emotionSamples,
        statistics: stats
      }
    });

  } catch (error) {
    console.error('Error fetching session details:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch session details' 
    });
  }
});

module.exports = router;
