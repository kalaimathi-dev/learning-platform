// Course Controller - Handles course operations
const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { BADGES, ensureBadge } = require('../utils/badges');

function sanitizeCourseForClient(courseDoc) {
  if (!courseDoc) return courseDoc;
  const course = typeof courseDoc.toObject === 'function' ? courseDoc.toObject() : courseDoc;

  if (Array.isArray(course.modules)) {
    course.modules = course.modules.map((m) => {
      const moduleCopy = { ...m };
      if (Array.isArray(moduleCopy.quiz)) {
        moduleCopy.quiz = moduleCopy.quiz.map((q) => {
          const { correctIndex, ...safe } = q;
          return safe;
        });
      }
      return moduleCopy;
    });
  }

  return course;
}

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ courses: courses.map(sanitizeCourseForClient) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course: sanitizeCourseForClient(course) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get courses by category
exports.getCoursesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const courses = await Course.find({ category });
    res.json({ courses: courses.map(sanitizeCourseForClient) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new course (Admin only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, difficulty, modules, duration, instructor } = req.body;

    const course = new Course({
      title,
      description,
      category,
      difficulty,
      modules,
      duration,
      instructor,
      createdBy: req.user._id
    });

    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update course (Admin only)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return updated document
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete course (Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(courseId);

    // Badge: first enrollment
    if (user.enrolledCourses.length === 1) {
      ensureBadge(user, BADGES.FIRST_ENROLLMENT);
    }

    await user.save();

    // Ensure a Progress record exists (helps stats/analytics)
    const existingProgress = await Progress.findOne({ userId, courseId });
    if (!existingProgress) {
      await Progress.create({
        userId,
        courseId,
        status: 'in-progress',
        progressPercentage: 0
      });
    }

    res.json({ message: 'Enrolled successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recommended courses based on user interests
exports.getRecommendedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Experience-level filtering logic
    const exp = user.experienceLevel || 'Beginner';
    const allowedDifficulties = exp === 'Beginner'
      ? ['Beginner']
      : exp === 'Intermediate'
        ? ['Beginner', 'Intermediate']
        : ['Intermediate', 'Advanced'];

    // 1) Best match: interest + allowed difficulty
    let recommendedCourses = await Course.find({
      category: { $in: user.interests },
      difficulty: { $in: allowedDifficulties }
    }).limit(6);

    // 2) Fallback: interest only
    if (recommendedCourses.length < 6) {
      const more = await Course.find({
        category: { $in: user.interests },
        _id: { $nin: recommendedCourses.map(c => c._id) }
      }).limit(6 - recommendedCourses.length);
      recommendedCourses = [...recommendedCourses, ...more];
    }

    // 3) Fallback: allowed difficulty only
    if (recommendedCourses.length < 6) {
      const more = await Course.find({
        difficulty: { $in: allowedDifficulties },
        _id: { $nin: recommendedCourses.map(c => c._id) }
      }).limit(6 - recommendedCourses.length);
      recommendedCourses = [...recommendedCourses, ...more];
    }

    res.json({ courses: recommendedCourses.map(sanitizeCourseForClient) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get quiz questions for a specific module (no correct answers returned)
exports.getModuleQuiz = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const quiz = Array.isArray(module.quiz)
      ? module.quiz.map((q) => ({ question: q.question, options: q.options }))
      : [];

    res.json({
      courseId: course._id,
      moduleId: module._id,
      questions: quiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Quiz Management: Get quiz with correct answers (Admin only)
exports.getModuleQuizAdmin = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    res.json({
      courseId: course._id,
      courseTitle: course.title,
      moduleId: module._id,
      moduleTitle: module.title,
      quiz: module.quiz || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Quiz Management: Add quiz question (Admin only)
exports.addQuizQuestion = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { question, options, correctIndex } = req.body;

    if (!question || !options || correctIndex === undefined) {
      return res.status(400).json({ message: 'Question, options, and correctIndex are required' });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'Options must be an array with at least 2 items' });
    }

    if (correctIndex < 0 || correctIndex >= options.length) {
      return res.status(400).json({ message: 'Invalid correctIndex' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    if (!Array.isArray(module.quiz)) {
      module.quiz = [];
    }

    module.quiz.push({ question, options, correctIndex });
    await course.save();

    res.json({
      message: 'Quiz question added successfully',
      quiz: module.quiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Quiz Management: Update quiz question (Admin only)
exports.updateQuizQuestion = async (req, res) => {
  try {
    const { courseId, moduleId, questionIndex } = req.params;
    const { question, options, correctIndex } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const qIndex = parseInt(questionIndex);
    if (!module.quiz || !module.quiz[qIndex]) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question !== undefined) module.quiz[qIndex].question = question;
    if (options !== undefined) module.quiz[qIndex].options = options;
    if (correctIndex !== undefined) module.quiz[qIndex].correctIndex = correctIndex;

    await course.save();

    res.json({
      message: 'Quiz question updated successfully',
      quiz: module.quiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Quiz Management: Delete quiz question (Admin only)
exports.deleteQuizQuestion = async (req, res) => {
  try {
    const { courseId, moduleId, questionIndex } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const qIndex = parseInt(questionIndex);
    if (!module.quiz || !module.quiz[qIndex]) {
      return res.status(404).json({ message: 'Question not found' });
    }

    module.quiz.splice(qIndex, 1);
    await course.save();

    res.json({
      message: 'Quiz question deleted successfully',
      quiz: module.quiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

