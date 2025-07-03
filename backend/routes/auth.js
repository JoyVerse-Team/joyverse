const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/Users');
const Therapist = require('../models/Therapist');

const router = express.Router();

// Signup Route - Only for users (dyslexic kids)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, age, gender, therapistUID } = req.body;

    // Validate required fields based on User model schema
    if (!name || !email || !password || !therapistUID) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: name, email, password, therapistUID'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate age if provided
    if (age && (typeof age !== 'number' || age < 1 || age > 18)) {
      return res.status(400).json({
        success: false,
        message: 'Age must be a number between 1 and 18'
      });
    }

    // Validate gender if provided
    if (gender && !['male', 'female', 'other'].includes(gender.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be: male, female, or other'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate that therapistUID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(therapistUID)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid therapist ID format. Please check with your therapist for the correct ID.'
      });
    }

    // Verify that the therapist exists
    const therapist = await Therapist.findById(therapistUID);
    if (!therapist) {
      return res.status(400).json({
        success: false,
        message: 'Invalid therapist ID. Please check with your therapist.'
      });
    }

    // Hash the password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate unique PID (you can customize this format)
    const pid = `USER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create new user using the User model schema
    const newUser = new User({
      pid,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      age: age || undefined,
      gender: gender ? gender.toLowerCase() : undefined,
      therapistId: therapistUID
    });

    // Save user and handle validation errors
    try {
      await newUser.save();
    } catch (saveError) {
      if (saveError.code === 11000) {
        // Duplicate key error
        const field = Object.keys(saveError.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message: `${field === 'pid' ? 'User ID' : field} already exists`
        });
      }
      throw saveError;
    }

    // Return success response (without password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        pid: newUser.pid,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        gender: newUser.gender,
        therapistId: newUser.therapistId,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during signup'
    });
  }
});

// Login Route - For both users and therapists
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    let user = null;
    let role = null;

    // Normalize email for consistent lookup
    const normalizedEmail = email.toLowerCase().trim();
    console.log('🔍 Login attempt for email:', normalizedEmail);

    // First, check if it's a user
    user = await User.findOne({ email: normalizedEmail }).populate('therapistId', 'name email');
    if (user) {
      role = 'user';
      console.log('✅ Found user:', user.name);
    } else {
      // If not found in users, check therapists
      user = await Therapist.findOne({ email: normalizedEmail });
      if (user) {
        role = 'therapist';
        console.log('✅ Found therapist:', user.name, 'stored password:', user.passwordHash);
      }
    }

    // If user not found in either collection
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Validate that user has required fields according to model
    if (!user.passwordHash) {
      return res.status(500).json({
        success: false,
        message: 'Account data incomplete. Please contact support.'
      });
    }

    // Compare password - different logic for therapists vs users
    let isPasswordValid = false;
    
    console.log('Login Debug Info:');
    console.log('- Role:', role);
    console.log('- User found:', !!user);
    console.log('- Email from request:', password); // Note: logging password for debugging - remove this later
    console.log('- Stored passwordHash:', user.passwordHash);
    console.log('- Password comparison (===):', password === user.passwordHash);
    
    if (role === 'therapist') {
      // For therapists, compare plain text passwords (as requested)
      isPasswordValid = password === user.passwordHash;
      console.log('- Therapist password check result:', isPasswordValid);
    } else {
      // For users (children), continue using bcrypt
      isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      console.log('- User bcrypt check result:', isPasswordValid);
    }
    
    if (!isPasswordValid) {
      console.log('- LOGIN FAILED: Password invalid');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Prepare response data based on role and model schema
    let responseData = {
      id: user._id,
      name: user.name || 'Unknown',
      email: user.email,
      role: role
    };

    // Add role-specific data according to User model schema
    if (role === 'user') {
      responseData.pid = user.pid;
      responseData.age = user.age;
      responseData.gender = user.gender;
      responseData.therapistId = user.therapistId?._id;
      responseData.therapistName = user.therapistId?.name;
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: responseData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// Create initial session after successful login (for immediate game readiness)
router.post('/create-session', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find user by PID or MongoDB ID
    let user = null;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ pid: userId });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Import Session model here to avoid circular dependencies
    const Session = require('../models/Session');

    // Close any existing active sessions for this user
    await Session.updateMany(
      { userId: user.pid, isActive: true },
      { isActive: false, endTime: new Date() }
    );

    // Create new session
    const session = new Session({
      userId: user.pid,
      therapistId: user.therapistId,
      game: 'snake',
      startTime: new Date(),
      difficulty: 'medium',
      isActive: true,
      rounds: []
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      session: {
        sessionId: session._id,
        userId: session.userId,
        therapistId: session.therapistId,
        difficulty: session.difficulty,
        game: session.game
      }
    });

  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during session creation'
    });
  }
});

// Optional: Route to get user profile (for authenticated users)
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Try to find in users first with populated therapist data
    let user = await User.findById(id)
      .select('-passwordHash')
      .populate('therapistId', 'name email');
    let role = 'user';

    if (!user) {
      // If not found in users, check therapists
      user = await Therapist.findById(id).select('-passwordHash');
      role = 'therapist';
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prepare response according to model schemas
    let responseData = {
      ...user.toObject(),
      role: role
    };

    // For users, format the therapist data properly
    if (role === 'user' && user.therapistId) {
      responseData.therapist = {
        id: user.therapistId._id,
        name: user.therapistId.name,
        email: user.therapistId.email
      };
      // Remove the raw therapistId field since we have formatted therapist object
      delete responseData.therapistId;
    }

    res.status(200).json({
      success: true,
      user: responseData
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Therapist Signup Route - Store password without encryption/hashing
router.post('/therapist-signup', async (req, res) => {
  try {
    const { name, email, password, organization, license, experience, bio } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: name, email, password'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if therapist already exists
    const existingTherapist = await Therapist.findOne({ email: email.toLowerCase().trim() });
    if (existingTherapist) {
      return res.status(400).json({
        success: false,
        message: 'Therapist with this email already exists'
      });
    }

    // Create new therapist with plain text password (as requested)
    const newTherapist = new Therapist({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password, // Storing plain text password as requested
      organization: organization?.trim(),
      license: license?.trim(),
      experience: experience?.trim(),
      bio: bio?.trim()
    });

    // Save therapist
    try {
      await newTherapist.save();
    } catch (saveError) {
      if (saveError.code === 11000) {
        // Duplicate key error
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      throw saveError;
    }

    // Return success response (without password)
    res.status(201).json({
      success: true,
      message: 'Therapist application submitted successfully',
      user: {
        id: newTherapist._id,
        name: newTherapist.name,
        email: newTherapist.email,
        role: 'therapist'
      }
    });

  } catch (error) {
    console.error('Therapist signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during therapist signup'
    });
  }
});

module.exports = router;
