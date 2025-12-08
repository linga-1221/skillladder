@echo off
echo.
echo Go to: https://github.com/new
echo Repository name: skillladder
echo Click "Create repository"
echo.
echo Press any key AFTER creating repository...
pause

git remote add origin https://github.com/linga-1221/skillladder.git
git push -u origin main

echo.
echo SUCCESS! Repository pushed!
echo.
echo Next: Deploy on Render and Vercel
pause
