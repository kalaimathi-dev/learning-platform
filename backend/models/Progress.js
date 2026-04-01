// Progress Model - Tracks user progress in courses
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedModules: [{
    moduleId: String,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  quizResults: [{
    moduleId: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    passed: {
      type: Boolean,
      default: false
    },
    attemptedAt: {
      type: Date,
      default: Date.now
    }
  }],
  progressPercentage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  certificateId: {
    type: String,
    default: null
  },
  certificateIssuedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Progress', progressSchema);
