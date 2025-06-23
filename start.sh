#!/bin/bash

echo "🚀 Iniciando el proyecto Erika - PropertyList Demo"
echo ""
echo "📝 Verificando configuración..."

# Verificar si existe el archivo .env
if [ ! -f ".env" ]; then
    echo "⚠️  Creando archivo .env desde .env.example..."
    cp .env.example .env
fi

echo "✅ Configuración lista"
echo ""
echo "🔧 Instalando dependencias..."
npm install

echo ""
echo "🚀 Iniciando servidor de desarrollo..."
echo ""
echo "📍 La aplicación estará disponible en:"
echo "   👉 http://localhost:5173/ (o el siguiente puerto disponible)"
echo ""
echo "🏠 Para ver las propiedades de prueba:"
echo "   👉 http://localhost:5173/propiedades"
echo ""
echo "💡 Nota: Usando datos de prueba hasta que configures las credenciales de Idealista"
echo ""

npm run dev
