@echo off
echo Testing Backend Server...
echo.

echo [1] Checking if database exists...
if exist "server\database\hadiths.db" (
    echo ✓ Database found
) else (
    echo ✗ Database NOT found - Run: cd server ^&^& npm run import-sql
    pause
    exit
)

echo.
echo [2] Testing backend API...
curl -s http://localhost:5001/api/health
echo.

echo.
echo [3] Testing collections...
curl -s http://localhost:5001/api/collections
echo.

echo.
echo [4] Testing Bukhari hadiths...
curl -s "http://localhost:5001/api/hadiths/bukhari?page=1&limit=5"
echo.

echo.
echo ========================================
echo If you see JSON responses above, backend is working!
echo If you see errors, make sure backend is running:
echo   cd server
echo   npm start
echo ========================================
pause
