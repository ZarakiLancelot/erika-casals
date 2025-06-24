#!/bin/bash

# =================================
# SCRIPT DE BUILD PARA PRODUCCIÓN
# =================================

echo "🚀 Iniciando build para producción..."

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf dist/
rm -rf backend/node_modules/

# Frontend Build
echo "📦 Haciendo build del frontend..."
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build exitoso"
else
    echo "❌ Error en frontend build"
    exit 1
fi

# Backend Dependencies
echo "📦 Instalando dependencias del backend..."
cd backend
npm install --production

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies instaladas"
else
    echo "❌ Error instalando backend dependencies"
    exit 1
fi

cd ..

# Crear carpeta de distribución
echo "📂 Creando carpeta de distribución..."
mkdir -p deploy/frontend
mkdir -p deploy/backend

# Copiar archivos del frontend
echo "📁 Copiando archivos del frontend..."
cp -r dist/* deploy/frontend/

# Copiar archivos del backend
echo "📁 Copiando archivos del backend..."
cp -r backend/* deploy/backend/
cp .env.production deploy/backend/.env

echo "✅ Build completado!"
echo ""
echo "📋 Instrucciones de deploy:"
echo "1. Frontend: Sube el contenido de 'deploy/frontend' a tu hosting IONOS"
echo "2. Backend: Sube el contenido de 'deploy/backend' a Railway/Render"
echo ""
echo "📁 Archivos generados:"
echo "   - deploy/frontend/  (para IONOS)"
echo "   - deploy/backend/   (para Railway/Render)"
