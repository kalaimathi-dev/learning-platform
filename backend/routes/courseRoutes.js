// Course Routes
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { auth, isAdmin } = require('../middleware/auth');

// GET /api/courses - Get all courses
router.get('/', courseController.getAllCourses);

// GET /api/courses/recommended - Get recommended courses (protected)
router.get('/recommended', auth, courseController.getRecommendedCourses);

// GET /api/courses/category/:category - Get courses by category
router.get('/category/:category', courseController.getCoursesByCategory);

// Admin Quiz Management (must be before general quiz route)
router.get('/:courseId/modules/:moduleId/quiz/admin', auth, isAdmin, courseController.getModuleQuizAdmin);
router.post('/:courseId/modules/:moduleId/quiz', auth, isAdmin, courseController.addQuizQuestion);
router.put('/:courseId/modules/:moduleId/quiz/:questionIndex', auth, isAdmin, courseController.updateQuizQuestion);
router.delete('/:courseId/modules/:moduleId/quiz/:questionIndex', auth, isAdmin, courseController.deleteQuizQuestion);

// GET /api/courses/:courseId/modules/:moduleId/quiz - Get module quiz (protected)
router.get('/:courseId/modules/:moduleId/quiz', auth, courseController.getModuleQuiz);

// GET /api/courses/:id - Get single course
router.get('/:id', courseController.getCourseById);

// POST /api/courses - Create new course (Admin only)
router.post('/', auth, isAdmin, courseController.createCourse);

// PUT /api/courses/:id - Update course (Admin only)
router.put('/:id', auth, isAdmin, courseController.updateCourse);

// DELETE /api/courses/:id - Delete course (Admin only)
router.delete('/:id', auth, isAdmin, courseController.deleteCourse);

// POST /api/courses/enroll - Enroll in course (protected)
router.post('/enroll', auth, courseController.enrollCourse);

module.exports = router;
