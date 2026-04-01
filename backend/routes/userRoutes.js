// User Routes
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

// GET /api/users - Get all users (Admin only)
router.get('/', auth, isAdmin, userController.getAllUsers);

// PUT /api/users/interests - Update user interests (protected)
router.put('/interests', auth, userController.updateInterests);

// PUT /api/users/profile - Update user profile (protected)
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
