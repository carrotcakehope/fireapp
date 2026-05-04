@echo off
chcp 65001 > nul
title 전송용 ZIP 만들기

cd /d "%~dp0"

echo.
echo ================================
echo  전송용 ZIP 생성
echo  (node_modules / 빌드캐시 제외)
echo ================================
echo.

set "ZIPNAME=%~dp0예방GPT_소스.zip"

:: PowerShell로 필요한 파일만 압축
powershell -NoProfile -Command ^
  "$src = '%~dp0'; $zip = '%ZIPNAME%';" ^
  "if (Test-Path $zip) { Remove-Item $zip };" ^
  "$include = @('index.html','styles.css','app.js','capacitor.config.json','package.json','package-lock.json','ilgu.ico','make_icons.js','빌드.bat','전송용_압축만들기.bat');" ^
  "$androidExclude = @('build','.gradle','captures');" ^
  "Add-Type -Assembly 'System.IO.Compression.FileSystem';" ^
  "$za = [System.IO.Compression.ZipFile]::Open($zip, 'Create');" ^
  "foreach ($f in $include) { $fp = Join-Path $src $f; if (Test-Path $fp) { [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($za, $fp, $f) | Out-Null } };" ^
  "function AddDir($base, $rel) { Get-ChildItem (Join-Path $base $rel) -Recurse -File | ForEach-Object { $skip=$false; foreach($x in $androidExclude){ if($_.FullName -match [regex]::Escape($x)){ $skip=$true } }; if(-not $skip){ $entry=$_.FullName.Substring($base.Length).TrimStart('\\','/'); [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($za, $_.FullName, $entry) | Out-Null } } };" ^
  "AddDir $src 'android';" ^
  "$za.Dispose();" ^
  "Write-Host '완료:' $zip"

echo.
echo 생성된 ZIP 파일을 새 컴퓨터로 옮긴 후
echo 압축 풀고 빌드.bat 를 실행하면 됩니다.
echo (새 컴퓨터에 Node.js + Android Studio 필요)
echo.
pause
