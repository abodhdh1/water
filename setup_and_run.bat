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

echo [2/4] Starting Backend Server...
start "SWMS Backend" cmd /k "uvicorn main:app --reload"

echo [3/4] Installing Frontend Dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Node.js dependencies.
    pause
    exit /b
)

echo [4/4] Starting Frontend...
echo.
echo The application should open in your browser shortly...
echo.
call npm run dev

pause
