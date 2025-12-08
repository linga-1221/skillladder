# 🚀 Skill Ladder - Deployment Guide

## Welcome! Your project is ready to go live! 🎉

This guide will help you deploy your Skill Ladder application to the cloud in about 20-30 minutes.

## 📋 What You'll Need

- [ ] GitHub account (free) - https://github.com/signup
- [ ] Render account (free) - https://render.com/register
- [ ] Vercel account (free) - https://vercel.com/signup
- [ ] Git installed on your computer
- [ ] Internet connection

## 🎯 Deployment Options

### Option 1: Automated Deployment (Recommended)
Use our automated scripts for the easiest deployment experience.

### Option 2: Manual Deployment
Follow step-by-step instructions for full control.

---

## 🚀 Option 1: Automated Deployment

### Step 1: Test Your Project (Optional but Recommended)
```bash
test_before_deploy.bat
```
This will verify that everything is working before deployment.

### Step 2: Deploy to GitHub
```bash
deploy_to_github.bat
```
Follow the prompts to enter your GitHub username and repository name.

### Step 3: Deploy Backend
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will auto-detect the configuration from `render.yaml`
5. Click "Create Web Service"
6. **Copy the backend URL** (e.g., https://skillladder-backend.onrender.com)

### Step 4: Deploy Frontend
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Add environment variable:
   - Name: `REACT_APP_API_URL`
   - Value: (paste your backend URL from Step 3)
6. Click "Deploy"

### Step 5: Test Your Live App! 🎊
Visit your Vercel URL and test all features.

---

## 📝 Option 2: Manual Deployment

Follow the detailed instructions in **DEPLOYMENT_STEPS.md**

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **DEPLOYMENT_SUMMARY.md** | Quick overview and getting started |
| **DEPLOYMENT_STEPS.md** | Detailed step-by-step instructions |
| **DEPLOYMENT_CHECKLIST.md** | Track your deployment progress |
| **README_DEPLOYMENT.md** | This file - deployment overview |

## 🛠️ Helper Scripts

| Script | Purpose |
|--------|---------|
| **test_before_deploy.bat** | Test project before deployment |
| **deploy_to_github.bat** | Automated GitHub deployment |

## 🎯 Quick Reference

### Backend (Render)
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Python Version:** 3.11

### Frontend (Vercel)
- **Root Directory:** `frontend`
- **Framework:** Create React App
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Environment Variable:** `REACT_APP_API_URL`

## ⚡ Features of Your App

- ✅ User Registration & Login
- ✅ Job Search & Recommendations
- ✅ Resume Upload & ATS Scoring
- ✅ Job Applications
- ✅ Interview Scheduling
- ✅ Analytics Dashboard
- ✅ Mock Tests
- ✅ Chatbot Support

## 🌐 Tech Stack

**Backend:**
- FastAPI (Python)
- Uvicorn ASGI Server
- JSON File Storage

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Recharts

**Hosting:**
- Backend: Render (Free Tier)
- Frontend: Vercel (Free Tier)

## 💰 Cost

**Total Cost: $0/month** (Free tier for both services)

### Free Tier Limits:
- **Render:** 750 hours/month, sleeps after 15 min inactivity
- **Vercel:** 100 GB bandwidth/month, unlimited deployments

## 🔒 Security Notes

- Environment variables are stored securely on Vercel
- Backend uses JWT for authentication
- CORS is configured for security
- Passwords are hashed before storage

## 📊 After Deployment

### Your Live URLs:
- Backend API: `https://your-backend.onrender.com`
- Frontend App: `https://your-app.vercel.app`

### Monitoring:
- **Render Dashboard:** View backend logs and metrics
- **Vercel Dashboard:** View frontend analytics and deployments

### Continuous Deployment:
Both services automatically redeploy when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

## 🆘 Troubleshooting

### Backend Issues:
- **Slow first load:** Free tier sleeps after inactivity (normal behavior)
- **Build fails:** Check Python version and dependencies
- **App crashes:** Check Render logs

### Frontend Issues:
- **Build fails:** Run `npm install` locally to check dependencies
- **Blank page:** Check browser console for errors
- **API errors:** Verify `REACT_APP_API_URL` is set correctly

### Need More Help?
- Check **DEPLOYMENT_STEPS.md** for detailed troubleshooting
- Review Render logs: https://dashboard.render.com
- Review Vercel logs: https://vercel.com/dashboard

## 🎓 Learning Resources

- FastAPI: https://fastapi.tiangolo.com
- React: https://react.dev
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs

## ✅ Deployment Checklist

Use **DEPLOYMENT_CHECKLIST.md** to track your progress through each step.

## 🎉 Ready to Deploy?

1. **Read:** DEPLOYMENT_SUMMARY.md (5 min)
2. **Test:** Run test_before_deploy.bat (5 min)
3. **Deploy:** Follow Option 1 or Option 2 above (20 min)
4. **Celebrate:** Your app is live! 🎊

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the detailed DEPLOYMENT_STEPS.md
3. Check service status pages:
   - Render: https://status.render.com
   - Vercel: https://www.vercel-status.com

---

**Good luck with your deployment!** 🚀

*Estimated deployment time: 20-30 minutes*
