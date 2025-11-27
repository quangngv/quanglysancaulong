@echo off
echo ========================================
echo   Quan Ly San Cau Long - STARTUP
echo ========================================
echo.
echo [SQLite Database - No MySQL needed!]
echo Database will be created automatically
echo.

echo [1/2] Starting Backend Server...
start cmd /k "cd backend && npm run dev"
timeout /t 5 /nobreak > nul

echo [2/2] Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   SERVERS STARTING...
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Database: backend/database.sqlite (auto-created)
echo.
echo Default Admin Account:
echo Email: admin@example.com
echo Password: admin123
echo.
echo Database file: backend/database.sqlite
echo.
echo Press any key to exit this window...
pause > nul
