@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Git 自动提交推送脚本
echo ========================================
echo.

REM 检查是否有修改
git status --short
if errorlevel 1 (
    echo [错误] Git 状态检查失败
    pause
    exit /b 1
)

echo.
echo [提示] 请输入提交类型（不输入直接回车则默认为 feat）:
echo   feat     - 新功能
echo   fix      - 修复 bug
echo   style    - 样式调整
echo   refactor - 重构代码
echo   docs     - 文档更新
echo   chore    - 其他杂项
echo.
set /p commit_type="提交类型: "
if "%commit_type%"=="" set commit_type=feat

echo.
set /p commit_msg="请输入提交信息（简短描述）: "
if "%commit_msg%"=="" (
    echo [错误] 提交信息不能为空！
    pause
    exit /b 1
)

echo.
set /p commit_detail="详细说明（可选，直接回车跳过）: "

REM 构建完整提交信息
set "full_msg=%commit_type%: %commit_msg%"
if not "%commit_detail%"=="" (
    set "full_msg=%full_msg%\n\n%commit_detail%\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
) else (
    set "full_msg=%full_msg%\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
)

echo.
echo ========================================
echo   即将提交
echo ========================================
echo 类型: %commit_type%
echo 信息: %commit_msg%
if not "%commit_detail%"=="" echo 详情: %commit_detail%
echo.
set /p confirm="确认提交并推送？(y/n): "
if /i not "%confirm%"=="y" (
    echo [取消] 已取消提交
    pause
    exit /b 0
)

echo.
echo [1/3] 添加所有修改...
git add -A
if errorlevel 1 (
    echo [错误] git add 失败
    pause
    exit /b 1
)

echo [2/3] 提交到本地仓库...
git commit -m "%full_msg%"
if errorlevel 1 (
    echo [错误] git commit 失败
    pause
    exit /b 1
)

echo [3/3] 推送到 GitHub...
git push origin main
if errorlevel 1 (
    echo [错误] git push 失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ 提交推送成功！
echo ========================================
echo.
echo 查看在线网站: https://lpk3215.github.io/daily-song/
echo 查看仓库: https://github.com/LPK3215/daily-song
echo.
echo GitHub Pages 将在 1-2 分钟后自动更新
echo.
pause
