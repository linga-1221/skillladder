@echo off
echo ========================================
echo   Skill Ladder - GitHub Deployment
echo ========================================
echo.

REM Check if git is initialized
git status >nul 2>&1
if errorlevel 1 (
    echo Initializing Git repository...
    git init
    git branch -M main
)

echo.
echo Please enter your GitHub username:
set /p GITHUB_USER=Username: 

echo.
echo Please enter your repository name (e.g., skillladder):
set /p REPO_NAME=Repository: 

echo.
echo Adding files to Git...
git add .

echo.
echo Committing changes...
git commit -m "Ready for deployment"

echo.
echo Setting up remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo   Deployment to GitHub Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Go to https://render.com to deploy backend
echo 2. Go to https://vercel.com to deploy frontend
echo 3. Follow the instructions in DEPLOYMENT_STEPS.md
echo.
echo Your repository URL:
echo https://github.com/%GITHUB_USER%/%REPO_NAME%
echo.
pause
