@echo off
echo 🚀 Iniciando el proyecto Erika - PropertyList Demo
echo.
echo 📝 Verificando configuración...

REM Verificar si existe el archivo .env
if not exist ".env" (
    echo ⚠️  Creando archivo .env desde .env.example...
    copy .env.example .env
)

echo ✅ Configuración lista
echo.
echo 🔧 Instalando dependencias...
call npm install

echo.
echo 🚀 Iniciando servidor de desarrollo...
echo.
echo 📍 La aplicación estará disponible en:
echo    👉 http://localhost:5173/ (o el siguiente puerto disponible^)
echo.
echo 🏠 Para ver las propiedades de prueba:
echo    👉 http://localhost:5173/propiedades
echo.
echo 💡 Nota: Usando datos de prueba hasta que configures las credenciales de Idealista
echo.

call npm run dev
pause
