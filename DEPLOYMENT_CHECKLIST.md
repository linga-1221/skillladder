# Deployment Checklist

## Pre-Deployment
- [ ] All code is working locally
- [ ] Backend runs on http://localhost:8000
- [ ] Frontend runs on http://localhost:3000
- [ ] No errors in console
- [ ] All features tested

## GitHub Setup
- [ ] Created GitHub account
- [ ] Created new repository on GitHub
- [ ] Repository name: _______________
- [ ] Noted repository URL: _______________

## Push to GitHub
- [ ] Ran `deploy_to_github.bat` OR
- [ ] Manually pushed code to GitHub
- [ ] Verified code is visible on GitHub

## Backend Deployment (Render)
- [ ] Created Render account
- [ ] Connected GitHub to Render
- [ ] Created new Web Service
- [ ] Selected correct repository
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `pip install -r requirements.txt`
- [ ] Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Clicked "Create Web Service"
- [ ] Waited for deployment to complete
- [ ] Backend URL: _______________
- [ ] Tested backend URL (should show welcome message)

## Frontend Deployment (Vercel)
- [ ] Created Vercel account
- [ ] Connected GitHub to Vercel
- [ ] Imported repository
- [ ] Set Root Directory: `frontend`
- [ ] Set Framework: Create React App
- [ ] Added Environment Variable:
  - Name: `REACT_APP_API_URL`
  - Value: (Backend URL from Render)
- [ ] Clicked "Deploy"
- [ ] Waited for deployment to complete
- [ ] Frontend URL: _______________

## Post-Deployment Testing
- [ ] Visited frontend URL
- [ ] Tested user registration
- [ ] Tested user login
- [ ] Tested job search
- [ ] Tested resume upload
- [ ] Tested job application
- [ ] All features working correctly

## Final Steps
- [ ] Saved both URLs in a safe place
- [ ] Shared URLs with team/users
- [ ] Documented any issues
- [ ] Set up monitoring (optional)

## URLs to Remember
```
Backend API: _______________
Frontend App: _______________
GitHub Repo: _______________
```

## Notes
_______________________________________________
_______________________________________________
_______________________________________________

## Deployment Date
Date: _______________
Time: _______________
Deployed by: _______________
