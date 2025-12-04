# Deployment Guide

## Option 1: Render (Free Tier)

### Backend Deployment

1. **Push code to GitHub**
   ```bash
   cd e:\capstone project\project1\project1\project1
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - Name: `skillladder-backend`
     - Root Directory: `backend`
     - Environment: `Python 3`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Click "Create Web Service"
   - Copy the deployed URL (e.g., https://skillladder-backend.onrender.com)

### Frontend Deployment

1. **Update API URL**
   - Edit `frontend/.env.production`
   - Replace with your backend URL:
     ```
     REACT_APP_API_URL=https://skillladder-backend.onrender.com
     ```

2. **Update API calls in code**
   - Replace all `http://localhost:8000` with `process.env.REACT_APP_API_URL || 'http://localhost:8000'`

3. **Deploy on Vercel**
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Settings:
     - Framework Preset: `Create React App`
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`
   - Add Environment Variable:
     - Key: `REACT_APP_API_URL`
     - Value: `https://skillladder-backend.onrender.com`
   - Click "Deploy"

---

## Option 2: Railway (Alternative)

### Backend
1. Go to https://railway.app
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Add environment variables if needed
6. Deploy automatically

### Frontend
Same as Vercel above

---

## Option 3: Local Network Deployment

### Backend
```bash
cd backend
python main.py
# Access at http://YOUR_LOCAL_IP:8000
```

### Frontend
```bash
cd frontend
# Update package.json proxy to your backend IP
npm start
# Access at http://YOUR_LOCAL_IP:3000
```

---

## Quick Deploy Commands

### Backend (Render)
```bash
# Already configured with render.yaml
# Just push to GitHub and connect to Render
```

### Frontend (Vercel)
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

---

## Post-Deployment Checklist

✅ Backend is running and accessible
✅ Frontend can connect to backend API
✅ CORS is enabled in backend (already done)
✅ Environment variables are set
✅ Database files (JSON) are writable
✅ Test registration and login
✅ Test job posting and applications

---

## Important Notes

1. **Free Tier Limitations:**
   - Render: Spins down after 15 min inactivity (first request takes ~30s)
   - Vercel: Unlimited bandwidth for personal projects

2. **Data Persistence:**
   - JSON files on Render will reset on each deployment
   - Consider upgrading to PostgreSQL for production

3. **CORS:**
   - Already configured with `allow_origins=["*"]`
   - For production, update to specific frontend URL

4. **Environment Variables:**
   - Set `SUPABASE_JWT_SECRET` in Render dashboard if using JWT

---

## Troubleshooting

**Backend not starting:**
- Check Render logs
- Verify requirements.txt has all dependencies
- Check Python version (3.11+)

**Frontend can't connect:**
- Verify REACT_APP_API_URL is correct
- Check browser console for CORS errors
- Ensure backend is running

**Data not persisting:**
- Render free tier resets filesystem
- Upgrade to paid tier or use external database
