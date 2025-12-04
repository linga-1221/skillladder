@echo off
echo Starting Skill Ladder Platform...
echo.

echo Starting Backend Server...
cd backend
start "Backend" cmd /k "python run_backend.py"
cd ..

echo Starting Frontend Server...
cd frontend
start "Frontend" cmd /k "npm start"
cd ..

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause