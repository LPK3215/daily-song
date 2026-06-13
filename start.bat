@echo off
echo.
echo ========================================
echo   每日一歌 - 沉浸式音乐播放器
echo ========================================
echo.
echo 正在启动本地服务器...
echo.

cd /d "%~dp0"

:: 检查 Python 是否可用
where python >nul 2>nul
if %errorlevel% == 0 (
    echo [OK] 使用 Python 启动服务器
    echo [*] 访问地址: http://localhost:8080
    echo.
    start http://localhost:8080
    python -m http.server 8080
) else (
    echo [错误] 未找到 Python
    echo.
    echo 请安装 Python 或使用其他方式启动:
    echo   1. 双击 index.html 直接打开
    echo   2. 使用 VS Code Live Server 扩展
    echo   3. 使用 npx live-server
    echo.
    pause
)
