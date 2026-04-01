# Deployment Guide

## Table of Contents
1. [Deployment Options](#deployment-options)
2. [Environment Setup](#environment-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Database Hosting (MongoDB Atlas)](#database-hosting-mongodb-atlas)
6. [Alternative Deployments](#alternative-deployments)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Post-Deployment](#post-deployment)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Deployment Options

### Recommended Stack (Free Tier)

| Component | Platform | Why |
|-----------|----------|-----|
| **Frontend** | Vercel | Automatic deployments, CDN, zero config |
| **Backend** | Render | Free tier, auto-sleep after inactivity |
| **Database** | MongoDB Atlas | 512MB free tier, managed service |

### Alternative Options

| Component | Alternatives |
|-----------|-------------|
| **Frontend** | Netlify, GitHub Pages, Firebase Hosting |
| **Backend** | Railway, Heroku, AWS EC2, DigitalOcean |
| **Database** | MongoDB self-hosted, AWS DocumentDB |

---

## Environment Setup

### Environment Variables

**Backend (.env)**
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/learning-platform?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secure_random_string_here_minimum_32_characters

# CORS (Frontend URL)
FRONTEND_URL=https://your-app.vercel.app

# Optional: Email service (for future features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Frontend (.env)**
```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_ENV=production
```

### Security Best Practices

1. **Never commit .env files to Git**
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Rotate secrets regularly** (every 3-6 months)
4. **Use different secrets** for dev/staging/production

---

## Database Hosting (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new project: "Learning Platform"

### Step 2: Create Cluster

1. Click "Build a Database"
2. Choose **FREE Shared Cluster** (M0 Sandbox)
3. Select cloud provider: **AWS**
4. Region: Choose closest to your users
5. Cluster Name: `learning-platform-cluster`
6. Click "Create Cluster"

### Step 3: Configure Database Access

1. **Database Access** tab
2. Click "Add New Database User"
   - Authentication Method: Password
   - Username: `adminUser`
   - Password: Generate secure password (save it!)
   - Database User Privileges: **Read and write to any database**
3. Click "Add User"

### Step 4: Configure Network Access

1. **Network Access** tab
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, restrict to your backend server IPs
4. Confirm

### Step 5: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: **Node.js**, Version: 4.1 or later
4. Copy connection string:
   ```
   mongodb+srv://adminUser:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `learning-platform`
   ```
   mongodb+srv://adminUser:yourpassword@cluster.mongodb.net/learning-platform?retryWrites=true&w=majority
   ```

### Step 6: Test Connection Locally

```bash
# Update backend/.env with MongoDB URI
MONGODB_URI=mongodb+srv://adminUser:yourpassword@cluster.mongodb.net/learning-platform?retryWrites=true&w=majority

# Start backend
cd backend
npm start

# Should see: "Connected to MongoDB database successfully!"
```

### Step 7: Seed Initial Data

```bash
# Create admin user and sample courses
node backend/seedData.js
```

---

## Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

**Update `backend/server.js`** (ensure it exports app):
```javascript
// At the end of server.js
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for testing (important!)
module.exports = app;
```

**Create `backend/.npmrc`** (if using npm workspaces):
```
legacy-peer-deps=true
```

**Update `backend/package.json`**:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "16.x"
  }
}
```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 3: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repository

### Step 4: Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select `learning-platform` repository

### Step 5: Configure Service

**Basic Settings:**
- **Name:** `learning-platform-backend`
- **Region:** Choose closest to users
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Environment:**
- **Instance Type:** Free

### Step 6: Add Environment Variables

Click "Advanced" → "Add Environment Variable":

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://adminUser:password@...` |
| `JWT_SECRET` | `your_secure_32_char_secret` |
| `FRONTEND_URL` | `https://your-app.vercel.app` (update later) |
| `PORT` | `5000` |

### Step 7: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes first time)
3. Note your backend URL: `https://learning-platform-backend.onrender.com`

### Step 8: Test Backend

Open in browser:
```
https://learning-platform-backend.onrender.com
```

Should see: `{"message": "Welcome to Learning Platform API"}`

Test API endpoint:
```bash
curl https://learning-platform-backend.onrender.com/api/auth/login
```

---

## Frontend Deployment (Vercel)

### Step 1: Update API URL

**Create/update `frontend/.env.production`**:
```env
REACT_APP_API_URL=https://learning-platform-backend.onrender.com/api
```

**Update `frontend/src/utils/api.js`**:
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Step 2: Test Production Build Locally

```bash
cd frontend
npm run build
npx serve -s build

# Open http://localhost:3000 and test
```

### Step 3: Push Changes to GitHub

```bash
git add .
git commit -m "Configure frontend for production"
git push origin main
```

### Step 4: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel

### Step 5: Import Project

1. Click "Add New..." → "Project"
2. Import `learning-platform` repository
3. Click "Import"

### Step 6: Configure Project

**Framework Preset:** Create React App (auto-detected)

**Build Settings:**
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

**Environment Variables:**
- Key: `REACT_APP_API_URL`
- Value: `https://learning-platform-backend.onrender.com/api`

### Step 7: Deploy

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Get your URL: `https://your-app.vercel.app`

### Step 8: Update Backend CORS

Go back to Render dashboard:
1. Open your backend service
2. Environment → Edit `FRONTEND_URL`
3. Set to: `https://your-app.vercel.app`
4. Save (auto-redeploys)

### Step 9: Configure Custom Domain (Optional)

**In Vercel:**
1. Project Settings → Domains
2. Add your domain: `www.yourlearningplatform.com`
3. Follow DNS configuration instructions

---

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  # Test backend before deploying
  test-backend:
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
      env:
        MONGODB_URI: ${{ secrets.MONGODB_TEST_URI }}
        JWT_SECRET: ${{ secrets.JWT_SECRET }}
  
  # Test frontend
  test-frontend:
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
    
    - name: Build
      run: |
        cd frontend
        npm run build
      env:
        REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
  
  # Deploy backend (Render auto-deploys on push)
  deploy-backend:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Trigger Render Deployment
      run: |
        curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
  
  # Deploy frontend (Vercel auto-deploys on push)
  deploy-frontend:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to Vercel
      run: |
        echo "Vercel auto-deploys on push to main"
```

### GitHub Secrets Setup

1. Go to GitHub repository → Settings → Secrets → Actions
2. Add secrets:
   - `MONGODB_TEST_URI`: Test database connection string
   - `JWT_SECRET`: Your JWT secret
   - `REACT_APP_API_URL`: Production API URL
   - `RENDER_DEPLOY_HOOK`: (From Render Settings → Deploy Hooks)

---

## Alternative Deployment: Railway

### Quick Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select repository
5. Add services:
   - **Backend Service:**
     - Root: `/backend`
     - Start Command: `npm start`
   - **Frontend Service:**
     - Root: `/frontend`
     - Start Command: `npx serve -s build`
6. Add environment variables (same as Render)
7. Deploy!

**Cost:** $5/month after free tier

---

## Alternative Deployment: AWS (Advanced)

### Architecture
```
┌─────────────┐
│   Route 53  │ (Domain)
└──────┬──────┘
       │
┌──────▼──────┐
│ CloudFront  │ (CDN)
└──────┬──────┘
       │
┌──────▼──────────────────────┐
│  S3 Bucket (Frontend)       │
└─────────────────────────────┘

┌─────────────────────────────┐
│  EC2 / Elastic Beanstalk    │ (Backend)
│  + Application Load Balancer│
└──────┬──────────────────────┘
       │
┌──────▼──────┐
│  DocumentDB │ (MongoDB-compatible)
└─────────────┘
```

### Steps (Summary)

1. **Frontend:** Deploy to S3 + CloudFront
2. **Backend:** Deploy to Elastic Beanstalk or EC2
3. **Database:** Use DocumentDB or MongoDB Atlas
4. **CI/CD:** AWS CodePipeline

**Estimated Cost:** $20-50/month

---

## Docker Deployment

### Dockerfile (Backend)

Create `backend/Dockerfile`:
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Dockerfile (Frontend)

Create `frontend/Dockerfile`:
```dockerfile
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - mongo
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Post-Deployment

### Step 1: Test Production Application

**Frontend Tests:**
- [ ] Homepage loads correctly
- [ ] Registration works
- [ ] Login works
- [ ] All pages accessible
- [ ] Navigation functions
- [ ] Responsive on mobile
- [ ] Images load properly

**Backend Tests:**
- [ ] API responds at base URL
- [ ] Authentication endpoints work
- [ ] Course endpoints return data
- [ ] Admin endpoints protected
- [ ] CORS configured correctly

**Use this checklist:**
```bash
# Test registration
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Should return 201 with token
```

### Step 2: Seed Production Data

```bash
# SSH or use Render shell
node backend/seedData.js
```

Or use MongoDB Compass:
1. Connect to your Atlas cluster
2. Manually insert admin user and sample courses

### Step 3: Configure Monitoring

**Render:**
- Auto-sleeps after 15 min inactivity (free tier)
- Add health check endpoint: `/api/health`

**Vercel:**
- Automatic monitoring included
- View analytics in dashboard

### Step 4: Setup Error Tracking (Optional)

**Sentry Integration:**

```bash
npm install @sentry/node @sentry/react
```

**Backend (`backend/server.js`):**
```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Must be before any routes
app.use(Sentry.Handlers.requestHandler());

// Routes here...

// Error handler (must be after routes)
app.use(Sentry.Handlers.errorHandler());
```

---

## Monitoring & Maintenance

### Health Check Endpoint

Add to `backend/server.js`:
```javascript
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});
```

### Uptime Monitoring

**Free Services:**
- [UptimeRobot](https://uptimerobot.com) - Monitor every 5 minutes
- [Pingdom](https://pingdom.com) - Free tier available

**Setup:**
1. Add your URLs:
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-backend.onrender.com/api/health`
2. Configure alerts (email/SMS)

### Performance Monitoring

**Tools:**
1. **Google Lighthouse** - Run audit
2. **WebPageTest** - Performance analysis
3. **MongoDB Atlas Monitoring** - Database performance

**Target Metrics:**
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.5s
- API response: < 500ms
- Database queries: < 100ms

### Log Management

**Render Logs:**
- Dashboard → Service → Logs tab
- Real-time streaming
- Last 30 days retained

**Vercel Logs:**
- Dashboard → Project → Deployments → View Logs

### Backup Strategy

**Database Backups:**
1. MongoDB Atlas auto-backup (free tier)
2. Manual backups:
   ```bash
   mongodump --uri="mongodb+srv://..." --out=./backup-$(date +%F)
   ```

**Code Backups:**
- Git repository (already backed up)
- GitHub automatic backups

### Update Strategy

**Regular Updates:**
```bash
# Weekly dependency updates
npm outdated
npm update

# Security patches
npm audit fix
```

**Deployment Strategy:**
1. Make changes in `develop` branch
2. Test locally
3. Create pull request to `main`
4. Run CI/CD tests
5. Merge → Auto-deploy

---

## Troubleshooting

### Common Issues

**Issue: Render service sleeping (503 error)**
- **Cause:** Free tier sleeps after 15 min inactivity
- **Solution:** Upgrade to paid ($7/month) or accept cold starts
- **Workaround:** Use cron job to ping every 10 minutes

**Issue: CORS errors in browser**
- **Cause:** Backend CORS not configured for frontend URL
- **Solution:** Update `FRONTEND_URL` env variable in Render
- Add to `backend/server.js`:
  ```javascript
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));
  ```

**Issue: MongoDB connection timeout**
- **Cause:** IP not whitelisted
- **Solution:** MongoDB Atlas → Network Access → Allow 0.0.0.0/0

**Issue: Environment variables not working**
- **Cause:** Variables not set in deployment platform
- **Solution:** Double-check spelling and values in Render/Vercel dashboard

**Issue: Build failing on Vercel**
- **Cause:** Missing dependencies or build errors
- **Solution:** Check logs, run `npm run build` locally first

---

## Production Checklist

### Pre-Launch

- [ ] Environment variables configured correctly
- [ ] Database seeded with initial data
- [ ] CORS configured for production URL
- [ ] JWT secret is strong and unique
- [ ] .env files NOT committed to Git
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Success/error messages shown
- [ ] Responsive design tested
- [ ] SEO meta tags added
- [ ] Favicon added
- [ ] Analytics configured (Google Analytics)

### Post-Launch

- [ ] Test all features in production
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Setup uptime monitoring
- [ ] Configure backups
- [ ] Document API for users
- [ ] Create user guide
- [ ] Setup support email

---

## URLs & Access

### Development
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Production (Update with your URLs)
- Frontend: https://your-app.vercel.app
- Backend: https://your-backend.onrender.com
- Database: MongoDB Atlas (internal)

### Admin Credentials (CHANGE IN PRODUCTION!)
- Email: admin@test.com
- Password: admin123

---

## Cost Breakdown

### Free Tier (Recommended for MVP)
- **MongoDB Atlas:** $0 (512MB limit)
- **Render Backend:** $0 (sleeps after 15 min)
- **Vercel Frontend:** $0 (100GB bandwidth/month)
- **Total:** $0/month

### Production Ready
- **MongoDB Atlas:** $0-9 (shared M2 cluster)
- **Render Backend:** $7/month (always-on)
- **Vercel Frontend:** $0-20 (Pro for custom domain)
- **Sentry (errors):** $0 (5k events/month)
- **Total:** $7-36/month

### Enterprise Scale
- AWS/GCP deployment: $100-500/month
- Dedicated database: $50-200/month
- CDN: $20-100/month

---

## Next Steps After Deployment

1. **Monitor Performance:** First 48 hours critical
2. **Gather Feedback:** From users
3. **Fix Bugs:** Based on production issues
4. **Optimize:** Database queries, image sizes
5. **Scale:** If traffic increases, upgrade services

---

