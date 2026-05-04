@echo off
title GitHub Download

echo.
echo ================================
echo  GitHub Download (supply-fireapp)
echo ================================
echo.

set "REPO_URL=https://github.com/carrotcakehope/supply-fireapp.git"
set "FOLDER_NAME=supply-fireapp"

if exist "%FOLDER_NAME%" (
    echo [INFO] Already exists. Updating...
    cd /d "%FOLDER_NAME%"
    git pull
) else (
    echo [INFO] Downloading...
    git clone "%REPO_URL%"
    cd /d "%FOLDER_NAME%"
)

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed - Check internet connection and git installation
    pause
    exit /b 1
)

echo.
echo ================================
echo  Done! Saved in %FOLDER_NAME% folder
echo  https://github.com/carrotcakehope/supply-fireapp
echo ================================
echo.
pause
