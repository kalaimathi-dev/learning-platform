const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { auth } = require('../middleware/auth');

// GET /api/certificates/:courseId - Download certificate PDF (completed courses only)
router.get('/:courseId', auth, certificateController.downloadCertificate);

module.exports = router;
