# Quick Setup Guide

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (check with `node --version`)
- ✅ MongoDB installed (check with `mongod --version`)
- ✅ A code editor (VS Code recommended)
- ✅ A web browser (Chrome/Firefox)

---

## 5-Minute Quick Start

### Step 1: Start MongoDB (1 minute)

**Windows:**
```bash
# Open Command Prompt and run:
mongod
```

**Keep this terminal open!**

### Step 2: Setup Backend (2 minutes)

Open a new terminal:
```bash
# Navigate to backend folder
cd backend

# Install packages (first time only)
npm install

# Add sample data to database
node seedData.js

# Start backend server
npm start
```

You should see: ✓ "Connected to MongoDB database successfully!"

**Keep this terminal running!**

### Step 3: Setup Frontend (2 minutes)

Open another new terminal:
```bash
# Navigate to frontend folder
cd frontend

# Install packages (first time only)
npm install

# Start React app
npm start
```

Browser will automatically open at `http://localhost:3000`

---

## First Time Setup - Detailed

### 1. Install MongoDB

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer (default settings)
3. Add to PATH (installer option)

**Check installation:**
```bash
mongo --version
```

### 2. Install Node.js

Download from: https://nodejs.org/
- Choose LTS (Long Term Support) version
- Run installer with default settings

**Check installation:**
```bash
node --version
npm --version
```

### 3. Project Setup

1. **Extract/Navigate to project folder**
   ```bash
   cd learning-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   This installs:
   - express
   - mongoose
   - bcryptjs
   - jsonwebtoken
   - cors
   - dotenv

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   
   This installs:
   - react
   - react-dom
   - react-router-dom
   - axios

### 4. Add Sample Data

```bash
cd backend
node seedData.js
```

This creates sample users and courses.

---

## Daily Usage

### Starting the Application

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

### Stopping the Application

Press `Ctrl+C` in each terminal to stop servers.

---

## Login Credentials

After seeding database, use these to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Student | john@example.com | john123 |
| Student | jane@example.com | jane123 |

---

## Common Issues & Solutions

### Issue 1: "Port 5000 already in use"
**Solution:** 
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env
PORT=5001
```

### Issue 2: "MongoDB connection failed"
**Solution:**
1. Make sure MongoDB is running (`mongod` command)
2. Check MONGODB_URI in `.env` file
3. Try: `mongodb://127.0.0.1:27017/learning_platform`

### Issue 3: "Cannot connect to backend"
**Solution:**
1. Verify backend is running on port 5000
2. Check `API_URL` in `frontend/src/utils/api.js`
3. Make sure CORS is enabled

### Issue 4: "npm install fails"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue 5: "Module not found error"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

## Folder Structure Overview

```
learning-platform/
│
├── backend/                 # Server-side code
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth middleware
│   ├── models/             # Database schemas
│   ├── routes/             # API routes
│   ├── .env                # Environment variables
│   ├── server.js           # Entry point
│   └── seedData.js         # Sample data script
│
├── frontend/               # Client-side code
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Helper functions
│   │   ├── App.js         # Main component
│   │   └── index.js       # Entry point
│   └── package.json
│
├── README.md              # Main documentation
├── VIVA_QUESTIONS.md      # Q&A for viva
├── PRESENTATION_GUIDE.md  # Presentation help
└── SETUP_GUIDE.md         # This file
```

---

## Testing Checklist

After setup, test these:

- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Dashboard shows statistics
- [ ] Can browse all courses
- [ ] Can filter courses by category
- [ ] Can view course details
- [ ] Can enroll in a course
- [ ] Can mark module as complete
- [ ] Progress bar updates
- [ ] My Courses page shows enrolled courses
- [ ] Admin can login
- [ ] Admin can create new course

---

## Development Commands

### Backend Commands
```bash
npm start          # Start server
npm run dev        # Start with nodemon (auto-restart)
node seedData.js   # Add sample data
```

### Frontend Commands
```bash
npm start          # Start development server
npm run build      # Create production build
```

---

## Environment Variables

**backend/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learning_platform
JWT_SECRET=your_secret_key_here_change_in_production
```

**Important:** Never share `.env` file or commit to GitHub!

---

## Useful MongoDB Commands

```bash
# Open MongoDB shell
mongo

# Show databases
show dbs

# Use our database
use learning_platform

# Show collections
show collections

# View all users
db.users.find().pretty()

# View all courses
db.courses.find().pretty()

# Clear all data
db.users.deleteMany({})
db.courses.deleteMany({})
db.progresses.deleteMany({})
```

---

## Browser Developer Tools

**Open with:** `F12` or `Ctrl+Shift+I`

**Console Tab:**
- View JavaScript errors
- See API request logs

**Network Tab:**
- Monitor API calls
- Check request/response data
- Debug failed requests

**Application Tab:**
- View localStorage (where JWT token is stored)
- Clear storage if needed

---

## Tips for Smooth Development

1. **Keep terminals organized:**
   - Terminal 1: MongoDB
   - Terminal 2: Backend
   - Terminal 3: Frontend

2. **Use Git for version control:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Take backups:**
   - Copy project folder regularly
   - Export MongoDB data if needed

4. **Read error messages:**
   - They usually tell you what's wrong
   - Google the error for solutions

5. **Use console.log for debugging:**
   ```javascript
   console.log('Variable value:', myVariable);
   ```

---

## Next Steps After Setup

1. **Explore the code:**
   - Read through each file
   - Understand the flow
   - Add comments if needed

2. **Customize:**
   - Change color scheme
   - Add new features
   - Modify existing features

3. **Prepare for presentation:**
   - Read VIVA_QUESTIONS.md
   - Practice demo
   - Understand every line of code

---

## Need Help?

**Error Messages:**
1. Read the error carefully
2. Check the line number mentioned
3. Google the error message
4. Check similar projects on GitHub

**Learning Resources:**
- React Docs: https://react.dev
- Express Docs: https://expressjs.com
- MongoDB Docs: https://docs.mongodb.com
- Node.js Docs: https://nodejs.org/docs

---

## Congratulations! 🎉

If you see this screen without errors, your setup is complete:
- ✓ MongoDB running
- ✓ Backend server on http://localhost:5000
- ✓ Frontend app on http://localhost:3000
- ✓ Sample data loaded

Now you can start exploring and presenting your project!

**Happy Coding!** 💻
