// API utility file - Handles all backend communication
import axios from 'axios';

// Prefer deployed API URL in production, fallback to local backend for development.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile')
};

// Course APIs
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  getRecommendedCourses: () => api.get('/courses/recommended'),
  getCoursesByCategory: (category) => api.get(`/courses/category/${category}`),
  getModuleQuiz: (courseId, moduleId) => api.get(`/courses/${courseId}/modules/${moduleId}/quiz`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  enrollCourse: (courseId) => api.post('/courses/enroll', { courseId })
};

// Progress APIs
export const progressAPI = {
  getUserProgress: () => api.get('/progress'),
  getCourseProgress: (courseId) => api.get(`/progress/${courseId}`),
  markModuleComplete: (courseId, moduleId) => 
    api.post('/progress/complete', { courseId, moduleId }),
  submitQuiz: (courseId, moduleId, answers) =>
    api.post('/progress/quiz/submit', { courseId, moduleId, answers }),
  getDashboardStats: () => api.get('/progress/stats')
};

// User APIs
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  updateInterests: (interests) => api.put('/users/interests', { interests }),
  updateProfile: (profileData) => api.put('/users/profile', profileData)
};

// Admin APIs
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics')
};

// Certificate API
export const certificateAPI = {
  download: (courseId) => api.get(`/certificates/${courseId}`, { responseType: 'blob' })
};

export default api;
