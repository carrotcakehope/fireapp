@echo off
chcp 65001 > nul
title Build APK

cd /d "%~dp0"

echo.
echo ================================
echo  APK Build Start
echo ================================
echo.

set "NODE_PATH=C:\Program Files\nodejs"
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "ANDROID_HOME=C:\Users\Kyu\AppData\Local\Android\Sdk"
set "PATH=%NODE_PATH%;%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"

if not exist "%NODE_PATH%\node.exe" (
    echo [ERROR] Node.js not found
    pause
    exit /b 1
)

if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [ERROR] Java not found
    pause
    exit /b 1
)

if not exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    echo [ERROR] Android SDK not found
    pause
    exit /b 1
)

echo Node  : %NODE_PATH%
echo Java  : %JAVA_HOME%
echo SDK   : %ANDROID_HOME%
echo.

if not exist "node_modules" (
    echo Installing packages...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed
        pause
        exit /b 1
    )
)

echo [1/4] Copying web files...
if not exist "www" mkdir www
copy /Y index.html  www\index.html  > nul
copy /Y styles.css  www\styles.css  > nul
copy /Y app.js      www\app.js      > nul
if exist ilgu.ico copy /Y ilgu.ico www\ilgu.ico > nul
echo       Done

echo [2/4] Generating icons...
call node make_icons.js
if %errorlevel% neq 0 (
    echo [ERROR] Icon generation failed
    pause
    exit /b 1
)

echo [3/4] Capacitor sync...
call npx cap sync android 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Capacitor sync failed
    pause
    exit /b 1
)
echo       Done

echo [4/4] Building APK...
cd android
call gradlew.bat assembleDebug 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] APK build failed
    cd ..
    pause
    exit /b 1
)
cd ..

copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" "apk\apk.apk" > nul 2>&1
copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" "¿¹¹æGPT.apk" > nul 2>&1

echo.
echo ================================
echo  Done!  -^> apk/apk.apk
echo ================================
echo.
pause