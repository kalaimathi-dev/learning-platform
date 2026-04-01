# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Course APIs](#course-apis)
3. [Progress APIs](#progress-apis)
4. [User APIs](#user-apis)
5. [Admin APIs](#admin-apis)
6. [Certificate APIs](#certificate-apis)
7. [Error Codes](#error-codes)
8. [Postman Collection](#postman-collection)

---

## Authentication

All protected routes require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration
- Access tokens expire in **24 hours**
- Users must re-login after expiration

---

## Authentication APIs

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account

**Authentication:** None (Public)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "interests": ["Web Development", "Data Science"]
}
```

**Validation Rules:**
- `name`: Required, min 2 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 6 characters
- `interests`: Array of strings

**Success Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "interests": ["Web Development", "Data Science"]
  }
}
```

**Error Responses:**

`400 Bad Request` - Validation Error
```json
{
  "message": "Email is already registered"
}
```

`500 Internal Server Error`
```json
{
  "message": "Server error during registration"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "interests": ["Web Development"]
  }'
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token

**Authentication:** None (Public)

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "interests": ["Web Development", "Data Science"]
  }
}
```

**Error Responses:**

`400 Bad Request` - Invalid Credentials
```json
{
  "message": "Invalid email or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## Course APIs

### 3. Get All Courses

**Endpoint:** `GET /api/courses`

**Description:** Retrieve all available courses (with optional filtering)

**Authentication:** Required (Student/Admin)

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `category` | String | Filter by category | `?category=Web Development` |
| `level` | String | Filter by level | `?level=Beginner` |
| `search` | String | Search in title/description | `?search=react` |
| `page` | Number | Page number (default: 1) | `?page=2` |
| `limit` | Number | Results per page (default: 10) | `?limit=20` |

**Success Response:** `200 OK`
```json
{
  "courses": [
    {
      "_id": "507f191e810c19729de860ea",
      "title": "Complete React.js Course",
      "description": "Master React from basics to advanced",
      "image": "https://example.com/react.jpg",
      "category": "Web Development",
      "duration": "8 weeks",
      "level": "Intermediate",
      "modules": [
        {
          "moduleId": "M1",
          "title": "Introduction to React",
          "content": "Learn React basics...",
          "videoUrl": "https://youtube.com/watch?v=xyz",
          "duration": "45 mins",
          "order": 1
        }
      ],
      "createdBy": {
        "_id": "admin_id",
        "name": "Admin Name"
      },
      "createdAt": "2026-01-10T08:00:00.000Z"
    }
  ],
  "totalCourses": 25,
  "currentPage": 1,
  "totalPages": 3
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/courses?category=Web Development&level=Beginner" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 4. Get Course by ID

**Endpoint:** `GET /api/courses/:id`

**Description:** Get detailed information about a specific course

**Authentication:** Required (Student/Admin)

**URL Parameters:**
- `id`: Course ObjectId

**Success Response:** `200 OK`
```json
{
  "_id": "507f191e810c19729de860ea",
  "title": "Complete React.js Course",
  "description": "Master React from basics to advanced concepts",
  "image": "https://example.com/react.jpg",
  "category": "Web Development",
  "duration": "8 weeks",
  "level": "Intermediate",
  "modules": [
    {
      "moduleId": "M1",
      "title": "Introduction to React",
      "content": "Learn React library fundamentals including JSX, components...",
      "videoUrl": "https://youtube.com/watch?v=xyz",
      "duration": "45 mins",
      "order": 1
    },
    {
      "moduleId": "M2",
      "title": "Components and Props",
      "content": "Deep dive into React component architecture...",
      "videoUrl": "https://youtube.com/watch?v=abc",
      "duration": "60 mins",
      "order": 2
    }
  ],
  "createdBy": {
    "_id": "admin_id",
    "name": "Admin Name",
    "email": "admin@example.com"
  },
  "createdAt": "2026-01-10T08:00:00.000Z"
}
```

**Error Responses:**

`404 Not Found`
```json
{
  "message": "Course not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/courses/507f191e810c19729de860ea \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 5. Get Recommended Courses

**Endpoint:** `GET /api/courses/recommended`

**Description:** Get courses matching user's interests

**Authentication:** Required (Student)

**Success Response:** `200 OK`
```json
{
  "recommendedCourses": [
    {
      "_id": "course_id_1",
      "title": "React Hooks Mastery",
      "category": "Web Development",
      "level": "Advanced",
      "image": "...",
      "description": "..."
    }
  ],
  "basedOnInterests": ["Web Development", "JavaScript"]
}
```

---

## Progress APIs

### 6. Enroll in Course

**Endpoint:** `POST /api/progress/enroll`

**Description:** Enroll current user in a course

**Authentication:** Required (Student)

**Request Body:**
```json
{
  "courseId": "507f191e810c19729de860ea"
}
```

**Success Response:** `201 Created`
```json
{
  "message": "Successfully enrolled in course",
  "progress": {
    "_id": "progress_id",
    "userId": "user_id",
    "courseId": "course_id",
    "completedModules": [],
    "percentage": 0,
    "startedAt": "2026-02-14T10:00:00.000Z",
    "lastAccessed": "2026-02-14T10:00:00.000Z"
  }
}
```

**Error Responses:**

`400 Bad Request` - Already Enrolled
```json
{
  "message": "Already enrolled in this course"
}
```

`404 Not Found` - Course Doesn't Exist
```json
{
  "message": "Course not found"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/progress/enroll \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId": "507f191e810c19729de860ea"}'
```

---

### 7. Get User Progress

**Endpoint:** `GET /api/progress/my-courses`

**Description:** Get all enrolled courses with progress

**Authentication:** Required (Student)

**Success Response:** `200 OK`
```json
{
  "enrolledCourses": [
    {
      "_id": "progress_id",
      "courseId": {
        "_id": "course_id",
        "title": "React.js Course",
        "image": "...",
        "category": "Web Development",
        "modules": [...]
      },
      "completedModules": ["M1", "M2"],
      "percentage": 40,
      "startedAt": "2026-01-20T10:00:00.000Z",
      "lastAccessed": "2026-02-14T15:30:00.000Z"
    }
  ],
  "totalEnrolled": 3
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/progress/my-courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 8. Mark Module Complete

**Endpoint:** `POST /api/progress/complete-module`

**Description:** Mark a module as completed

**Authentication:** Required (Student)

**Request Body:**
```json
{
  "courseId": "507f191e810c19729de860ea",
  "moduleId": "M1"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Module marked as complete",
  "progress": {
    "_id": "progress_id",
    "courseId": "course_id",
    "completedModules": ["M1"],
    "percentage": 20,
    "lastAccessed": "2026-02-14T16:00:00.000Z"
  }
}
```

**Error Responses:**

`400 Bad Request` - Already Completed
```json
{
  "message": "Module already completed"
}
```

`404 Not Found` - Not Enrolled
```json
{
  "message": "You are not enrolled in this course"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/progress/complete-module \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "507f191e810c19729de860ea",
    "moduleId": "M1"
  }'
```

---

### 9. Get Progress for Specific Course

**Endpoint:** `GET /api/progress/:courseId`

**Description:** Get detailed progress for a single course

**Authentication:** Required (Student)

**URL Parameters:**
- `courseId`: Course ObjectId

**Success Response:** `200 OK`
```json
{
  "progress": {
    "_id": "progress_id",
    "userId": "user_id",
    "courseId": {
      "_id": "course_id",
      "title": "React.js Course",
      "modules": [
        {
          "moduleId": "M1",
          "title": "Introduction",
          "duration": "45 mins",
          "order": 1
        }
      ]
    },
    "completedModules": ["M1"],
    "percentage": 20,
    "startedAt": "2026-01-20T10:00:00.000Z",
    "lastAccessed": "2026-02-14T16:00:00.000Z"
  }
}
```

---

## User APIs

### 10. Get Current User Profile

**Endpoint:** `GET /api/users/profile`

**Description:** Get logged-in user's profile

**Authentication:** Required (Student/Admin)

**Success Response:** `200 OK`
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "interests": ["Web Development", "Data Science"],
    "role": "student",
    "createdAt": "2026-01-15T10:30:00.000Z"
  }
}
```

---

### 11. Update User Profile

**Endpoint:** `PUT /api/users/profile`

**Description:** Update user name and interests

**Authentication:** Required (Student/Admin)

**Request Body:**
```json
{
  "name": "John Updated",
  "interests": ["Web Development", "AI", "Cloud Computing"]
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Updated",
    "email": "john@example.com",
    "interests": ["Web Development", "AI", "Cloud Computing"],
    "role": "student"
  }
}
```

---

### 12. Change Password

**Endpoint:** `PUT /api/users/change-password`

**Description:** Change user password

**Authentication:** Required (Student/Admin)

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**

`400 Bad Request` - Wrong Current Password
```json
{
  "message": "Current password is incorrect"
}
```

---

## Admin APIs

### 13. Get Admin Dashboard Stats

**Endpoint:** `GET /api/admin/dashboard`

**Description:** Get analytics and statistics

**Authentication:** Required (Admin only)

**Success Response:** `200 OK`
```json
{
  "totalUsers": 245,
  "totalCourses": 12,
  "totalEnrollments": 487,
  "recentUsers": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-02-14T10:00:00.000Z"
    }
  ],
  "popularCourses": [
    {
      "_id": "course_id",
      "title": "React.js Course",
      "enrollmentCount": 56
    }
  ]
}
```

**Error Responses:**

`403 Forbidden` - Not Admin
```json
{
  "message": "Access denied. Admin role required."
}
```

---

### 14. Create Course (Admin)

**Endpoint:** `POST /api/admin/courses`

**Description:** Create a new course (admin only)

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "title": "Complete Node.js Course",
  "description": "Learn backend development with Node.js and Express",
  "image": "https://example.com/nodejs.jpg",
  "category": "Backend Development",
  "duration": "10 weeks",
  "level": "Intermediate",
  "modules": [
    {
      "moduleId": "M1",
      "title": "Introduction to Node.js",
      "content": "Node.js fundamentals and setup",
      "videoUrl": "https://youtube.com/watch?v=xyz",
      "duration": "30 mins",
      "order": 1
    },
    {
      "moduleId": "M2",
      "title": "Express.js Framework",
      "content": "Building APIs with Express",
      "videoUrl": "https://youtube.com/watch?v=abc",
      "duration": "60 mins",
      "order": 2
    }
  ]
}
```

**Validation Rules:**
- `title`: Required, min 5 characters
- `description`: Required, min 20 characters
- `modules`: Array with at least 1 module
- Each module must have unique `moduleId`
- Module `order` must be positive integers

**Success Response:** `201 Created`
```json
{
  "message": "Course created successfully",
  "course": {
    "_id": "new_course_id",
    "title": "Complete Node.js Course",
    "description": "Learn backend development with Node.js and Express",
    "image": "https://example.com/nodejs.jpg",
    "category": "Backend Development",
    "duration": "10 weeks",
    "level": "Intermediate",
    "modules": [...],
    "createdBy": "admin_id",
    "createdAt": "2026-02-14T17:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/admin/courses \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d @course_data.json
```

---

### 15. Update Course (Admin)

**Endpoint:** `PUT /api/admin/courses/:id`

**Description:** Update existing course

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id`: Course ObjectId

**Request Body:** (Same as Create course, all fields optional)
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "level": "Advanced"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Course updated successfully",
  "course": {
    "_id": "course_id",
    "title": "Updated Course Title",
    ...
  }
}
```

---

### 16. Delete Course (Admin)

**Endpoint:** `DELETE /api/admin/courses/:id`

**Description:** Delete a course and all related progress records

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id`: Course ObjectId

**Success Response:** `200 OK`
```json
{
  "message": "Course deleted successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/admin/courses/507f191e810c19729de860ea \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

---

### 17. Get All Users (Admin)

**Endpoint:** `GET /api/admin/users`

**Description:** Get list of all users

**Authentication:** Required (Admin only)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)
- `role`: Filter by role (student/admin)

**Success Response:** `200 OK`
```json
{
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "interests": ["Web Development"],
      "createdAt": "2026-01-15T10:30:00.000Z"
    }
  ],
  "totalUsers": 245,
  "currentPage": 1,
  "totalPages": 13
}
```

---

### 18. Delete User (Admin)

**Endpoint:** `DELETE /api/admin/users/:id`

**Description:** Delete user and all their progress

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id`: User ObjectId

**Success Response:** `200 OK`
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**

`400 Bad Request` - Cannot Delete Self
```json
{
  "message": "Cannot delete your own account"
}
```

---

## Certificate APIs

### 19. Generate Certificate

**Endpoint:** `POST /api/certificates/generate`

**Description:** Generate PDF certificate for completed course

**Authentication:** Required (Student)

**Request Body:**
```json
{
  "courseId": "507f191e810c19729de860ea"
}
```

**Success Response:** `200 OK` (PDF File Download)
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="certificate_React_John_Doe.pdf"`

**Error Responses:**

`400 Bad Request` - Course Not Completed
```json
{
  "message": "Course not completed yet. Complete all modules first."
}
```

`404 Not Found` - Not Enrolled
```json
{
  "message": "Not enrolled in this course"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/certificates/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId": "507f191e810c19729de860ea"}' \
  --output certificate.pdf
```

---

## Error Codes

### HTTP Status Codes Used

| Code | Meaning | Usage |
|------|---------|-------|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST (resource created) |
| `400` | Bad Request | Validation errors, invalid input |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Insufficient permissions (e.g., not admin) |
| `404` | Not Found | Resource doesn't exist |
| `500` | Internal Server Error | Server-side errors |

### Common Error Response Format
```json
{
  "message": "Descriptive error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Authentication Flow

### 1. Register/Login → Receive JWT Token
```javascript
// Store token in localStorage
localStorage.setItem('token', response.data.token);
```

### 2. Include Token in Subsequent Requests
```javascript
// Axios example
axios.get('/api/courses', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

### 3. Handle Token Expiration
```javascript
// If response is 401, redirect to login
if (error.response.status === 401) {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

---

## Rate Limiting

### Current Limits
- Authentication endpoints: **5 requests per 15 minutes** per IP
- Other endpoints: **100 requests per 15 minutes** per user
- Admin endpoints: **200 requests per 15 minutes**

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1645123456
```

---

## Postman Collection

### Import Instructions

1. **Create New Collection:** "Learning Platform API"

2. **Set Environment Variables:**
   ```
   base_url: http://localhost:5000/api
   token: (will be set after login)
   admin_token: (admin JWT)
   test_course_id: (any course ID for testing)
   ```

3. **Pre-request Script (for authenticated requests):**
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('token')
   });
   ```

4. **Test Scripts (auto-set token after login):**
   ```javascript
   // For /auth/login and /auth/register endpoints
   if (pm.response.code === 200 || pm.response.code === 201) {
     var jsonData = pm.response.json();
     pm.environment.set('token', jsonData.token);
   }
   ```

### Folder Structure in Postman
```
Learning Platform API/
├── Authentication/
│   ├── Register
│   └── Login
├── Courses/
│   ├── Get All Courses
│   ├── Get Course by ID
│   └── Get Recommended
├── Progress/
│   ├── Enroll in Course
│   ├── Get My Courses
│   ├── Mark Module Complete
│   └── Get Course Progress
├── User/
│   ├── Get Profile
│   ├── Update Profile
│   └── Change Password
├── Admin/
│   ├── Dashboard Stats
│   ├── Create Course
│   ├── Update Course
│   ├── Delete Course
│   ├── Get All Users
│   └── Delete User
└── Certificates/
    └── Generate Certificate
```

---

## Testing Workflow

### 1. Test Authentication
```bash
# Register new user
POST /api/auth/register

# Login
POST /api/auth/login
# Copy token from response
```

### 2. Test Course Browsing
```bash
# Get all courses
GET /api/courses

# Get specific course
GET /api/courses/{course_id}

# Get recommendations
GET /api/courses/recommended
```

### 3. Test Enrollment & Progress
```bash
# Enroll in course
POST /api/progress/enroll
Body: {"courseId": "..."}

# Get my enrollments
GET /api/progress/my-courses

# Complete a module
POST /api/progress/complete-module
Body: {"courseId": "...", "moduleId": "M1"}

# Check progress
GET /api/progress/{course_id}
```

### 4. Test Admin Functions (requires admin token)
```bash
# Get dashboard
GET /api/admin/dashboard

# Create course
POST /api/admin/courses
Body: {course data with modules}

# Get all users
GET /api/admin/users

# Delete course
DELETE /api/admin/courses/{course_id}
```

---

## API Response Times (Target)

| Endpoint Type | Target Response Time |
|---------------|---------------------|
| Authentication | < 200ms |
| Simple Queries (Get single resource) | < 100ms |
| List Queries (Paginated) | < 300ms |
| Create/Update Operations | < 250ms |
| Delete Operations | < 200ms |
| Certificate Generation | < 2000ms |

---

## Sample API Call Examples (JavaScript/Axios)

### Register User
```javascript
const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/register',
      userData
    );
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};
```

### Get Courses with Filtering
```javascript
const getCourses = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(
    `http://localhost:5000/api/courses?${params}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data;
};

// Usage
getCourses({ category: 'Web Development', level: 'Beginner' });
```

### Enroll in Course
```javascript
const enrollInCourse = async (courseId) => {
  const response = await axios.post(
    'http://localhost:5000/api/progress/enroll',
    { courseId },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data;
};
```

---

## Versioning

**Current Version:** v1

Future versions will use URL versioning:
- v1: `/api/v1/...`
- v2: `/api/v2/...`

---

## Support & Contact

For API issues or questions:
- Email: api-support@example.com
- Documentation: https://docs.example.com/api
- Status Page: https://status.example.com

---

