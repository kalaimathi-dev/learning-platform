// Progress Controller - Handles user progress tracking
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const User = require('../models/User');
const { BADGES, ensureBadge } = require('../utils/badges');

// Get user progress for all courses
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id })
      .populate('courseId');
    
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get progress for specific course
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if user is enrolled in this course
    const user = await User.findById(req.user._id);
    const isEnrolled = user.enrolledCourses.some(id => String(id) === String(courseId));
    
    let progress = await Progress.findOne({
      userId: req.user._id,
      courseId: courseId
    }).populate('courseId');

    // If no progress exists and user is enrolled, create progress record
    if (!progress && isEnrolled) {
      progress = new Progress({
        userId: req.user._id,
        courseId: courseId,
        status: 'in-progress',
        progressPercentage: 0
      });
      await progress.save();
      await progress.populate('courseId');
    }

    // Return enrollment status along with progress
    res.json({ 
      progress: progress || { status: 'not-enrolled', progressPercentage: 0 },
      enrolled: isEnrolled 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark module as complete
exports.markModuleComplete = async (req, res) => {
  try {
    const { courseId, moduleId } = req.body;
    
    // Find or create progress record
    let progress = await Progress.findOne({
      userId: req.user._id,
      courseId: courseId
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        courseId: courseId
      });
    }

    // Check if module already completed
    const alreadyCompleted = progress.completedModules.some(
      m => m.moduleId === moduleId
    );

    if (!alreadyCompleted) {
      const previousPercentage = progress.progressPercentage || 0;
      progress.completedModules.push({ moduleId });
      
      // Calculate progress percentage
      const course = await Course.findById(courseId);
      const totalModules = course.modules.length;
      const completedCount = progress.completedModules.length;
      progress.progressPercentage = Math.round((completedCount / totalModules) * 100);
      
      // Update status
      if (progress.progressPercentage === 100) {
        progress.status = 'completed';
        progress.completedAt = new Date();
      } else if (progress.progressPercentage > 0) {
        progress.status = 'in-progress';
      }

      await progress.save();

      // Badge logic (simple milestones)
      const user = await User.findById(req.user._id);
      if (user) {
        // First module ever (approx): if no FIRST_MODULE badge yet
        ensureBadge(user, BADGES.FIRST_MODULE);

        if (previousPercentage < 50 && progress.progressPercentage >= 50) {
          ensureBadge(user, BADGES.HALF_WAY);
        }

        if (progress.progressPercentage === 100) {
          ensureBadge(user, BADGES.COURSE_COMPLETE);
        }

        await user.save();
      }
    }

    res.json({ 
      message: 'Module marked as complete',
      progress 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit a module quiz (3–5 MCQs)
exports.submitQuiz = async (req, res) => {
  try {
    const { courseId, moduleId, answers } = req.body;
    if (!courseId || !moduleId || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'courseId, moduleId and answers[] are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const quiz = Array.isArray(module.quiz) ? module.quiz : [];
    const total = quiz.length;

    let score = 0;
    for (let i = 0; i < total; i++) {
      const correctIndex = quiz[i].correctIndex;
      if (answers[i] === correctIndex) score++;
    }

    const passed = total > 0 ? score >= Math.ceil(total * 0.6) : false;

    // Ensure progress exists
    let progress = await Progress.findOne({ userId: req.user._id, courseId });
    if (!progress) {
      progress = new Progress({ userId: req.user._id, courseId, status: 'in-progress', progressPercentage: 0 });
    }

    // Upsert quiz result for this module
    progress.quizResults = progress.quizResults || [];
    progress.quizResults = progress.quizResults.filter((r) => r.moduleId !== String(moduleId));
    progress.quizResults.push({ moduleId: String(moduleId), score, total, passed, attemptedAt: new Date() });
    await progress.save();

    // Badge: perfect quiz score
    if (total > 0 && score === total) {
      const user = await User.findById(req.user._id);
      if (user) {
        ensureBadge(user, BADGES.QUIZ_MASTER);
        await user.save();
      }
    }

    res.json({ message: 'Quiz submitted', score, total, passed });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all progress records for user
    const allProgress = await Progress.find({ userId });
    
    // Calculate statistics
    const totalEnrolled = allProgress.length;
    const completed = allProgress.filter(p => p.status === 'completed').length;
    const inProgress = allProgress.filter(p => p.status === 'in-progress').length;
    
    // Calculate average progress
    const avgProgress = allProgress.length > 0
      ? Math.round(allProgress.reduce((sum, p) => sum + p.progressPercentage, 0) / allProgress.length)
      : 0;

    res.json({
      stats: {
        totalEnrolled,
        completed,
        inProgress,
        averageProgress: avgProgress,
        streak: {
          current: req.user.currentStreak || 0,
          longest: req.user.longestStreak || 0
        },
        badgesCount: Array.isArray(req.user.badges) ? req.user.badges.length : 0,
        badges: req.user.badges || []
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
