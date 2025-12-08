# Complete Deployment Guide for Skill Ladder

## Prerequisites
- GitHub account
- Render account (for backend)
- Vercel account (for frontend)

## Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `skillladder` (or your preferred name)
   - Make it Public or Private
   - DO NOT initialize with README
   - Click "Create repository"

2. **Push your code:**
```bash
cd "e:\capstone project\project1\project1\project1"
git add .
git commit -m "Initial commit - Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/skillladder.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 2: Deploy Backend on Render

1. **Sign up/Login to Render:**
   - Go to https://render.com
   - Sign up with your GitHub account

2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository you just created

3. **Configure the service:**
   - **Name:** `skillladder-backend`
   - **Region:** Oregon (US West) or closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables (Optional):**
   - Add any environment variables if needed
   - For now, the app works without additional env vars

5. **Create Web Service:**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - **IMPORTANT:** Copy the URL (e.g., `https://skillladder-backend.onrender.com`)

## Step 3: Deploy Frontend on Vercel

1. **Sign up/Login to Vercel:**
   - Go to https://vercel.com
   - Sign up with your GitHub account

2. **Import your repository:**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure the project:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `build` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Environment Variables:**
   - Click "Environment Variables"
   - Add the following:
     - **Name:** `REACT_APP_API_URL`
     - **Value:** `https://skillladder-backend.onrender.com` (your backend URL from Step 2)
   - Make sure to select all environments (Production, Preview, Development)

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-5 minutes for deployment
   - Your frontend will be live at `https://your-project-name.vercel.app`

## Step 4: Test Your Deployment

1. **Test Backend:**
   - Visit `https://skillladder-backend.onrender.com`
   - You should see: `{"message": "Skill Ladder Backend Running"}`

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try registering a new user
   - Try logging in
   - Test the job search functionality

## Step 5: Update Frontend URL (if needed)

If you need to update the backend URL later:

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Update `REACT_APP_API_URL`
5. Redeploy from the Deployments tab

## Troubleshooting

### Backend Issues:
- **Build fails:** Check requirements.txt for correct package versions
- **App crashes:** Check Render logs for errors
- **CORS errors:** Backend already has CORS enabled for all origins

### Frontend Issues:
- **Build fails:** Run `npm install` locally to check for dependency issues
- **API not connecting:** Verify `REACT_APP_API_URL` environment variable
- **Blank page:** Check browser console for errors

## Free Tier Limitations

### Render (Backend):
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free

### Vercel (Frontend):
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

## Alternative: Deploy Frontend to Netlify

If you prefer Netlify over Vercel:

```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify init
# Follow the prompts
netlify deploy --prod
```

## Continuous Deployment

Both Render and Vercel automatically redeploy when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
# Automatic deployment will trigger
```

## Your Live URLs

After deployment, save these URLs:

- **Backend API:** https://skillladder-backend.onrender.com
- **Frontend App:** https://your-project-name.vercel.app

## Next Steps

1. Share your live URLs with users
2. Monitor application logs on Render and Vercel
3. Set up custom domain (optional)
4. Enable analytics (optional)

---

**Need Help?**
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: Create an issue in your repository
