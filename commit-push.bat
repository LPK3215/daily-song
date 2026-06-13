@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Git Commit and Push Script
echo ========================================
echo.

REM Check git status
git status --short
if errorlevel 1 (
    echo [ERROR] Git status check failed
    pause
    exit /b 1
)

echo.
echo [INFO] Enter commit type (press Enter for default: feat):
echo   feat     - New feature
echo   fix      - Bug fix
echo   style    - Style adjustment
echo   refactor - Code refactoring
echo   docs     - Documentation
echo   chore    - Other changes
echo.
set /p commit_type="Commit type: "
if "%commit_type%"=="" set commit_type=feat

echo.
set /p commit_msg="Enter commit message (short description): "
if "%commit_msg%"=="" (
    echo [ERROR] Commit message cannot be empty!
    pause
    exit /b 1
)

echo.
set /p commit_detail="Detailed description (optional, press Enter to skip): "

REM Build full commit message
set "full_msg=%commit_type%: %commit_msg%"
if not "%commit_detail%"=="" (
    set "full_msg=%full_msg%


%commit_detail%

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
) else (
    set "full_msg=%full_msg%

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
)

echo.
echo ========================================
echo   Ready to Commit
echo ========================================
echo Type: %commit_type%
echo Message: %commit_msg%
if not "%commit_detail%"=="" echo Detail: %commit_detail%
echo.
set /p confirm="Confirm commit and push? (y/n): "
if /i not "%confirm%"=="y" (
    echo [CANCELLED] Commit cancelled
    pause
    exit /b 0
)

echo.
echo [1/3] Adding all changes...
git add -A
if errorlevel 1 (
    echo [ERROR] git add failed
    pause
    exit /b 1
)

echo [2/3] Committing to local repository...
git commit -m "%full_msg%"
if errorlevel 1 (
    echo [ERROR] git commit failed
    pause
    exit /b 1
)

echo [3/3] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo [ERROR] git push failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Success! Commit pushed.
echo ========================================
echo.
echo View website: https://lpk3215.github.io/daily-song/
echo View repository: https://github.com/LPK3215/daily-song
echo.
echo GitHub Pages will update in 1-2 minutes
echo.
pause
