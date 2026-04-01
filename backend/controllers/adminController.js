const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

// Admin analytics dashboard
exports.getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalProgress] = await Promise.all([
      User.countDocuments({}),
      Course.countDocuments({}),
      Progress.countDocuments({})
    ]);

    const completedProgress = await Progress.countDocuments({ status: 'completed' });
    const completionRate = totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0;

    // Total completed modules across all progress
    const modulesAgg = await Progress.aggregate([
      { $project: { completedCount: { $size: '$completedModules' } } },
      { $group: { _id: null, totalCompleted: { $sum: '$completedCount' } } }
    ]);
    const totalCompletedModules = modulesAgg.length > 0 ? modulesAgg[0].totalCompleted : 0;

    // Most popular course by enrollments/progress records
    const popularAgg = await Progress.aggregate([
      { $group: { _id: '$courseId', enrollments: { $sum: 1 } } },
      { $sort: { enrollments: -1 } },
      { $limit: 1 }
    ]);

    let popularCourse = null;
    if (popularAgg.length > 0) {
      const course = await Course.findById(popularAgg[0]._id).select('title category difficulty');
      if (course) {
        popularCourse = {
          id: course._id,
          title: course.title,
          category: course.category,
          difficulty: course.difficulty,
          enrollments: popularAgg[0].enrollments
        };
      }
    }

    // Difficulty breakdown
    const difficultyAgg = await Course.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    const difficultyBreakdown = difficultyAgg.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      analytics: {
        totalUsers,
        totalCourses,
        completionRate,
        totalCompletedModules,
        popularCourse,
        difficultyBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user details with progress (Admin only)
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const progress = await Progress.find({ userId })
      .populate('courseId', 'title category difficulty');

    res.json({ user, progress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent deleting admin users
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    // Delete user and their progress records
    await Promise.all([
      User.findByIdAndDelete(userId),
      Progress.deleteMany({ userId })
    ]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all issued certificates (Admin only)
exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Progress.find({
      status: 'completed',
      certificateId: { $exists: true, $ne: null }
    })
      .populate('userId', 'name email')
      .populate('courseId', 'title category difficulty')
      .select('certificateId certificateIssuedAt completedAt')
      .sort({ certificateIssuedAt: -1 });

    res.json({ certificates });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
