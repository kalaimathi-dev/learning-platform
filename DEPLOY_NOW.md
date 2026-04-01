# Deploy Now (Render + Vercel + MongoDB Atlas)

## 1) MongoDB Atlas
1. Create a free Atlas cluster.
2. Create database user with read/write access.
3. Allow network access (0.0.0.0/0 for initial setup).
4. Copy connection string and include database name learning-platform.

Example:
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/learning-platform?retryWrites=true&w=majority

## 2) Deploy Backend on Render
1. Render -> New -> Web Service.
2. Connect repository: kalaimathi-dev/learning-platform
3. Settings:
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: npm start
4. Add environment variables from backend/.env.example
5. Deploy.

## 3) Seed Database Once
From local machine:
1. Open terminal in project root.
2. Run:
   - cd backend
   - npm install
   - Set MONGODB_URI to your Atlas URI in current shell
   - node seedData.js

## 4) Deploy Frontend on Vercel
1. Vercel -> Add New Project.
2. Import repository: kalaimathi-dev/learning-platform
3. Settings:
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: build
4. Add REACT_APP_API_URL using your Render backend URL + /api
5. Deploy.

## 5) Final Wiring
1. Copy your Vercel URL.
2. In Render backend env vars, set FRONTEND_URL to the Vercel URL.
3. Trigger backend redeploy.

## 6) Smoke Test
1. Backend health: GET /
2. Frontend loads without CORS errors.
3. Login works with seeded admin:
   - Email: admin@example.com
   - Password: admin123
4. Create course from Admin Panel.
