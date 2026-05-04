@echo off
title GitHub Upload

cd /d "%~dp0"

echo.
echo ================================
echo  GitHub Auto Upload (supply-fireapp)
echo ================================
echo.

if not exist .gitignore (
    echo node_modules/ > .gitignore
    echo *.apk >> .gitignore
    echo .claude/ >> .gitignore
)

git remote | findstr /X "supply" > nul 2>&1
if %errorlevel% neq 0 (
    git remote add supply https://github.com/carrotcakehope/supply-fireapp.git
)

echo [1/3] Checking changes...
git status --short
echo.

echo [2/3] Staging files...
git add -A

echo [3/3] Uploading to GitHub...
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"') do set TIMESTAMP=%%i
git commit -m "upload: %TIMESTAMP%"
if %errorlevel% neq 0 (
    echo [INFO] No changes to upload.
    pause
    exit /b 0
)

git push supply main
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed - check git login status
    pause
    exit /b 1
)

echo.
echo ================================
echo  Done! Uploaded to GitHub
echo  https://github.com/carrotcakehope/supply-fireapp
echo ================================
echo.
pause
