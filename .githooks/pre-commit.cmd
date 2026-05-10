@echo off
setlocal

if "%SKIP_LOCAL_GATES%"=="1" (
  echo [pre-commit] SKIP_LOCAL_GATES=1 -^> skipping local quality gates
  exit /b 0
)

where /q pwsh
if %ERRORLEVEL%==0 (
  pwsh -NoProfile -ExecutionPolicy Bypass -File "%~dp0pre-commit.ps1"
  set exitCode=%ERRORLEVEL%
  exit /b %exitCode%
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0pre-commit.ps1"
set exitCode=%ERRORLEVEL%
exit /b %exitCode%

