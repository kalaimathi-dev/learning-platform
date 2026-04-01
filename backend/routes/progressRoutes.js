// Progress Routes
const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { auth } = require('../middleware/auth');

// All routes are protected (require authentication)

// GET /api/progress - Get all user progress
router.get('/', auth, progressController.getUserProgress);

// GET /api/progress/stats - Get dashboard statistics
router.get('/stats', auth, progressController.getDashboardStats);

// POST /api/progress/quiz/submit - Submit quiz for a module
router.post('/quiz/submit', auth, progressController.submitQuiz);

// GET /api/progress/:courseId - Get progress for specific course
router.get('/:courseId', auth, progressController.getCourseProgress);

// POST /api/progress/complete - Mark module as complete
router.post('/complete', auth, progressController.markModuleComplete);

module.exports = router;
