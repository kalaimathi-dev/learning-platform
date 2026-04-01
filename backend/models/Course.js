// Course Model - Defines structure of course data
const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  duration: String, // e.g., "2 hours"
  content: String,
  quiz: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctIndex: {
      type: Number,
      required: true
    }
  }],
  order: Number // To maintain sequence of modules
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true // e.g., "Web Development", "Data Science"
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  modules: [moduleSchema], // Array of modules in the course
  instructor: {
    type: String,
    default: 'Platform Instructor'
  },
  duration: {
    type: String // Total course duration
  },
  thumbnail: {
    type: String,
    default: 'default-course.jpg'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
