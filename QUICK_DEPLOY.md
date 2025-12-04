# Quick Deploy Steps

## 1. Push to GitHub
```bash
cd "e:\capstone project\project1\project1\project1"
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/linga-1221
git push -u origin main
```

## 2. Deploy Backend (Render)
1. Go to https://render.com → Sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your repository
4. Settings:
   - **Name:** skillladder-backend
   - **Root Directory:** backend
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click "Create Web Service"
6. **Copy the URL** (e.g., https://skillladder-backend.onrender.com)

## 3. Deploy Frontend (Vercel)
1. Go to https://vercel.com → Sign up with GitHub
2. Click "Add New" → "Project"
3. Import your repository
4. Settings:
   - **Framework:** Create React App
   - **Root Directory:** frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Environment Variables:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://skillladder-backend.onrender.com` (your backend URL)
6. Click "Deploy"

## Done! 🎉

Your app is now live:
- Backend: https://skillladder-backend.onrender.com
- Frontend: https://your-app.vercel.app

## Alternative: Netlify for Frontend
```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify deploy --prod
```
