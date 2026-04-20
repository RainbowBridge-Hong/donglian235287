@echo off
echo ========================================
echo  东濂置业网站 - GitHub 一键推送
echo ========================================
echo.

cd /d "%~dp0"

echo 正在推送到 GitHub...
echo.

git push origin main

echo.
echo 完成! 按任意键退出...
pause >nul
