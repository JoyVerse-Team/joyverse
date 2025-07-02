const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/Users');
const Therapist = require('../models/Therapist');
const Session = require('../models/Session');
const EmotionSample = require('../models/EmotionSample');

const router = express.Router();

// Get all students (users) for a specific therapist
router.get('/students/:therapistId', async (req, res) => {
  try {
    const { therapistId } = req.params;

    // Validate therapistId format
    if (!mongoose.Types.ObjectId.isValid(therapistId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid therapist ID format'
      });
    }

    // Check if therapist exists
    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    // Get all users assigned to this therapist
    const students = await User.find({ therapistId: therapistId })
      .select('-passwordHash')
      .lean();

    // Get session statistics for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        // Get session count and average session time
        const sessions = await Session.find({ userId: student.pid });
        const totalSessions = sessions.length;
        
        // Calculate average session time
        const completedSessions = sessions.filter(s => s.endTime && s.startTime);
        const totalTime = completedSessions.reduce((sum, session) => {
          const duration = (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60); // minutes
          return sum + duration;
        }, 0);
        const averageTime = completedSessions.length > 0 ? Math.round(totalTime / completedSessions.length) : 0;

        // Get recent emotions (from last 10 emotion samples)
        const recentEmotions = await EmotionSample.find({ userId: student.pid })
          .sort({ timestamp: -1 })
          .limit(10)
          .select('emotion');

        // Get last session date
        const lastSession = sessions.length > 0 ? sessions.reduce((latest, session) => {
          return new Date(session.startTime) > new Date(latest.startTime) ? session : latest;
        }).startTime : null;

        return {
          id: student.pid,
          name: student.name,
          email: student.email,
          age: student.age,
          gender: student.gender,
          totalSessions,
          averageTime,
          recentEmotions: recentEmotions.map(e => e.emotion),
          lastSession: lastSession || student.createdAt || new Date()
        };
      })
    );

    res.status(200).json({
      success: true,
      students: studentsWithStats
    });

  } catch (error) {
    console.error('Error fetching therapist students:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all sessions for a specific student
router.get('/student/:studentId/sessions', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { therapistId } = req.query;

    // Validate therapistId if provided
    if (therapistId && !mongoose.Types.ObjectId.isValid(therapistId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid therapist ID format'
      });
    }

    // Find the student
    const student = await User.findOne({ pid: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // If therapistId is provided, ensure the student belongs to this therapist
    if (therapistId && student.therapistId.toString() !== therapistId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Student does not belong to this therapist'
      });
    }

    // Get all sessions for this student
    const sessions = await Session.find({ userId: studentId })
      .populate('therapistId', 'name')
      .sort({ startTime: -1 })
      .lean();

    // Format sessions with additional data
    const sessionsWithDetails = sessions.map((session, index) => {
      const duration = session.endTime && session.startTime 
        ? Math.round((new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60))
        : 0;

      return {
        id: session._id,
        sessionNumber: sessions.length - index, // Reverse numbering for chronological order
        gameTitle: session.game === 'snake' ? 'Snake Word Game' : session.game,
        studentName: student.name,
        timestamp: session.startTime,
        totalTime: duration,
        difficulty: session.difficulty,
        isActive: session.isActive,
        rounds: session.rounds || []
      };
    });

    res.status(200).json({
      success: true,
      sessions: sessionsWithDetails
    });

  } catch (error) {
    console.error('Error fetching student sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get detailed emotion data for a specific session
router.get('/session/:sessionId/emotions', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { therapistId } = req.query;

    // Validate sessionId format
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session ID format'
      });
    }

    // Get the session
    const session = await Session.findById(sessionId)
      .populate('therapistId', 'name')
      .lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // If therapistId is provided, ensure the session belongs to this therapist
    if (therapistId && session.therapistId._id.toString() !== therapistId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Session does not belong to this therapist'
      });
    }

    // Get all emotion samples for this session
    const emotionSamples = await EmotionSample.find({ sessionId: sessionId })
      .sort({ timestamp: 1 })
      .lean();

    // Get student info
    const student = await User.findOne({ pid: session.userId }).select('name pid');

    // Group emotion samples by round
    const roundsWithEmotions = session.rounds.map(round => {
      const roundEmotions = emotionSamples.filter(
        emotion => emotion.roundNumber === round.roundNumber
      );

      return {
        ...round,
        emotions: roundEmotions.map(emotion => ({
          id: emotion._id,
          timestamp: emotion.timestamp,
          emotion: emotion.emotion,
          confidence: emotion.confidence,
          word: emotion.word,
          timeTaken: emotion.timeTaken
        }))
      };
    });

    const sessionWithEmotions = {
      id: session._id,
      userId: session.userId,
      studentName: student ? student.name : 'Unknown Student',
      game: session.game,
      startTime: session.startTime,
      endTime: session.endTime,
      difficulty: session.difficulty,
      isActive: session.isActive,
      therapistName: session.therapistId ? session.therapistId.name : 'Unknown Therapist',
      rounds: roundsWithEmotions,
      totalEmotionSamples: emotionSamples.length
    };

    res.status(200).json({
      success: true,
      session: sessionWithEmotions
    });

  } catch (error) {
    console.error('Error fetching session emotions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get dashboard summary data for a therapist
router.get('/dashboard/:therapistId', async (req, res) => {
  try {
    const { therapistId } = req.params;

    // Validate therapistId format
    if (!mongoose.Types.ObjectId.isValid(therapistId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid therapist ID format'
      });
    }

    // Get therapist info
    const therapist = await Therapist.findById(therapistId).select('name email');
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    // Get all students for this therapist
    const students = await User.find({ therapistId: therapistId }).select('pid name');
    const studentIds = students.map(s => s.pid);

    // Get recent sessions (last 10 across all students)
    const recentSessions = await Session.find({ 
      userId: { $in: studentIds } 
    })
    .sort({ startTime: -1 })
    .limit(10)
    .lean();

    // Get weekly data (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // Get sessions for this day
      const daySessions = await Session.find({
        userId: { $in: studentIds },
        startTime: { $gte: date, $lt: nextDate }
      }).lean();

      // Get emotions for this day
      const dayEmotions = await EmotionSample.find({
        userId: { $in: studentIds },
        timestamp: { $gte: date, $lt: nextDate }
      }).lean();

      // Calculate total time for the day
      const totalTime = daySessions.reduce((sum, session) => {
        if (session.endTime && session.startTime) {
          const duration = (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60);
          return sum + duration;
        }
        return sum;
      }, 0);

      // Group emotions by type
      const emotionSummary = dayEmotions.reduce((acc, emotion) => {
        acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1;
        return acc;
      }, {});

      weeklyStats.push({
        date: date.toISOString(),
        sessions: daySessions.map(s => ({
          id: s._id,
          studentId: s.userId,
          game: s.game,
          duration: s.endTime && s.startTime 
            ? Math.round((new Date(s.endTime) - new Date(s.startTime)) / (1000 * 60))
            : 0
        })),
        totalTime: Math.round(totalTime),
        emotionSummary
      });
    }

    res.status(200).json({
      success: true,
      therapist: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email
      },
      summary: {
        totalStudents: students.length,
        totalSessions: recentSessions.length,
        weeklyStats
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
