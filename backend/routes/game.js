// Game API Routes - Handles game session management and emotion processing
// This module provides RESTful endpoints for:
// 1. Starting game sessions
// 2. Processing emotion data from games
// 3. Adapting game difficulty based on emotional state
// 4. Ending game sessions and collecting analytics

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/Users');

/**
 * POST /game/start
 * Starts a new game session for a user
 * 
 * Request Body:
 * - userId: User ID (can be MongoDB ObjectId or custom PID)
 * - gameName: Name of the game (optional, defaults to 'snake')
 * 
 * Response:
 * - success: boolean indicating if session was created
 * - sessionId: MongoDB ObjectId of the created session
 * - gameName: Name of the game
 * - message: Success message
 */
router.post('/game/start', async (req, res) => {
  try {
    // Extract userId and gameName from request body
    const { userId, gameName } = req.body;

    // Validate required fields - userId is mandatory
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: 'User ID is required' 
      });
    }

    // Find user by PID (custom identifier) or MongoDB ObjectId
    // This supports both internal MongoDB IDs and custom user identifiers
    let user = null;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      // If userId is a valid MongoDB ObjectId, search by _id
      user = await User.findById(userId);
    } else {
      // If userId is not a valid ObjectId, search by custom PID field
      user = await User.findOne({ pid: userId });
    }

    // Return error if user doesn't exist in database
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Validate game type according to schema - only specific games are supported
    const validGames = ['snake', 'wordcatcher']; // Supported game types
    const gameType = gameName || 'snake'; // Default to snake game if not specified
    if (gameName && !validGames.includes(gameType)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid game type. Supported games: ' + validGames.join(', ')
      });
    }

    // Close any existing active sessions for this user to prevent multiple active sessions
    // This ensures only one game session is active per user at any time
    await Session.updateMany(
      { userId: userId, isActive: true },
      { isActive: false, endTime: new Date() }
    );

    // Create new session according to Session model schema
    const session = new Session({
      userId: user._id, // Use MongoDB ObjectId for consistency
      gameName: gameName || 'Snake Word Game', // Default game name
      roundsPlayed: 0, // Initialize rounds counter
      durationSeconds: 0, // Initialize duration counter
      emotionSamples: [] // Initialize empty emotion samples array
    });

    // Save session to database
    await session.save();

    // Return success response with session details
    res.json({
      success: true,
      sessionId: session._id,
      gameName: session.gameName,
      message: 'Game session started successfully'
    });
  } catch (error) {
    console.error('Error starting game session:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to start game session' 
    });
  }
});

/**
 * POST /game/emotion
 * Submit emotion data and get next difficulty level
 * 
 * Request Body:
 * - userId: User ID (MongoDB ObjectId or custom PID)
 * - sessionId: Session ID (MongoDB ObjectId)
 * - emotion: Detected emotion (one of 7 basic emotions)
 * - confidence: Confidence score (0-1)
 * - word: Current word being processed
 * - difficulty: Current difficulty level (easy/medium/hard)
 * 
 * Response:
 * - success: boolean indicating if emotion was processed
 * - next_difficulty: Recommended difficulty for next round
 * - difficulty_changed: boolean indicating if difficulty was adjusted
 * - emotion_recorded: The emotion that was recorded
 * - confidence: The confidence score used
 * - word_recorded: The word that was recorded
 * - session_id: The session ID
 * - total_samples: Total number of emotion samples in session
 * - message: Status message
 */
router.post('/game/emotion', async (req, res) => {
  try {
    const { userId, sessionId, emotion, confidence, word, difficulty } = req.body;

    // Validate required fields
    if (!userId || !sessionId || !emotion || !word) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: userId, sessionId, emotion, word' 
      });
    }

    // Validate sessionId format
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid session ID format' 
      });
    }

    // Validate confidence range (0-1)
    if (confidence !== undefined && (confidence < 0 || confidence > 1)) {
      return res.status(400).json({ 
        success: false,
        error: 'Confidence must be between 0 and 1' 
      });
    }

    // Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ 
        success: false,
        error: 'Session not found' 
      });
    }

    // Validate that userId matches session
    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false,
        error: 'User ID does not match session' 
      });
    }

    // Validate emotion types
    const validEmotions = ['happy', 'sad', 'angry', 'fearful', 'surprised', 'disgusted', 'neutral', 
                          'frustrated', 'excited', 'confident', 'anxious', 'calm', 'focused', 'proud',
                          'fear', 'sadness', 'anger', 'frustration', 'disgust', 'surprise', 'joy'];
    const emotionLower = emotion.toLowerCase();
    if (!validEmotions.includes(emotionLower)) {
      console.warn(`Invalid emotion received: ${emotion}. Supported emotions: ${validEmotions.join(', ')}`);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid emotion type. Supported emotions: ' + validEmotions.join(', ')
      });
    }

    // Validate difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    const currentDifficulty = difficulty || 'easy';
    if (!validDifficulties.includes(currentDifficulty)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid difficulty. Must be: easy, medium, or hard' 
      });
    }

    // Create emotion sample data
    const emotionSample = {
      word: word,
      difficulty: currentDifficulty,
      emotion: emotionLower,
      confidence: confidence || 0.5
    };

    // Add emotion sample to session
    console.log('📊 Adding emotion sample to session:', emotionSample);
    session.emotionSamples.push(emotionSample);
    session.roundsPlayed = session.emotionSamples.length;

    const savedSession = await session.save();
    console.log('✅ Session saved successfully. Total samples:', savedSession.emotionSamples.length);

    // Determine next difficulty based on emotion
    let nextDifficulty = currentDifficulty;
    let difficultyChanged = false;

    const positiveEmotions = ['happy', 'excited', 'confident', 'proud', 'calm', 'focused', 'joy'];
    const negativeEmotions = ['sad', 'frustrated', 'angry', 'anxious', 'fearful', 'fear', 'sadness', 'anger', 'frustration'];

    const confidenceThreshold = confidence || 0.5;

    if (positiveEmotions.includes(emotionLower)) {
      // Player seems happy/confident - can handle more challenge
      if (currentDifficulty === 'easy' && confidenceThreshold > 0.7) {
        nextDifficulty = 'medium';
        difficultyChanged = true;
      } else if (currentDifficulty === 'medium' && confidenceThreshold > 0.8) {
        nextDifficulty = 'hard';
        difficultyChanged = true;
      }
    } else if (negativeEmotions.includes(emotionLower)) {
      // Player seems frustrated/struggling - reduce challenge
      if (currentDifficulty === 'hard' && confidenceThreshold > 0.6) {
        nextDifficulty = 'medium';
        difficultyChanged = true;
      } else if (currentDifficulty === 'medium' && confidenceThreshold > 0.7) {
        nextDifficulty = 'easy';
        difficultyChanged = true;
      }
    }

    res.json({
      success: true,
      next_difficulty: nextDifficulty,
      difficulty_changed: difficultyChanged,
      emotion_recorded: emotionLower,
      confidence: confidenceThreshold,
      word_recorded: word,
      session_id: sessionId,
      total_samples: session.emotionSamples.length,
      message: difficultyChanged 
        ? `Emotion data saved. Difficulty adjusted to ${nextDifficulty} based on emotion: ${emotionLower}`
        : `Emotion data saved. Difficulty maintained at ${nextDifficulty}`
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
    const { sessionId, durationSeconds } = req.body;

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

    // Find session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ 
        success: false,
        error: 'Session not found' 
      });
    }

    // Update session with end data
    if (durationSeconds) {
      session.durationSeconds = durationSeconds;
    }

    await session.save();

    res.json({ 
      success: true,
      message: 'Game session ended successfully',
      session_summary: {
        duration_seconds: session.durationSeconds || 0,
        total_samples: session.emotionSamples.length,
        rounds_played: session.roundsPlayed || 0,
        game_name: session.gameName
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

    // Find session
    const session = await Session.findById(sessionId)
      .populate('userId', 'name email pid')
      .lean();

    if (!session) {
      return res.status(404).json({ 
        success: false,
        error: 'Session not found' 
      });
    }

    // Calculate session statistics from emotionSamples array
    const emotionSamples = session.emotionSamples || [];
    const stats = {
      total_emotions_recorded: emotionSamples.length,
      average_confidence: emotionSamples.length > 0 
        ? (emotionSamples.reduce((sum, sample) => sum + sample.confidence, 0) / emotionSamples.length).toFixed(2)
        : 0,
      emotion_distribution: {},
      difficulty_progression: emotionSamples.map((sample, index) => ({
        order: index + 1,
        word: sample.word,
        difficulty: sample.difficulty,
        emotion: sample.emotion
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

// Simplified emotion submission for current active session (auto-creates session if needed)
router.post('/game/submit-emotion-simple', async (req, res) => {
  try {
    const { userId, emotion, confidence, word, difficulty } = req.body;

    if (!userId || !emotion) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: userId, emotion' 
      });
    }

    // Find user to get their information
    let user = null;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ pid: userId });
    }

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Create new session for each playthrough
    const session = new Session({
      userId: user._id,
      gameName: 'Snake Word Game',
      roundsPlayed: 0,
      durationSeconds: 0,
      emotionSamples: []
    });
    await session.save();

    // Validate emotion types
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

    const currentWord = word || 'word_1';
    const currentDifficulty = difficulty || 'easy';

    // Create emotion sample data
    const emotionSample = {
      word: currentWord,
      difficulty: currentDifficulty,
      emotion: emotionLower,
      confidence: confidence || 0.5
    };

    // Add emotion sample to session
    console.log('📊 Adding emotion sample to session:', emotionSample);
    session.emotionSamples.push(emotionSample);
    session.roundsPlayed = session.emotionSamples.length;

    const savedSession = await session.save();
    console.log('✅ Session saved successfully. Total samples:', savedSession.emotionSamples.length);

    // Determine next difficulty based on emotion
    let nextDifficulty = currentDifficulty;
    let difficultyChanged = false;

    const positiveEmotions = ['happy', 'excited', 'confident', 'proud', 'calm', 'focused'];
    const negativeEmotions = ['sad', 'frustrated', 'angry', 'anxious', 'fearful', 'fear', 'sadness', 'anger', 'frustration'];
    const confidenceLevel = confidence || 0.5;

    if (positiveEmotions.includes(emotionLower)) {
      if (currentDifficulty === 'easy' && confidenceLevel > 0.7) {
        nextDifficulty = 'medium';
        difficultyChanged = true;
      } else if (currentDifficulty === 'medium' && confidenceLevel > 0.8) {
        nextDifficulty = 'hard';
        difficultyChanged = true;
      }
    } else if (negativeEmotions.includes(emotionLower)) {
      if (currentDifficulty === 'hard' && confidenceLevel > 0.6) {
        nextDifficulty = 'medium';
        difficultyChanged = true;
      } else if (currentDifficulty === 'medium' && confidenceLevel > 0.7) {
        nextDifficulty = 'easy';
        difficultyChanged = true;
      }
    }

    res.json({
      success: true,
      sessionId: session._id,
      difficulty: nextDifficulty,
      difficultyName: nextDifficulty,
      difficulty_changed: difficultyChanged,
      emotion: emotionLower,
      confidence: confidenceLevel,
      word: currentWord,
      total_samples: session.emotionSamples.length,
      message: `Emotion ${emotionLower} recorded${difficultyChanged ? `. Difficulty adjusted to ${nextDifficulty}` : ''}`
    });

  } catch (error) {
    console.error('Error submitting emotion:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        error: 'Validation error: ' + errors.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to submit emotion data' 
    });
  }
});

// Get current active session for a user (most recent session)
router.get('/game/current-session/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: 'User ID is required' 
      });
    }

    // Find user to validate
    let user = null;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ pid: userId });
    }

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Find most recent session for this user
    const session = await Session.findOne({ 
      userId: user._id
    })
    .populate('userId', 'name email pid')
    .sort({ createdAt: -1 });

    if (!session) {
      return res.json({
        success: true,
        session: null,
        message: 'No session found'
      });
    }

    res.json({
      success: true,
      session: {
        sessionId: session._id,
        userId: session.userId,
        gameName: session.gameName,
        roundsPlayed: session.roundsPlayed,
        durationSeconds: session.durationSeconds,
        totalSamples: session.emotionSamples.length,
        recentEmotions: session.emotionSamples.slice(-10), // Get last 10 emotion samples
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching current session:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch current session' 
    });
  }
});

module.exports = router;
