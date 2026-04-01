// User Controller - Handles user-related operations
const User = require('../models/User');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user interests
exports.updateInterests = async (req, res) => {
  try {
    const { interests } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { interests },
      { new: true }
    ).select('-password');

    res.json({ 
      message: 'Interests updated successfully',
      user 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, experienceLevel } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, experienceLevel },
      { new: true }
    ).select('-password');

    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
