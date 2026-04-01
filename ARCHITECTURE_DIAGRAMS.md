# System Architecture & Flow Diagrams

## Overview

This document provides comprehensive visual representations of the Learning Platform's architecture, data flow, and system interactions.

---

## 1. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│   │  Public Pages    │  │  Student Portal  │  │  Admin Panel     │  │
│   │  ─────────────   │  │  ──────────────  │  │  ───────────     │  │
│   │  • Landing       │  │  • Dashboard     │  │  • Analytics     │  │
│   │  • Login         │  │  • Courses       │  │  • User Mgmt     │  │
│   │  • Register      │  │  • My Progress   │  │  • Course Mgmt   │  │
│   └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  │
│            │                     │                      │             │
│            └─────────────────────┴──────────────────────┘             │
│                                  │                                    │
│                       React Router (SPA)                              │
│                                  │                                    │
└──────────────────────────────────┼────────────────────────────────────┘
                                   │
                                   │ HTTPS
                                   │ Axios HTTP Client
                                   │
┌──────────────────────────────────▼────────────────────────────────────┐
│                          APPLICATION LAYER                            │
├───────────────────────────────────────────────────────────────────────┤
│                         Express.js Server                             │
│                                                                       │
│   ┌─────────────────────  MIDDLEWARE STACK  ─────────────────────┐  │
│   │                                                                │  │
│   │  1. CORS           → Cross-origin policy                      │  │
│   │  2. Helmet         → Security headers                         │  │
│   │  3. Rate Limiter   → DDoS protection                          │  │
│   │  4. Body Parser    → JSON/URL encoding                        │  │
│   │  5. Auth (JWT)     → Token verification                       │  │
│   │  6. Role Check     → Permission validation                    │  │
│   │                                                                │  │
│   └────────────────────────────────┬───────────────────────────────┘  │
│                                    │                                   │
│   ┌────────────────────────────────▼───────────────────────────────┐  │
│   │                         ROUTE HANDLERS                         │  │
│   ├────────────────────────────────────────────────────────────────┤  │
│   │                                                                │  │
│   │  /api/auth          →  authRoutes      (Public)               │  │
│   │  /api/courses       →  courseRoutes    (Protected)            │  │
│   │  /api/progress      →  progressRoutes  (Protected)            │  │
│   │  /api/users         →  userRoutes      (Protected)            │  │
│   │  /api/admin         →  adminRoutes     (Admin Only)           │  │
│   │  /api/certificates  →  certificateRoutes (Protected)          │  │
│   │                                                                │  │
│   └────────────────────────────────┬───────────────────────────────┘  │
│                                    │                                   │
│   ┌────────────────────────────────▼───────────────────────────────┐  │
│   │                       BUSINESS LOGIC                           │  │
│   ├────────────────────────────────────────────────────────────────┤  │
│   │                                                                │  │
│   │  • authController      → Authentication & Authorization       │  │
│   │  • courseController    → Course CRUD operations               │  │
│   │  • progressController  → Enrollment & Progress tracking       │  │
│   │  • userController      → User profile management              │  │
│   │  • adminController     → Admin operations & analytics         │  │
│   │  • certificateController → PDF generation                     │  │
│   │                                                                │  │
│   └────────────────────────────────┬───────────────────────────────┘  │
│                                    │                                   │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
                                     │ Mongoose ODM
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                          DATA LAYER                                    │
├────────────────────────────────────────────────────────────────────────┤
│                         MongoDB Database                               │
│                                                                        │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│   │   users      │  │   courses    │  │  progresses  │              │
│   │  Collection  │  │  Collection  │  │  Collection  │              │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│          │                 │                  │                       │
│          └────────────────┬┴──────────────────┘                       │
│                           │                                            │
│                           │ Indexes & Relationships                    │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Component Architecture

### Frontend Architecture (React SPA)

```
frontend/
│
├── public/
│   └── index.html                 ← Single HTML entry point
│
├── src/
│   ├── index.js                   ← App initialization
│   ├── App.js                     ← Root component with routing
│   │
│   ├── components/                ← Reusable UI components
│   │   └── Sidebar.js
│   │
│   ├── pages/                     ← Route-level components
│   │   ├── Landing.js             ← Public page
│   │   ├── Login.js               ← Authentication
│   │   ├── Register.js            ← User registration
│   │   ├── Dashboard.js           ← Student dashboard
│   │   ├── Courses.js             ← Browse courses
│   │   ├── CourseDetail.js        ← Single course view
│   │   ├── MyCourses.js           ← User's enrolled courses
│   │   └── AdminPanel.js          ← Admin interface
│   │
│   └── utils/
│       ├── api.js                 ← Axios instance with interceptors
│       └── theme.js               ← Design system constants
│
└── package.json
```

**Component Communication:**
```
┌──────────────────────────────────────────────────────┐
│                    App.js                            │
│  ┌────────────────────────────────────────────┐     │
│  │         React Router                       │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐ │     │
│  │  │ Public   │  │ Student  │  │  Admin   │ │     │
│  │  │ Routes   │  │ Routes   │  │  Routes  │ │     │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘ │     │
│  └───────┼─────────────┼─────────────┼────────┘     │
│          │             │             │               │
│          ▼             ▼             ▼               │
│    ┌─────────┐   ┌─────────┐   ┌─────────┐         │
│    │ Landing │   │Dashboard│   │  Admin  │         │
│    │  Login  │   │ Courses │   │  Panel  │         │
│    │Register │   │MyProgress│   │         │         │
│    └────┬────┘   └────┬────┘   └────┬────┘         │
│         │             │             │               │
│         └─────────────┴─────────────┘               │
│                       │                             │
│                  ┌────▼────┐                        │
│                  │ api.js  │                        │
│                  │ (Axios) │                        │
│                  └─────────┘                        │
└──────────────────────────────────────────────────────┘
```

### Backend Architecture (Express.js)

```
backend/
│
├── server.js                      ← Entry point
│
├── config/
│   └── db.js                      ← MongoDB connection
│
├── models/                        ← Data schemas
│   ├── User.js                    ← User schema with bcrypt hooks
│   ├── Course.js                  ← Course schema with embedded modules
│   └── Progress.js                ← Progress tracking schema
│
├── controllers/                   ← Business logic
│   ├── authController.js          ← Register, login, JWT
│   ├── courseController.js        ← Course CRUD
│   ├── progressController.js      ← Enrollment, progress tracking
│   ├── userController.js          ← Profile management
│   ├── adminController.js         ← Admin operations
│   └── certificateController.js   ← PDF generation
│
├── routes/                        ← API endpoints
│   ├── authRoutes.js              ← POST /register, /login
│   ├── courseRoutes.js            ← GET /courses, /courses/:id
│   ├── progressRoutes.js          ← POST /enroll, /complete-module
│   ├── userRoutes.js              ← GET/PUT /profile
│   ├── adminRoutes.js             ← POST/PUT/DELETE /courses
│   └── certificateRoutes.js       ← POST /generate
│
├── middleware/
│   └── auth.js                    ← JWT verification, role checking
│
├── utils/
│   └── badges.js                  ← Helper functions
│
└── package.json
```

---

## 3. Authentication Flow Diagram

```
┌─────────────┐                                    ┌─────────────┐
│   Client    │                                    │   Server    │
│  (Browser)  │                                    │  (Express)  │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. POST /api/auth/register                     │
       │     Body: {name, email, password, interests}    │
       ├─────────────────────────────────────────────────►
       │                                                  │
       │                                2. Validate input │
       │                                3. Check if email exists
       │                                4. Hash password (bcrypt)
       │                                5. Create user in DB
       │                                6. Generate JWT token
       │                                                  │
       │  7. Response: {token, user}                     │
       │◄─────────────────────────────────────────────────┤
       │                                                  │
       │  8. Store token in localStorage                 │
       │     localStorage.setItem('token', token)        │
       │                                                  │
       │  ═══════════════════════════════════════════   │
       │                                                  │
       │  9. GET /api/courses                            │
       │     Headers: {Authorization: Bearer <token>}    │
       ├─────────────────────────────────────────────────►
       │                                                  │
       │                               10. Extract token  │
       │                               11. Verify JWT     │
       │                               12. Check if user exists
       │                               13. Attach user to req.user
       │                               14. Execute route handler
       │                               15. Query courses from DB
       │                                                  │
       │  16. Response: {courses: [...]}                 │
       │◄─────────────────────────────────────────────────┤
       │                                                  │
       │  17. Render courses on UI                       │
       │                                                  │
```

### JWT Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "id": "507f1f77bcf86cd799439011",
  "role": "student",
  "iat": 1645123456,
  "exp": 1645209856
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

---

## 4. Data Flow: Course Enrollment

```
┌───────────┐         ┌───────────┐         ┌───────────┐
│  Student  │         │  Backend  │         │  MongoDB  │
└─────┬─────┘         └─────┬─────┘         └─────┬─────┘
      │                     │                     │
      │ 1. Click "Enroll"   │                     │
      │     (CourseDetail)  │                     │
      │                     │                     │
      │ 2. POST /api/progress/enroll             │
      │    Body: {courseId} │                     │
      ├────────────────────►│                     │
      │                     │                     │
      │                     │ 3. Verify JWT       │
      │                     │    Get userId       │
      │                     │                     │
      │                     │ 4. Check if already enrolled
      │                     ├────────────────────►│
      │                     │ Query: {userId, courseId}
      │                     │◄────────────────────┤
      │                     │ Result: null (not enrolled)
      │                     │                     │
      │                     │ 5. Verify course exists
      │                     ├────────────────────►│
      │                     │ Query: Course.findById(courseId)
      │                     │◄────────────────────┤
      │                     │ Result: {course data}
      │                     │                     │
      │                     │ 6. Create Progress record
      │                     ├────────────────────►│
      │                     │ Insert: {            │
      │                     │   userId,            │
      │                     │   courseId,          │
      │                     │   completedModules: [],
      │                     │   percentage: 0      │
      │                     │ }                    │
      │                     │◄────────────────────┤
      │                     │ Result: {progress doc}
      │                     │                     │
      │ 7. Response: 201    │                     │
      │    {progress data}  │                     │
      │◄────────────────────┤                     │
      │                     │                     │
      │ 8. Update UI        │                     │
      │    Show success msg │                     │
      │    Redirect to      │                     │
      │    "My Courses"     │                     │
      │                     │                     │
```

---

## 5. Module Completion Flow

```
User marks Module as Complete
         │
         ▼
┌────────────────────────────────────────┐
│  POST /api/progress/complete-module    │
│  Body: {courseId, moduleId}            │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│  Verify JWT & Extract userId           │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│  Find Progress record                  │
│  Query: {userId, courseId}             │
└────────────────┬───────────────────────┘
                 │
                 ▼
         ┌───────┴───────┐
         │  Found?       │
         └───────┬───────┘
           No │     │ Yes
              │     │
              ▼     ▼
         ┌─────┐   ┌─────────────────────────┐
         │ 404 │   │ Check if already        │
         │     │   │ completed               │
         └─────┘   └───────┬─────────────────┘
                           │
                           ▼
                   ┌───────┴────────┐
                   │  Already done? │
                   └───────┬────────┘
                     No │      │ Yes
                        │      │
                        ▼      ▼
                   ┌─────────┐ ┌─────┐
                   │ Proceed │ │ 400 │
                   └────┬────┘ └─────┘
                        │
                        ▼
         ┌──────────────────────────────────┐
         │ Add moduleId to completedModules │
         │ Array                            │
         └──────────────┬───────────────────┘
                        │
                        ▼
         ┌──────────────────────────────────┐
         │ Calculate percentage:            │
         │ (completed/total) × 100          │
         └──────────────┬───────────────────┘
                        │
                        ▼
         ┌──────────────────────────────────┐
         │ Update lastAccessed timestamp    │
         └──────────────┬───────────────────┘
                        │
                        ▼
         ┌──────────────────────────────────┐
         │ Save to database                 │
         └──────────────┬───────────────────┘
                        │
                        ▼
         ┌──────────────────────────────────┐
         │ Return updated progress          │
         │ Response: 200                    │
         │ {completedModules, percentage}   │
         └──────────────────────────────────┘
```

---

## 6. Admin Course Creation Flow

```
Admin Panel
    │
    ▼
Fill Course Form
    │
    ├─── Title
    ├─── Description
    ├─── Category
    ├─── Level
    ├─── Duration
    ├─── Image URL
    └─── Modules (array)
         ├── Module 1: {moduleId, title, content, videoUrl, duration, order}
         ├── Module 2: {moduleId, title, content, videoUrl, duration, order}
         └── Module N: ...
    │
    ▼
Click "Create Course"
    │
    ▼
┌────────────────────────────────────┐
│  POST /api/admin/courses           │
│  Headers: {Authorization: Bearer}  │
│  Body: {course data}               │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Middleware: auth                  │
│  - Verify JWT                      │
│  - Extract user from token         │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Middleware: isAdmin               │
│  - Check req.user.role === 'admin' │
└──────────────┬─────────────────────┘
               │ (If not admin → 403)
               ▼
┌────────────────────────────────────┐
│  Controller: createCourse          │
│                                    │
│  1. Validate input                 │
│     - Title min 5 chars            │
│     - Description min 20 chars     │
│     - At least 1 module            │
│     - Unique moduleIds             │
│                                    │
│  2. Set createdBy = req.user._id   │
│                                    │
│  3. Create Course document         │
│                                    │
│  4. Save to MongoDB                │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Response: 201 Created             │
│  {message, course}                 │
└──────────────┬─────────────────────┘
               │
               ▼
Display Success Message
Redirect to Courses List
```

---

## 7. Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: NETWORK SECURITY                                 │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • HTTPS/TLS encryption                            │    │
│  │  • CORS origin validation                          │    │
│  │  • Rate limiting (DDoS protection)                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 2: APPLICATION SECURITY                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • Helmet.js security headers                      │    │
│  │  • Input validation (Mongoose schemas)             │    │
│  │  • Output sanitization                             │    │
│  │  • Error handling (no stack traces in prod)        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 3: AUTHENTICATION & AUTHORIZATION                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • JWT token verification                          │    │
│  │  • Token expiration (24 hours)                     │    │
│  │  • Role-based access control (RBAC)                │    │
│  │  • Protected route middleware                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 4: DATA SECURITY                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • Password hashing (bcrypt, 10 rounds)            │    │
│  │  • MongoDB injection prevention                    │    │
│  │  • Sensitive data exclusion from responses         │    │
│  │  • Database connection encryption                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Deployment Architecture

```
                    ┌──────────────────┐
                    │   End Users      │
                    └────────┬─────────┘
                             │
                             │ HTTPS
                             │
                ┌────────────▼─────────────┐
                │    CDN (Vercel Edge)     │
                │  • Global caching        │
                │  • DDoS protection       │
                └────────────┬─────────────┘
                             │
           ┌─────────────────┴──────────────────┐
           │                                    │
           ▼                                    ▼
┌─────────────────────┐            ┌───────────────────────┐
│  Frontend (Vercel)  │            │  Backend (Render)     │
│  ─────────────────  │            │  ───────────────      │
│  • React SPA        │            │  • Express.js API     │
│  • Static files     │◄──────────►│  • JWT auth           │
│  • Automatic deploy │   HTTPS    │  • Business logic     │
│  • SSL certificate  │            │  • Auto-deploy        │
└─────────────────────┘            └──────────┬────────────┘
                                              │
                                              │ MongoDB Protocol
                                              │ (Encrypted)
                                              │
                                   ┌──────────▼──────────┐
                                   │  MongoDB Atlas      │
                                   │  ─────────────      │
                                   │  • Managed cluster  │
                                   │  • Auto backups     │
                                   │  • Replication      │
                                   │  • Monitoring       │
                                   └─────────────────────┘


┌────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Git Push to main                                         │
│       │                                                    │
│       ▼                                                    │
│  GitHub Actions                                           │
│       │                                                    │
│       ├─── Run Tests (Jest)                               │
│       │                                                    │
│       ├─── Build Frontend (npm run build)                 │
│       │                                                    │
│       ├─── Deploy Frontend → Vercel (automatic)           │
│       │                                                    │
│       └─── Deploy Backend → Render (automatic)            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 9. Request-Response Cycle

```
┌──────────────────────────────────────────────────────────────────┐
│                  Complete HTTP Request Cycle                     │
└──────────────────────────────────────────────────────────────────┘

User clicks "Enroll in Course" button
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│  1. EVENT HANDLER (React Component)                         │
│     const handleEnroll = async () => {                       │
│       setLoading(true);                                     │
│       await api.post('/progress/enroll', {courseId});       │
│       setLoading(false);                                    │
│     }                                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  2. API UTILITY (Axios Instance)                            │
│     Interceptor adds:                                       │
│     - Authorization: Bearer <token>                         │
│     - Content-Type: application/json                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼ HTTP POST Request
                   │
┌──────────────────┴──────────────────────────────────────────┐
│  3. EXPRESS SERVER                                          │
│                                                             │
│     MIDDLEWARE STACK (executes in order):                   │
│     ┌───────────────────────────────────────────────────┐  │
│     │ a) CORS          → Check origin                   │  │
│     │ b) Body Parser   → Parse JSON body                │  │
│     │ c) Rate Limiter  → Check request count            │  │
│     │ d) Auth          → Verify JWT, get user           │  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
│     ROUTE MATCHING:                                        │
│     POST /api/progress/enroll → progressRoutes             │
│                                                             │
│     CONTROLLER EXECUTION:                                   │
│     progressController.enrollInCourse()                    │
│     ┌───────────────────────────────────────────────────┐  │
│     │ - Validate courseId                               │  │
│     │ - Check if already enrolled                       │  │
│     │ - Verify course exists                            │  │
│     │ - Create Progress document                        │  │
│     │ - Save to database                                │  │
│     └───────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  4. MONGOOSE ODM                                            │
│     Progress.create({                                       │
│       userId: req.user._id,                                 │
│       courseId: req.body.courseId,                          │
│       completedModules: [],                                 │
│       percentage: 0                                         │
│     })                                                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼ MongoDB Wire Protocol
                   │
┌──────────────────┴──────────────────────────────────────────┐
│  5. MONGODB DATABASE                                        │
│     - Validate schema                                       │
│     - Check unique constraints                              │
│     - Insert document                                       │
│     - Return inserted document with _id                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼ Returns Document
                   │
┌──────────────────┴──────────────────────────────────────────┐
│  6. CONTROLLER SENDS RESPONSE                               │
│     res.status(201).json({                                  │
│       message: "Successfully enrolled",                     │
│       progress: {...}                                       │
│     });                                                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼ HTTP Response
                   │
┌──────────────────┴──────────────────────────────────────────┐
│  7. AXIOS INTERCEPTOR (Frontend)                            │
│     - Check response status                                 │
│     - Handle errors (401 → logout)                          │
│     - Return response data                                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  8. REACT COMPONENT UPDATE                                  │
│     - setLoading(false)                                     │
│     - Show success toast                                    │
│     - Update UI state                                       │
│     - Redirect to "My Courses"                              │
└─────────────────────────────────────────────────────────────┘

Total Time: ~200-500ms
```

---

## 10. Database Query Optimization

```
Unoptimized Query (Slow):
┌─────────────────────────────────────────┐
│  Progress.find({ userId })              │
│    .populate('courseId')                │
│    .exec()                              │
└─────────────────────────────────────────┘
         │
         ▼ Full course documents loaded
    Time: ~500ms

Optimized Query (Fast):
┌─────────────────────────────────────────┐
│  Progress.find({ userId })              │
│    .populate('courseId', 'title image') │ ← Select specific fields
│    .select('completedModules percentage')│ ← Limit progress fields
│    .lean()                              │ ← Plain JS objects
│    .exec()                              │
└─────────────────────────────────────────┘
         │
         ▼ Minimal data transfer
    Time: ~100ms

Indexes Used:
- Progress: {userId: 1, courseId: 1} (compound unique)
- Course: {category: 1}, {level: 1}
- User: {email: 1} (unique)
```

---

## 11. Error Propagation Flow

```
Database Error
      │
      ▼
┌──────────────────────┐
│  Mongoose throws     │
│  ValidationError     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Controller catches error    │
│  next(error)                 │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Error Handler Middleware            │
│  ┌────────────────────────────────┐  │
│  │  Check error type:             │  │
│  │  - ValidationError → 400       │  │
│  │  - CastError → 404             │  │
│  │  - Duplicate key → 400         │  │
│  │  - JWT Error → 401             │  │
│  │  - Default → 500               │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Response sent                  │
│  {                              │
│    success: false,              │
│    message: "Validation failed",│
│    ...(stack in dev mode)       │
│  }                              │
└──────┬──────────────────────────┘
       │
       ▼ HTTP Response (400)
       │
┌──────┴──────────────────────────┐
│  Axios interceptor (Frontend)   │
│  - Catch error                  │
│  - Display user-friendly message│
│  - Log to console (dev)         │
└─────────────────────────────────┘
```

---

