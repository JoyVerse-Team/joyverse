@echo off
echo Starting Joyverse Application...
echo.
echo Frontend:     http://localhost:3000
echo Backend:      http://localhost:5000
echo FastAPI:      http://localhost:8000
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

echo Starting FastAPI Server...
start "FastAPI Server" cmd /k "cd fastapi && python main.py"

echo Starting Frontend...
cd frontend
npm run dev
