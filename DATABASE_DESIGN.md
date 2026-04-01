# Database Design & ER Diagram

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA DESIGN                          │
└─────────────────────────────────────────────────────────────────────────┘


    ┌──────────────────────┐
    │       USER           │
    │──────────────────────│
    │ _id: ObjectId (PK)   │◄──────────┐
    │ name: String         │           │
    │ email: String UNIQUE │           │ 1
    │ password: String     │           │
    │ interests: [String]  │           │ (created by)
    │ role: String         │           │
    │ createdAt: Date      │           │
    └──────────┬───────────┘           │
               │                       │
               │ 1                     │
               │                       │
               │ enrolledIn            │
               │                       │
               │ N                     │
               │                  ┌────┴──────────────┐
    ┌──────────▼───────────┐     │     COURSE        │
    │      PROGRESS        │     │───────────────────│
    │──────────────────────│  N  │ _id: ObjectId(PK) │
    │ _id: ObjectId (PK)   │◄────┤ title: String     │
    │ userId: ObjectId(FK) │     │ description: Text │
    │ courseId: ObjectId(FK)│     │ image: String URL │
    │ completedModules: [] │     │ category: String  │
    │ percentage: Number   │     │ duration: String  │
    │ startedAt: Date      │     │ level: String     │
    │ lastAccessed: Date   │     │ createdBy: ObjId  │
    └──────────────────────┘     │ modules: [Module] │
                                 │ createdAt: Date   │
                                 └───────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         EMBEDDED SCHEMA (Module)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Module (Embedded in Course)                                           │
│  ├── moduleId: String                                                  │
│  ├── title: String                                                     │
│  ├── content: String                                                   │
│  ├── videoUrl: String (optional)                                       │
│  ├── duration: String                                                  │
│  └── order: Number                                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Entity Descriptions

### 1. USER Entity

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| `_id` | ObjectId | PRIMARY KEY | Auto-generated MongoDB ID |
| `name` | String | NOT NULL, min: 2 chars | User's full name |
| `email` | String | UNIQUE, NOT NULL, valid email | User's email address |
| `password` | String | NOT NULL, min: 6 chars, hashed | bcrypt hashed password |
| `interests` | Array[String] | default: [] | User selected interests |
| `role` | String | enum: ['student', 'admin'], default: 'student' | User role |
| `createdAt` | Date | auto-generated | Account creation timestamp |

**Indexes:**
- Unique index on `email`
- Index on `role` for admin queries

**Business Rules:**
- Email must be unique across the system
- Password hashed using bcrypt with 10 salt rounds
- Default role is 'student'
- Interests used for course recommendations

---

### 2. COURSE Entity

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| `_id` | ObjectId | PRIMARY KEY | Auto-generated MongoDB ID |
| `title` | String | NOT NULL, min: 5 chars | Course title |
| `description` | String | NOT NULL, min: 20 chars | Course description |
| `image` | String | valid URL | Course thumbnail image |
| `category` | String | NOT NULL | Course category/interest area |
| `duration` | String | NOT NULL | Estimated completion time |
| `level` | String | enum: ['Beginner', 'Intermediate', 'Advanced'] | Difficulty level |
| `createdBy` | ObjectId | FOREIGN KEY → User._id | Admin who created the course |
| `modules` | Array[Module] | min: 1 module | Embedded module documents |
| `createdAt` | Date | auto-generated | Course creation timestamp |

**Indexes:**
- Index on `category` for filtering
- Index on `level` for difficulty-based searches
- Text index on `title` and `description` for search

**Business Rules:**
- Must have at least one module
- Only admins can create/modify courses
- Category must match user interest options

---

### 3. PROGRESS Entity

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| `_id` | ObjectId | PRIMARY KEY | Auto-generated MongoDB ID |
| `userId` | ObjectId | FOREIGN KEY → User._id, NOT NULL | Student reference |
| `courseId` | ObjectId | FOREIGN KEY → Course._id, NOT NULL | Course reference |
| `completedModules` | Array[String] | default: [] | Array of completed moduleIds |
| `percentage` | Number | min: 0, max: 100, default: 0 | Completion percentage |
| `startedAt` | Date | auto-generated | Enrollment timestamp |
| `lastAccessed` | Date | auto-updated | Last activity timestamp |

**Indexes:**
- Compound index on `(userId, courseId)` - UNIQUE
- Index on `userId` for user dashboard queries

**Business Rules:**
- One progress record per user-course pair
- Percentage auto-calculated: (completedModules.length / totalModules) × 100
- `lastAccessed` updated on each module interaction

---

### 4. MODULE Sub-Schema (Embedded in Course)

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| `moduleId` | String | REQUIRED, unique within course | Short identifier (e.g., "M1") |
| `title` | String | REQUIRED, min: 3 chars | Module title |
| `content` | String | REQUIRED | Module text content/description |
| `videoUrl` | String | optional, valid URL | YouTube or video link |
| `duration` | String | REQUIRED | Estimated time (e.g., "30 mins") |
| `order` | Number | REQUIRED, positive integer | Display order |

**Business Rules:**
- `moduleId` must be unique within a course
- Modules displayed in ascending `order`

---

## Relationships

### 1. User → Progress (One-to-Many)
- **Type:** 1:N
- **Description:** A user can have multiple progress records (one per enrolled course)
- **Implementation:** Progress schema has `userId` foreign key
- **Cascade:** Delete user → Delete all their progress records

### 2. Course → Progress (One-to-Many)
- **Type:** 1:N
- **Description:** A course can be enrolled by multiple users
- **Implementation:** Progress schema has `courseId` foreign key
- **Cascade:** Delete course → Delete all related progress records

### 3. User → Course (via createdBy)
- **Type:** 1:N
- **Description:** Admin user creates multiple courses
- **Implementation:** Course schema has `createdBy` foreign key
- **Cascade:** Soft constraint (admin deletion restricted if courses exist)

### 4. Course → Modules (One-to-Many Embedded)
- **Type:** 1:N (Embedded)
- **Description:** A course contains multiple modules
- **Implementation:** MongoDB embedded documents array
- **Cascade:** Delete course → Delete all embedded modules

---

## Sample Data Structures

### Sample User Document
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$rV8Y.LvQz8dH6z3J9.Q8xOw...",
  "interests": ["Web Development", "Data Science"],
  "role": "student",
  "createdAt": "2026-01-15T10:30:00.000Z"
}
```

### Sample Course Document (with embedded modules)
```json
{
  "_id": "507f191e810c19729de860ea",
  "title": "Complete React.js Course",
  "description": "Master React from basics to advanced concepts",
  "image": "https://example.com/react-course.jpg",
  "category": "Web Development",
  "duration": "8 weeks",
  "level": "Intermediate",
  "createdBy": "507f1f77bcf86cd799439011",
  "modules": [
    {
      "moduleId": "M1",
      "title": "Introduction to React",
      "content": "Overview of React library and ecosystem...",
      "videoUrl": "https://youtube.com/watch?v=xyz",
      "duration": "45 mins",
      "order": 1
    },
    {
      "moduleId": "M2",
      "title": "Components and Props",
      "content": "Deep dive into React components...",
      "videoUrl": "https://youtube.com/watch?v=abc",
      "duration": "60 mins",
      "order": 2
    }
  ],
  "createdAt": "2026-01-10T08:00:00.000Z"
}
```

### Sample Progress Document
```json
{
  "_id": "507f191e810c19729de860eb",
  "userId": "507f1f77bcf86cd799439011",
  "courseId": "507f191e810c19729de860ea",
  "completedModules": ["M1"],
  "percentage": 50,
  "startedAt": "2026-01-20T14:30:00.000Z",
  "lastAccessed": "2026-01-21T16:45:00.000Z"
}
```

---

## Normalization Level

**Third Normal Form (3NF)**

### Why 3NF?
1. ✅ **1NF:** All attributes contain atomic values (no multi-valued attributes except arrays which are native to MongoDB)
2. ✅ **2NF:** No partial dependencies (all non-key attributes fully depend on primary key)
3. ✅ **3NF:** No transitive dependencies (non-key attributes don't depend on other non-key attributes)

### Design Decisions:
- **Embedded Modules:** Chosen for performance (modules always accessed with course)
- **Separate Progress:** Normalized to avoid duplication and enable efficient queries
- **Denormalized createdBy:** Stores ObjectId reference for flexibility

---

##Constraints & Validations

### Application-Level Validations (Mongoose)
```javascript
// User Schema Validations
- email: required, unique, lowercase, validate email format
- password: required, minlength 6, hashed before save
- name: required, trim, minlength 2
- interests: array of strings
- role: enum ['student', 'admin']

// Course Schema Validations
- title: required, trim, minlength 5
- description: required, minlength 20
- category: required
- level: enum ['Beginner', 'Intermediate', 'Advanced']
- modules: required, minlength 1

// Progress Schema Validations
- userId: required, ref 'User'
- courseId: required, ref 'Course'
- percentage: number, min 0, max 100
- unique compound index: [userId, courseId]
```

### Database-Level Constraints
- Unique indexes on User.email
- Compound unique index on Progress (userId + courseId)
- Foreign key references via ObjectId

---

## Query Optimization Strategies

### Indexes Created
```javascript
// User Collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })

// Course Collection
db.courses.createIndex({ "category": 1 })
db.courses.createIndex({ "level": 1 })
db.courses.createIndex({ "title": "text", "description": "text" })

// Progress Collection
db.progress.createIndex({ "userId": 1, "courseId": 1 }, { unique: true })
db.progress.createIndex({ "userId": 1 })
```

### Query Patterns
1. **Find courses by category:** Uses category index
2. **Find user progress:** Uses compound index (userId, courseId)
3. **Dashboard queries:** Uses userId index for all user enrollments
4. **Search courses:** Uses text index on title/description

---

## Data Integrity Rules

1. **Referential Integrity:**
   - Progress.userId must reference existing User._id
   - Progress.courseId must reference existing Course._id
   - Course.createdBy must reference existing User._id with role='admin'

2. **Business Logic Integrity:**
   - Progress percentage = (completedModules.length / course.modules.length) × 100
   - User cannot enroll in same course twice (enforced by unique compound index)
   - Only admin role can create/update/delete courses

3. **Data Validation:**
   - Email format validation
   - Password strength enforcement (min 6 characters)
   - Module order must be sequential positive integers
   - Percentage must be between 0-100

---

## Scalability Considerations

### Current Design (Suitable for <100K users)
- Embedded modules for faster reads
- Simple references for relationships

### Future Scaling Options (>100K users)
1. **Sharding Strategy:** Shard by userId for Progress collection
2. **Separate Modules Collection:** Extract modules if courses become very large (>50 modules)
3. **Caching Layer:** Redis for frequently accessed courses
4. **Read Replicas:** MongoDB replicas for read-heavy operations

---

## Migration Scripts

### Initial Schema Setup
```javascript
// Run after first deployment
db.createCollection("users")
db.createCollection("courses")
db.createCollection("progresses")

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.progress.createIndex({ userId: 1, courseId: 1 }, { unique: true })
```

---

## Backup Strategy

1. **Daily Automated Backups:** MongoDB Atlas automatic backups (if cloud-hosted)
2. **Weekly Manual Exports:** `mongodump` for local backups
3. **Version Control:** Seed data scripts in Git repository
4. **Point-in-Time Recovery:** Enabled through MongoDB Atlas

---

