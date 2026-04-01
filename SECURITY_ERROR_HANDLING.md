# Security & Error Handling Documentation

## Table of Contents
1. [Security Implementation](#security-implementation)
2. [Authentication & Authorization](#authentication--authorization)
3. [Input Validation](#input-validation)
4. [Error Handling](#error-handling)
5. [Security Best Practices](#security-best-practices)
6. [Common Vulnerabilities & Mitigations](#common-vulnerabilities--mitigations)

---

## Security Implementation

### Security Layers

```
┌─────────────────────────────────────────────┐
│        Frontend Security Layer              │
│  - Input validation                         │
│  - XSS prevention                           │
│  - Secure token storage                     │
└──────────────────┬──────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────┐
│        API Gateway / CORS                   │
│  - Origin validation                        │
│  - Rate limiting                            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│        Backend Security Layer               │
│  - JWT verification                         │
│  - Role-based access control                │
│  - Input sanitization                       │
│  - SQL injection prevention                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│        Database Security                    │
│  - Connection encryption                    │
│  - Password hashing (bcrypt)                │
│  - Access control                           │
└─────────────────────────────────────────────┘
```

---

## Authentication & Authorization

### JWT (JSON Web Tokens) Implementation

#### Token Generation

**File:** `backend/controllers/authController.js`

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, interests } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // 3. Hash password (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      interests: interests || []
    });

    // 5. Generate JWT token (expires in 24 hours)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 6. Return user (without password) and token
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 3. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. Return response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
```

#### Token Verification Middleware

**File:** `backend/middleware/auth.js`

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
exports.auth = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    }

    const token = authHeader.replace('Bearer ', '');

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found. Authorization denied.' });
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Authorization denied.' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error in authorization' });
  }
};
```

### Password Security

#### Hashing Implementation

**File:** `backend/models/User.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  interests: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving (if modified)
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON responses
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
```

### CORS Configuration

**File:** `backend/server.js`

```javascript
const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = [
      'http://localhost:3000',           // Development
      process.env.FRONTEND_URL,          // Production
      'https://your-app.vercel.app'      // Production URL
    ];
    
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,                     // Allow cookies
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Or simple CORS for development
// app.use(cors());
```

---

## Input Validation

### Backend Validation

#### Mongoose Schema Validation

```javascript
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  level: {
    type: String,
    required: true,
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced'],
      message: '{VALUE} is not a valid level'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  modules: {
    type: [{
      moduleId: { type: String, required: true },
      title: { type: String, required: true },
      content: { type: String, required: true },
      videoUrl: { type: String },
      duration: { type: String, required: true },
      order: { type: Number, required: true }
    }],
    validate: {
      validator: function(array) {
        return array.length > 0;
      },
      message: 'Course must have at least one module'
    }
  }
});
```

#### Custom Validation Functions

**File:** `backend/utils/validators.js`

```javascript
// Email validation
exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
exports.validatePassword = (password) => {
  // At least 6 characters
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  
  // Optional: Require uppercase, lowercase, number
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      valid: false,
      message: 'Password must contain uppercase, lowercase, and number'
    };
  }
  
  return { valid: true };
};

// Sanitize user input (prevent XSS)
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags
  return input.replace(/<[^>]*>/g, '');
};

// Validate MongoDB ObjectId
exports.isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
```

### Frontend Validation

**File:** `frontend/src/pages/Register.js`

```javascript
const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};

  // Name validation
  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  } else if (formData.name.length < 2) {
    newErrors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    newErrors.email = 'Email is required';
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = 'Invalid email format';
  }

  // Password validation
  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }

  // Confirm password
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  // Interests validation
  if (formData.interests.length === 0) {
    newErrors.interests = 'Please select at least one interest';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate before submission
  if (!validateForm()) {
    return;
  }

  try {
    // Submit form
    await api.post('/auth/register', formData);
  } catch (error) {
    // Handle errors
  }
};
```

---

## Error Handling

### Backend Error Handling

#### Global Error Handler Middleware

**File:** `backend/middleware/errorHandler.js`

```javascript
// Custom Error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message).join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { AppError, errorHandler };
```

**Usage in `server.js`:**

```javascript
const { errorHandler } = require('./middleware/errorHandler');

// Routes here...

// Error handler (must be last middleware)
app.use(errorHandler);
```

#### Controller Error Handling Pattern

```javascript
const { AppError } = require('../middleware/errorHandler');

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    res.status(200).json(course);
  } catch (error) {
    next(error); // Pass to error handler
  }
};
```

### Frontend Error Handling

#### API Error Interceptor

**File:** `frontend/src/utils/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Request interceptor (add token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data.message || 'An error occurred';

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        
        case 403:
          // Forbidden - insufficient permissions
          alert('Access denied. Insufficient permissions.');
          break;
        
        case 404:
          // Not found
          console.error('Resource not found:', message);
          break;
        
        case 500:
          // Server error
          alert('Server error. Please try again later.');
          break;
        
        default:
          console.error('Error:', message);
      }

      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      alert('Network error. Please check your connection.');
      return Promise.reject({ message: 'Network error' });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;
```

#### Component Error Handling

```javascript
import { useState } from 'react';
import api from '../utils/api';

function CourseEnrollment({ courseId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEnroll = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/progress/enroll', { courseId });
      alert('Successfully enrolled!');
    } catch (err) {
      // Error already handled by interceptor
      // But we can show user-specific message
      setError(err.message || 'Failed to enroll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      <button onClick={handleEnroll} disabled={loading}>
        {loading ? 'Enrolling...' : 'Enroll Now'}
      </button>
    </div>
  );
}
```

---

## Security Best Practices

### 1. Environment Variables

```env
# ✅ DO: Use strong, unique secrets
JWT_SECRET=use_a_long_random_string_minimum_32_characters_abc123xyz789

# ❌ DON'T: Use simple secrets
JWT_SECRET=secret123
```

### 2. Password Requirements

```javascript
// Enforce strong passwords
const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false
};
```

### 3. Rate Limiting

**Install:** `npm install express-rate-limit`

**File:** `backend/server.js`

```javascript
const rateLimit = require('express-rate-limit');

// Auth endpoints rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.',
});

// Apply limiters
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);
```

### 4. Helmet (Security Headers)

**Install:** `npm install helmet`

**File:** `backend/server.js`

```javascript
const helmet = require('helmet');

// Add security headers
app.use(helmet());
```

### 5. Input Sanitization

**Install:** `npm install express-mongo-sanitize`

**File:** `backend/server.js`

```javascript
const mongoSanitize = require('express-mongo-sanitize');

// Prevent MongoDB injection
app.use(mongoSanitize());
```

### 6. Data Exposure Prevention

```javascript
// ✅ DO: Select only required fields
User.findById(id).select('name email role -_id');

// ❌ DON'T: Return all fields including sensitive data
User.findById(id); // Might include password hash
```

---

## Common Vulnerabilities & Mitigations

### 1. SQL/NoSQL Injection

**Vulnerability:**
```javascript
// ❌ DON'T: Direct query construction
User.find({ email: req.body.email }); // If email is { $ne: null }
```

**Mitigation:**
```javascript
// ✅ DO: Use parameterized queries and sanitization
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize()); // Removes $ and . from user input
```

### 2. Cross-Site Scripting (XSS)

**Vulnerability:**
```javascript
// ❌ DON'T: Directly render user input
<div dangerouslySetInnerHTML={{__html: userInput}} />
```

**Mitigation:**
```javascript
// ✅ DO: Escape user input
<div>{userInput}</div> // React automatically escapes

// Backend sanitization
const sanitizeHtml = require('sanitize-html');
const clean = sanitizeHtml(userInput, {
  allowedTags: [], // No HTML tags allowed
  allowedAttributes: {}
});
```

### 3. Cross-Site Request Forgery (CSRF)

**Mitigation:**
- Use JWT in Authorization header (not cookies)
- Implement CORS properly
- Add CSRF tokens for cookie-based auth

### 4. Broken Authentication

**Mitigations Implemented:**
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT with expiration (24 hours)
- ✅ Token verification on protected routes
- ✅ Role-based access control

### 5. Sensitive Data Exposure

**Mitigations:**
```javascript
// ✅ Password excluded from JSON responses
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

// ✅ HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
```

### 6. Broken Access Control

**Implementation:**
```javascript
// ✅ Verify resource ownership
exports.updateProgress = async (req, res) => {
  const progress = await Progress.findById(req.params.id);
  
  // Check if user owns this progress record
  if (progress.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  // Proceed with update
};
```

---

## Logging & Monitoring

### Security Event Logging

```javascript
const fs = require('fs');
const path = require('path');

const securityLog = (event, details) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: details.ip,
    userAgent: details.userAgent
  };

  const logPath = path.join(__dirname, '../logs/security.log');
  fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
};

// Usage
exports.login = async (req, res) => {
  try {
    // Login logic...
    
    securityLog('LOGIN_SUCCESS', {
      userId: user._id,
      email: user.email,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
  } catch (error) {
    securityLog('LOGIN_FAILED', {
      email: req.body.email,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      reason: error.message
    });
  }
};
```

---

## Security Checklist

### Development
- [ ] .env file in .gitignore
- [ ] Strong JWT secret generated
- [ ] Password hashing implemented
- [ ] Input validation on all forms
- [ ] Error messages don't expose sensitive info

### Pre-Production
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Helmet security headers added
- [ ] MongoDB injection prevention
- [ ] JWT expiration set
- [ ] Role-based access control tested

### Production
- [ ] Environment variables secured
- [ ] Database connection encrypted
- [ ] Regular security audits scheduled
- [ ] Logging and monitoring active
- [ ] Backup strategy implemented
- [ ] Incident response plan documented

---

