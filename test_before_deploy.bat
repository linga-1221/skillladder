@echo off
echo ========================================
echo   Pre-Deployment Testing
echo ========================================
echo.

echo Testing Backend...
echo.
cd backend
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✓ Backend dependencies OK
echo.

cd ..
echo Testing Frontend...
echo.
cd frontend
echo Installing Node dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✓ Frontend dependencies OK
echo.

echo Testing Frontend build...
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)
echo ✓ Frontend builds successfully
echo.

cd ..
echo ========================================
echo   All Tests Passed! ✓
echo ========================================
echo.
echo Your project is ready for deployment!
echo.
echo Next step: Run deploy_to_github.bat
echo.
pause
