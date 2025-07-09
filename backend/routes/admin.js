const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Therapist = require('../models/Therapist');

const router = express.Router();

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin login attempt:', { email, password });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find admin by email or username
    const admin = await Admin.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() }
      ]
    });
    console.log('Found admin:', admin ? { id: admin._id, username: admin.username, email: admin.email } : null);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password (plain text comparison for admin as requested)
    const isPasswordValid = password === admin.password;
    console.log('Password check:', { provided: password, stored: admin.password, isValid: isPasswordValid });
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: admin._id,
        username: admin.username,
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
router.get('/admin/therapists', async (req, res) => {
  try {
    const { adminId, status } = req.query;
    
    // Simple admin check - in a real app you'd validate this properly
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    // Verify admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

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
router.post('/admin/therapists/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body;

    // Simple admin check
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    // Verify admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

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
    therapist.approvedBy = adminId;
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
router.post('/admin/therapists/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, adminId } = req.body;

    // Simple admin check
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    // Verify admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

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
    therapist.approvedBy = adminId;
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
router.get('/admin/dashboard/stats', async (req, res) => {
  try {
    const { adminId } = req.query;

    // Simple admin check
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    // Verify admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

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

module.exports = router;
