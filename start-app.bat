@echo off
echo ========================================
echo   Starting Tawhid App with Local DB
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Tawhid Backend" cmd /k "cd server && npm start"

echo [2/2] Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend...
start "Tawhid Frontend" cmd /k "npm start"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5001
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
