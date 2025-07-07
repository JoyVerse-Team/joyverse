const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/Users');
const Therapist = require('../models/Therapist');
const Session = require('../models/Session');

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
        const sessions = await Session.find({ userId: student._id });
        const totalSessions = sessions.length;
        
        // Calculate average session time
        const completedSessions = sessions.filter(s => s.durationSeconds && s.durationSeconds > 0);
        const totalTime = completedSessions.reduce((sum, session) => {
          return sum + (session.durationSeconds / 60); // Convert to minutes
        }, 0);
        const averageTime = completedSessions.length > 0 ? Math.round(totalTime / completedSessions.length) : 0;

        // Get recent emotions (from last sessions)
        const recentSessions = await Session.find({ userId: student._id })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('emotionSamples');

        const recentEmotions = [];
        recentSessions.forEach(session => {
          if (session.emotionSamples && session.emotionSamples.length > 0) {
            recentEmotions.push(...session.emotionSamples.slice(-2).map(sample => sample.emotion));
          }
        });

        // Get last session date
        const lastSession = sessions.length > 0 ? sessions.reduce((latest, session) => {
          return new Date(session.createdAt) > new Date(latest.createdAt) ? session : latest;
        }).createdAt : null;

        return {
          id: student.pid,
          name: student.name,
          email: student.email,
          age: student.age,
          gender: student.gender,
          totalSessions,
          averageTime,
          recentEmotions: recentEmotions.slice(0, 10), // Limit to 10 most recent emotions
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

    // Get all sessions for this student using the MongoDB ObjectId
    const sessions = await Session.find({ userId: student._id })
      .sort({ createdAt: -1 })
      .lean();

    // Format sessions with additional data
    const sessionsWithDetails = sessions.map((session, index) => {
      const duration = session.durationSeconds 
        ? Math.round(session.durationSeconds / 60) // Convert to minutes
        : 0;

      return {
        id: session._id,
        sessionNumber: sessions.length - index, // Reverse numbering for chronological order
        gameTitle: session.gameName || 'Snake Word Game',
        studentName: student.name,
        timestamp: session.createdAt,
        totalTime: duration,
        roundsPlayed: session.roundsPlayed || 0,
        totalSamples: session.emotionSamples ? session.emotionSamples.length : 0
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

    // Get all emotion samples from the session
    const emotionSamples = session.emotionSamples || [];

    // Get student info
    const student = await User.findById(session.userId).select('name pid');

    const sessionWithEmotions = {
      id: session._id,
      userId: session.userId,
      studentName: student ? student.name : 'Unknown Student',
      gameName: session.gameName,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      roundsPlayed: session.roundsPlayed,
      durationSeconds: session.durationSeconds,
      emotionSamples: emotionSamples.map((sample, index) => ({
        order: index + 1,
        word: sample.word,
        difficulty: sample.difficulty,
        emotion: sample.emotion,
        confidence: sample.confidence
      })),
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
      userId: { $in: students.map(s => s._id) } 
    })
    .sort({ createdAt: -1 })
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
        userId: { $in: students.map(s => s._id) },
        createdAt: { $gte: date, $lt: nextDate }
      }).lean();

      // Get emotions for this day from sessions
      const dayEmotions = [];
      daySessions.forEach(session => {
        if (session.emotionSamples && session.emotionSamples.length > 0) {
          dayEmotions.push(...session.emotionSamples);
        }
      });

      // Calculate total time for the day
      const totalTime = daySessions.reduce((sum, session) => {
        return sum + (session.durationSeconds || 0) / 60; // Convert to minutes
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
          gameName: s.gameName,
          duration: Math.round((s.durationSeconds || 0) / 60) // Convert to minutes
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

// Get all therapists (for debugging)
router.get('/list', async (req, res) => {
  try {
    const therapists = await Therapist.find({})
      .select('-passwordHash')
      .lean();

    res.status(200).json({
      success: true,
      therapists: therapists
    });

  } catch (error) {
    console.error('Error fetching therapists:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
