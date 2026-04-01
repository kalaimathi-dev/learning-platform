// Authentication Controller - Handles user registration and login
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BADGES, ensureBadge } = require('../utils/badges');

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, interests, experienceLevel } = req.body;
    const normalizedInterests = Array.isArray(interests)
      ? interests.filter((item) => typeof item === 'string' && item.trim())
      : [];

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      interests: normalizedInterests,
      experienceLevel: experienceLevel || 'Beginner',
      lastLoginAt: new Date(),
      currentStreak: 1,
      longestStreak: 1
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token valid for 7 days
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests,
        experienceLevel: user.experienceLevel,
        badges: user.badges,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysBetween(a, b) {
  const diff = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Update login streak based on lastLoginAt
    const now = new Date();
    if (!user.lastLoginAt) {
      user.currentStreak = 1;
      user.longestStreak = Math.max(user.longestStreak || 0, 1);
    } else {
      const diffDays = daysBetween(user.lastLoginAt, now);
      if (diffDays === 1) {
        user.currentStreak = (user.currentStreak || 0) + 1;
        user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
      } else if (diffDays > 1) {
        user.currentStreak = 1;
        user.longestStreak = Math.max(user.longestStreak || 0, 1);
      }
      // diffDays === 0 -> same day login, don't increment
    }
    user.lastLoginAt = now;

    if ((user.currentStreak || 0) >= 7) {
      ensureBadge(user, BADGES.STREAK_7);
    }

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests,
        experienceLevel: user.experienceLevel,
        badges: user.badges,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses');
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
