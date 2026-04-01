const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

// GET /api/admin/analytics - Admin analytics dashboard
router.get('/analytics', auth, isAdmin, adminController.getAnalytics);

// User Management
router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.get('/users/:userId', auth, isAdmin, adminController.getUserDetails);
router.delete('/users/:userId', auth, isAdmin, adminController.deleteUser);

// Certificate Management
router.get('/certificates', auth, isAdmin, adminController.getAllCertificates);

module.exports = router;
