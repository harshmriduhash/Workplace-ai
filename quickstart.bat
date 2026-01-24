@echo off
REM Quick Start Script for Workplace-AI MVP (Windows)

echo.
echo ============================================
echo Workplace-AI MVP - Quick Start
echo ============================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js not found. Please install Node.js 18+
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js found: %NODE_VERSION%
echo.

REM Install dependencies
echo Installing dependencies...
cd backend
call npm install
cd ..\frontend
call npm install
cd ..

echo.
echo Dependencies installed!
echo.

REM Instructions
echo To start development:
echo.
echo Terminal 1 ^(Backend^):
echo   cd backend ^&^& npm run dev
echo.
echo Terminal 2 ^(Frontend^):
echo   cd frontend ^&^& npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
echo Full deployment guide: see DEPLOYMENT.md
echo Investor demo script: see INVESTOR_DEMO.md
echo.
