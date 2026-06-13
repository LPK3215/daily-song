@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Daily Song - Local Server
echo ========================================
echo.
echo Starting local server...
echo.

cd /d "%~dp0"

:: Check if Python is available
where python >nul 2>nul
if %errorlevel% == 0 (
    echo [OK] Starting server with Python
    echo [*] URL: http://localhost:8080
    echo.
    start http://localhost:8080
    python -m http.server 8080
) else (
    echo [ERROR] Python not found
    echo.
    echo Please install Python or use other methods:
    echo   1. Double-click index.html to open directly
    echo   2. Use VS Code Live Server extension
    echo   3. Use npx live-server
    echo.
    pause
)
