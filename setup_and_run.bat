@echo off
echo ==========================================
echo      SWMS Project Setup & Launcher
echo ==========================================
echo.

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    pause
    exit /b
)

:: Check for Node.js
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    pause
    exit /b
)

echo [1/4] Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies.
    pause
    exit /b
)

echo [2/3] Starting Backend Server...
start "SWMS Backend" cmd /k "uvicorn main:app --reload"

echo [3/3] Opening Frontend...
echo.
echo The application should open in your browser shortly...
echo.
cd ../frontend
start index.html

pause

