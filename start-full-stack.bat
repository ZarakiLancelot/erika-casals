@echo off
echo ===========================================
echo 🚀 Iniciando Stack Completo - Idealista App
echo ===========================================
echo.

echo 🔧 Verificando dependencias...

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Instálalo desde https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detectado

REM Verificar si npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no está disponible
    pause
    exit /b 1
)

echo ✅ npm detectado
echo.

echo 📦 Instalando dependencias del frontend...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias del frontend
    pause
    exit /b 1
)

echo 📦 Instalando dependencias del backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias del backend
    pause
    exit /b 1
)
cd ..

echo.
echo 🎯 Iniciando servicios...
echo.
echo 🔸 Frontend: http://localhost:5173
echo 🔸 Backend:  http://localhost:5000
echo 🔸 Tests:    http://localhost:5173/test
echo.

REM Iniciar backend en una nueva ventana
start "Backend - Idealista API" cmd /k "cd /d %~dp0backend && npm run dev"

REM Esperar un poco para que el backend se inicie
timeout /t 3 /nobreak >nul

REM Iniciar frontend en la ventana actual
echo 🚀 Iniciando frontend...
npm run dev

pause
