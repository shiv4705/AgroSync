import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import User from '../models/user.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/profiles'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  },
});

// Get current user profile
router.get('/profile', protect, async (req, res) => {
  try {
    // req.user is populated by the protect middleware
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', protect, upload.single('profileImage'), async (req, res) => {
  try {
    const { name, bio, location, mobile } = req.body;
    
    // Find user by UID
    const user = await User.findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update user fields
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (mobile) user.mobile = mobile;
    
    // Update profile image if uploaded
    if (req.file) {
      user.profileImage = `/uploads/profiles/${req.file.filename}`;
    }
    
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findOne({ uid: req.user.uid }).select('-password');
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user notifications
router.get('/notifications', protect, async (req, res) => {
  try {
    // This would typically fetch from a notifications collection.
    // For now, return empty array as placeholder.
    res.json({ success: true, notifications: [] });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user settings
router.get('/settings', protect, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).select('settings');
    
    // Default settings if none exist
    const settings = user.settings || {
      emailNotifications: false,
      publicProfile: false,
      showLocation: false
    };
    
    res.json({ success: true, ...settings });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user settings
router.put('/settings', protect, async (req, res) => {
  try {
    const { emailNotifications, publicProfile, showLocation } = req.body;
    
    const user = await User.findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Ensure settings object exists on user
    user.settings = user.settings || {};
    
    // Update settings
    if (emailNotifications !== undefined) user.settings.emailNotifications = emailNotifications;
    if (publicProfile !== undefined) user.settings.publicProfile = publicProfile;
    if (showLocation !== undefined) user.settings.showLocation = showLocation;
    
    await user.save();
    
    res.json({ success: true, ...user.settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export const profileRoutes = router;