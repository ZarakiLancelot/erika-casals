@echo off
REM =================================
REM SCRIPT DE BUILD PARA PRODUCCIÓN - WINDOWS
REM =================================

echo 🚀 Iniciando build para producción...

REM Limpiar builds anteriores
echo 🧹 Limpiando builds anteriores...
if exist dist rmdir /s /q dist
if exist backend\node_modules rmdir /s /q backend\node_modules

REM Frontend Build
echo 📦 Haciendo build del frontend...
call npm install
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Error en frontend build
    pause
    exit /b 1
)

echo ✅ Frontend build exitoso

REM Backend Dependencies
echo 📦 Instalando dependencias del backend...
cd backend
call npm install --production

if %errorlevel% neq 0 (
    echo ❌ Error instalando backend dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies instaladas
cd ..

REM Crear carpeta de distribución
echo 📂 Creando carpeta de distribución...
if not exist deploy mkdir deploy
if not exist deploy\frontend mkdir deploy\frontend
if not exist deploy\backend mkdir deploy\backend

REM Copiar archivos del frontend
echo 📁 Copiando archivos del frontend...
xcopy /s /e /y dist\* deploy\frontend\

REM Copiar archivos del backend
echo 📁 Copiando archivos del backend...
xcopy /s /e /y backend\* deploy\backend\
if exist .env.production copy .env.production deploy\backend\.env

echo.
echo ✅ Build completado!
echo.
echo 📋 Instrucciones de deploy:
echo 1. Frontend: Sube el contenido de 'deploy\frontend' a tu hosting IONOS
echo 2. Backend: Sube el contenido de 'deploy\backend' a Railway/Render
echo.
echo 📁 Archivos generados:
echo    - deploy\frontend\  (para IONOS)
echo    - deploy\backend\   (para Railway/Render)
echo.
pause
