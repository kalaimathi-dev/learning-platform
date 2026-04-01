# Testing Strategy & Implementation

## Table of Contents
1. [Testing Overview](#testing-overview)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [API Testing](#api-testing)
5. [Frontend Testing](#frontend-testing)
6. [Performance Testing](#performance-testing)
7. [Test Coverage](#test-coverage)
8. [Running Tests](#running-tests)

---

## Testing Overview

### Testing Pyramid
```
                 ┌──────────────┐
                 │   E2E Tests  │  (Few - Slow)
                 └──────────────┘
            ┌────────────────────────┐
            │  Integration Tests     │  (Some - Medium)
            └────────────────────────┘
       ┌──────────────────────────────────┐
       │      Unit Tests                  │  (Many - Fast)
       └──────────────────────────────────┘
```

### Testing Tools

**Backend:**
- **Jest** - Testing framework
- **Supertest** - HTTP assertions
- **mongodb-memory-server** - In-memory MongoDB for testing

**Frontend:**
- **React Testing Library** - Component testing
- **Jest** - Test runner
- **MSW (Mock Service Worker)** - API mocking

---

## Backend Testing Setup

### Installation

```bash
cd backend
npm install --save-dev jest supertest mongodb-memory-server @types/jest
```

### Configuration

Create `backend/jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

Update `backend/package.json`:
```json
{
  "scripts": {
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration"
  }
}
```

---

## Unit Testing

### 1. Model Tests

Create `backend/__tests__/models/user.test.js`:
```javascript
const User = require('../../models/User');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model Tests', () => {
  test('should create a valid user', async () => {
    const validUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      interests: ['Web Development']
    };

    const user = await User.create(validUser);
    
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.role).toBe('student'); // default value
    expect(user.password).not.toBe('password123'); // should be hashed
  });

  test('should fail without required fields', async () => {
    const invalidUser = { name: 'John' };
    
    let error;
    try {
      await User.create(invalidUser);
    } catch (err) {
      error = err;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  test('should not allow duplicate emails', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    await User.create(userData);
    
    let error;
    try {
      await User.create(userData);
    } catch (err) {
      error = err;
    }
    
    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error
  });

  test('should hash password before saving', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });

    await user.save();
    
    expect(user.password).not.toBe('password123');
    expect(user.password.length).toBeGreaterThan(20); // bcrypt hash length
  });
});
```

### 2. Utility Function Tests

Create `backend/__tests__/utils/badges.test.js`:
```javascript
const { getBadgeForLevel } = require('../../utils/badges');

describe('Badge Utility Tests', () => {
  test('should return correct badge for beginner', () => {
    const badge = getBadgeForLevel('Beginner');
    expect(badge).toMatch(/beginner/i);
  });

  test('should return correct badge for intermediate', () => {
    const badge = getBadgeForLevel('Intermediate');
    expect(badge).toMatch(/intermediate/i);
  });

  test('should return correct badge for advanced', () => {
    const badge = getBadgeForLevel('Advanced');
    expect(badge).toMatch(/advanced/i);
  });

  test('should handle invalid level gracefully', () => {
    const badge = getBadgeForLevel('Invalid');
    expect(badge).toBeDefined();
  });
});
```

---

## Integration Testing

### 1. Authentication API Tests

Create `backend/__tests__/integration/auth.test.js`:
```javascript
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server'); // Export app from server.js
const User = require('../../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Authentication API Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        interests: ['Web Development']
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('john@example.com');
      expect(response.body.user.password).toBeUndefined(); // Should not return password
    });

    test('should fail with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      await request(app).post('/api/auth/register').send(userData);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toMatch(/already registered/i);
    });

    test('should fail with invalid email format', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    test('should fail with short password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toMatch(/password/i);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });
    });

    test('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('john@example.com');
    });

    test('should fail with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body.message).toMatch(/invalid/i);
    });

    test('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.message).toMatch(/invalid/i);
    });
  });
});
```

### 2. Course API Tests

Create `backend/__tests__/integration/courses.test.js`:
```javascript
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const User = require('../../models/User');
const Course = require('../../models/Course');

let mongoServer;
let studentToken;
let adminToken;
let testCourseId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Create student user
  const studentRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Student User',
      email: 'student@example.com',
      password: 'password123',
      interests: ['Web Development']
    });
  studentToken = studentRes.body.token;

  // Create admin user
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  });
  // Generate admin token (you'll need to import JWT)
  const jwt = require('jsonwebtoken');
  adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'test-secret');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Course.deleteMany({});
});

describe('Course API Integration Tests', () => {
  describe('GET /api/courses', () => {
    beforeEach(async () => {
      // Create test courses
      await Course.create([
        {
          title: 'React Course',
          description: 'Learn React from scratch',
          category: 'Web Development',
          level: 'Beginner',
          duration: '4 weeks',
          modules: [{ moduleId: 'M1', title: 'Intro', content: 'Content', duration: '30 mins', order: 1 }]
        },
        {
          title: 'Python Course',
          description: 'Master Python programming',
          category: 'Programming',
          level: 'Intermediate',
          duration: '6 weeks',
          modules: [{ moduleId: 'M1', title: 'Intro', content: 'Content', duration: '45 mins', order: 1 }]
        }
      ]);
    });

    test('should get all courses with authentication', async () => {
      const response = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.courses).toHaveLength(2);
      expect(response.body.totalCourses).toBe(2);
    });

    test('should fail without authentication', async () => {
      await request(app)
        .get('/api/courses')
        .expect(401);
    });

    test('should filter courses by category', async () => {
      const response = await request(app)
        .get('/api/courses?category=Web Development')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.courses).toHaveLength(1);
      expect(response.body.courses[0].category).toBe('Web Development');
    });

    test('should filter courses by level', async () => {
      const response = await request(app)
        .get('/api/courses?level=Beginner')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.courses).toHaveLength(1);
      expect(response.body.courses[0].level).toBe('Beginner');
    });
  });

  describe('POST /api/admin/courses', () => {
    test('should create course with admin token', async () => {
      const courseData = {
        title: 'Node.js Course',
        description: 'Backend development with Node.js and Express',
        category: 'Backend Development',
        level: 'Intermediate',
        duration: '8 weeks',
        image: 'http://example.com/nodejs.jpg',
        modules: [
          {
            moduleId: 'M1',
            title: 'Introduction',
            content: 'Node.js basics',
            duration: '30 mins',
            order: 1
          }
        ]
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData)
        .expect(201);

      expect(response.body.message).toMatch(/created successfully/i);
      expect(response.body.course.title).toBe('Node.js Course');
      expect(response.body.course.modules).toHaveLength(1);
    });

    test('should fail without admin token', async () => {
      const courseData = {
        title: 'Node.js Course',
        description: 'Backend development',
        category: 'Backend',
        level: 'Intermediate',
        duration: '8 weeks',
        modules: [{ moduleId: 'M1', title: 'Intro', content: 'Content', duration: '30 mins', order: 1 }]
      };

      await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(courseData)
        .expect(403);
    });

    test('should fail with missing required fields', async () => {
      const invalidCourse = {
        title: 'Test'
        // Missing other required fields
      };

      await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidCourse)
        .expect(400);
    });
  });
});
```

### 3. Progress API Tests

Create `backend/__tests__/integration/progress.test.js`:
```javascript
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const Course = require('../../models/Course');
const Progress = require('../../models/Progress');

let mongoServer;
let studentToken;
let testCourse;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Register student
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Student',
      email: 'student@example.com',
      password: 'password123'
    });
  studentToken = res.body.token;

  // Create test course
  testCourse = await Course.create({
    title: 'Test Course',
    description: 'Test course for progress tracking',
    category: 'Testing',
    level: 'Beginner',
    duration: '2 weeks',
    modules: [
      { moduleId: 'M1', title: 'Module 1', content: 'Content 1', duration: '30 mins', order: 1 },
      { moduleId: 'M2', title: 'Module 2', content: 'Content 2', duration: '45 mins', order: 2 },
      { moduleId: 'M3', title: 'Module 3', content: 'Content 3', duration: '60 mins', order: 3 }
    ]
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Progress.deleteMany({});
});

describe('Progress API Integration Tests', () => {
  describe('POST /api/progress/enroll', () => {
    test('should enroll in course successfully', async () => {
      const response = await request(app)
        .post('/api/progress/enroll')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId: testCourse._id })
        .expect(201);

      expect(response.body.message).toMatch(/enrolled/i);
      expect(response.body.progress.percentage).toBe(0);
      expect(response.body.progress.completedModules).toHaveLength(0);
    });

    test('should fail when already enrolled', async () => {
      // First enrollment
      await request(app)
        .post('/api/progress/enroll')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId: testCourse._id });

      // Second enrollment attempt
      const response = await request(app)
        .post('/api/progress/enroll')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId: testCourse._id })
        .expect(400);

      expect(response.body.message).toMatch(/already enrolled/i);
    });
  });

  describe('POST /api/progress/complete-module', () => {
    beforeEach(async () => {
      // Enroll in course first
      await request(app)
        .post('/api/progress/enroll')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId: testCourse._id });
    });

    test('should mark module as complete', async () => {
      const response = await request(app)
        .post('/api/progress/complete-module')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          courseId: testCourse._id,
          moduleId: 'M1'
        })
        .expect(200);

      expect(response.body.progress.completedModules).toContain('M1');
      expect(response.body.progress.percentage).toBeCloseTo(33.33, 1); // 1/3 modules
    });

    test('should calculate correct percentage with multiple modules', async () => {
      // Complete M1
      await request(app)
        .post('/api/progress/complete-module')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId: testCourse._id, moduleId: 'M1' });

      // Complete M2
      const response = await request(app)
        .post('/api/progress/complete-module')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId: testCourse._id, moduleId: 'M2' })
        .expect(200);

      expect(response.body.progress.completedModules).toHaveLength(2);
      expect(response.body.progress.percentage).toBeCloseTo(66.67, 1); // 2/3 modules
    });

    test('should not duplicate completed modules', async () => {
      // Complete M1
      await request(app)
        .post('/api/progress/complete-module')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId: testCourse._id, moduleId: 'M1' });

      // Try to complete M1 again
      const response = await request(app)
        .post('/api/progress/complete-module')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId: testCourse._id, moduleId: 'M1' })
        .expect(400);

      expect(response.body.message).toMatch(/already completed/i);
    });
  });

  describe('GET /api/progress/my-courses', () => {
    beforeEach(async () => {
      // Enroll in course
      await request(app)
        .post('/api/progress/enroll')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId: testCourse._id });
    });

    test('should get enrolled courses', async () => {
      const response = await request(app)
        .get('/api/progress/my-courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.enrolledCourses).toHaveLength(1);
      expect(response.body.enrolledCourses[0].courseId.title).toBe('Test Course');
    });
  });
});
```

---

## API Testing with Postman/Thunder Client

### Test Collection Structure

**File:** `backend/tests/api-tests.postman_collection.json`

### Automated Test Scripts

```javascript
// Add to Postman Tests tab

// Test: Register User
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.be.a('string');
    pm.environment.set("token", jsonData.token);
});

pm.test("User object contains email", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.user.email).to.exist;
});

// Test: Login
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("successful");
    pm.environment.set("token", jsonData.token);
});

// Test: Get Courses
pm.test("Courses array returned", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.courses).to.be.an('array');
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

---

## Frontend Testing

### Setup

```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Component Tests

Create `frontend/src/__tests__/components/CourseCard.test.js`:
```javascript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourseCard from '../../components/CourseCard';

const mockCourse = {
  _id: '123',
  title: 'React Course',
  description: 'Learn React',
  category: 'Web Development',
  level: 'Beginner',
  duration: '4 weeks',
  image: 'http://example.com/image.jpg'
};

describe('CourseCard Component', () => {
  test('renders course title', () => {
    render(
      <BrowserRouter>
        <CourseCard course={mockCourse} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('React Course')).toBeInTheDocument();
  });

  test('displays correct level badge', () => {
    render(
      <BrowserRouter>
        <CourseCard course={mockCourse} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Beginner/i)).toBeInTheDocument();
  });

  test('shows course category', () => {
    render(
      <BrowserRouter>
        <CourseCard course={mockCourse} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Web Development/i)).toBeInTheDocument();
  });
});
```

---

## Performance Testing

### Load Testing with Artillery

Install Artillery:
```bash
npm install -g artillery
```

Create `load-test.yml`:
```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Spike test"
  variables:
    testEmail:
      - "user1@test.com"
      - "user2@test.com"
      - "user3@test.com"

scenarios:
  - name: "Browse and enroll in courses"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ testEmail }}"
            password: "password123"
          capture:
            - json: "$.token"
              as: "authToken"
      - get:
          url: "/api/courses"
          headers:
            Authorization: "Bearer {{ authToken }}"
      - think: 3
      - get:
          url: "/api/progress/my-courses"
          headers:
            Authorization: "Bearer {{ authToken }}"
```

Run load test:
```bash
artillery run load-test.yml
```

---

## Test Coverage

### Running Coverage Reports

```bash
# Backend
cd backend
npm run test -- --coverage

# Frontend
cd frontend
npm test -- --coverage --watchAll=false
```

### Coverage Thresholds

Target minimum coverage:
- **Statements:** 70%
- **Branches:** 70%
- **Functions:** 70%
- **Lines:** 70%

### Viewing Coverage Reports

Coverage HTML reports generated in:
- Backend: `backend/coverage/lcov-report/index.html`
- Frontend: `frontend/coverage/lcov-report/index.html`

---

## Continuous Integration (CI) Testing

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:
```yaml
name: Run Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: |
        cd backend
        npm install
    
    - name: Run tests
      run: |
        cd backend
        npm test
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./backend/coverage/lcov.info
        flags: backend

  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: |
        cd frontend
        npm install
    
    - name: Run tests
      run: |
        cd frontend
        npm test -- --coverage --watchAll=false
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./frontend/coverage/lcov.info
        flags: frontend
```

---

## Manual Testing Checklist

### Authentication Flow
- [ ] User can register with valid data
- [ ] Duplicate email registration fails
- [ ] User can login with correct credentials
- [ ] Login fails with wrong password
- [ ] JWT token stored in localStorage
- [ ] Protected routes redirect to login when not authenticated

### Course Management (Admin)
- [ ] Admin can create new course
- [ ] Course validation works (minimum fields)
- [ ] Admin can update existing course
- [ ] Admin can delete course
- [ ] Course deletion cascades to progress records

### Course Browsing (Student)
- [ ] All courses displayed on Courses page
- [ ] Category filter works correctly
- [ ] Level filter works correctly
- [ ] Search functionality works
- [ ] Course details page shows all information
- [ ] Recommended courses based on interests

### Enrollment & Progress
- [ ] User can enroll in course
- [ ] Cannot enroll twice in same course
- [ ] Progress starts at 0%
- [ ] Marking module complete updates percentage
- [ ] Progress calculation correct
- [ ] Last accessed time updates
- [ ] My Courses shows all enrollments

### UI/UX
- [ ] Responsive on mobile (320px width)
- [ ] Responsive on tablet (768px width)
- [ ] Responsive on desktop (1024px+ width)
- [ ] All buttons have hover effects
- [ ] Loading states shown during API calls
- [ ] Success toasts displayed
- [ ] Error messages clear and helpful
- [ ] Navigation works correctly
- [ ] Sidebar toggles on mobile

### Performance
- [ ] Page load time < 3 seconds
- [ ] API response times < 500ms
- [ ] No memory leaks in React
- [ ] Images optimized and lazy loaded

---

## Bug Tracking Template

### Bug Report Format

```markdown
**Bug Title:** [Clear, concise description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[If applicable]

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 119]
- Node version: [e.g., 16.14.0]

**Console Errors:**
```
[Paste any error messages]
```

**Possible Fix:**
[Optional - suggest a solution]
```

---

## Test Data Setup

### Seed Data for Testing

Create `backend/seedTestData.js`:
```javascript
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
require('dotenv').config();

const seedTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create test students
    await User.create([
      {
        name: 'Student One',
        email: 'student1@test.com',
        password: 'password123',
        interests: ['Web Development']
      },
      {
        name: 'Student Two',
        email: 'student2@test.com',
        password: 'password123',
        interests: ['Data Science', 'AI']
      }
    ]);

    // Create test courses
    await Course.create([
      {
        title: 'React Fundamentals',
        description: 'Learn React basics',
        category: 'Web Development',
        level: 'Beginner',
        duration: '4 weeks',
        createdBy: admin._id,
        modules: [
          { moduleId: 'M1', title: 'Intro', content: 'Content', duration: '30 mins', order: 1 }
        ]
      }
    ]);

    console.log('Test data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding test data:', error);
    process.exit(1);
  }
};

seedTestData();
```

Run: `node backend/seedTestData.js`

---

