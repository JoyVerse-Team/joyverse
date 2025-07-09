const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Therapist = require('../models/Therapist');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email, 
        role: admin.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get all therapists with filtering
router.get('/admin/therapists', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    const therapists = await Therapist.find(query)
      .populate('approvedBy', 'email')
      .sort({ requestDate: -1 });

    res.json({
      success: true,
      therapists: therapists.map(therapist => ({
        id: therapist._id,
        fullName: therapist.name,
        email: therapist.email,
        status: therapist.status,
        requestDate: therapist.requestDate,
        organization: therapist.organization,
        license: therapist.license,
        experience: therapist.experience,
        bio: therapist.bio,
        approvedBy: therapist.approvedBy?.email,
        approvedAt: therapist.approvedAt
      }))
    });

  } catch (error) {
    console.error('Get therapists error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching therapists'
    });
  }
});

// Approve therapist
router.post('/admin/therapists/:id/approve', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const therapist = await Therapist.findById(id);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    if (therapist.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Therapist has already been processed'
      });
    }

    therapist.status = 'approved';
    therapist.approvedBy = req.admin.id;
    therapist.approvedAt = new Date();
    await therapist.save();

    res.json({
      success: true,
      message: 'Therapist approved successfully',
      therapist: {
        id: therapist._id,
        fullName: therapist.name,
        email: therapist.email,
        status: therapist.status,
        approvedAt: therapist.approvedAt
      }
    });

  } catch (error) {
    console.error('Approve therapist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while approving therapist'
    });
  }
});

// Reject therapist
router.post('/admin/therapists/:id/reject', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const therapist = await Therapist.findById(id);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    if (therapist.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Therapist has already been processed'
      });
    }

    therapist.status = 'rejected';
    therapist.approvedBy = req.admin.id;
    therapist.approvedAt = new Date();
    if (reason) {
      therapist.rejectionReason = reason;
    }
    await therapist.save();

    res.json({
      success: true,
      message: 'Therapist rejected successfully',
      therapist: {
        id: therapist._id,
        fullName: therapist.name,
        email: therapist.email,
        status: therapist.status,
        rejectedAt: therapist.approvedAt
      }
    });

  } catch (error) {
    console.error('Reject therapist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting therapist'
    });
  }
});

// Get dashboard statistics
router.get('/admin/dashboard/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalTherapists = await Therapist.countDocuments();
    const pendingTherapists = await Therapist.countDocuments({ status: 'pending' });
    const approvedTherapists = await Therapist.countDocuments({ status: 'approved' });
    const rejectedTherapists = await Therapist.countDocuments({ status: 'rejected' });

    res.json({
      success: true,
      stats: {
        totalTherapists,
        pendingTherapists,
        approvedTherapists,
        rejectedTherapists
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
});

// Verify admin token (for frontend to check if user is still logged in)
router.get('/admin/verify', verifyToken, verifyAdmin, async (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    admin: {
      id: req.adminData._id,
      email: req.adminData.email,
      role: req.adminData.role
    }
  });
});

module.exports = router;
