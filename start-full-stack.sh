#!/bin/bash

echo "==========================================="
echo "🚀 Iniciando Stack Completo - Idealista App"
echo "==========================================="
echo

echo "🔧 Verificando dependencias..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Instálalo desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está disponible"
    exit 1
fi

echo "✅ npm detectado: $(npm --version)"
echo

echo "📦 Instalando dependencias del frontend..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias del frontend"
    exit 1
fi

echo "📦 Instalando dependencias del backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias del backend"
    exit 1
fi
cd ..

echo
echo "🎯 Iniciando servicios..."
echo
echo "🔸 Frontend: http://localhost:5173"
echo "🔸 Backend:  http://localhost:5000"
echo "🔸 Tests:    http://localhost:5173/test"
echo

# Función para manejar la interrupción (Ctrl+C)
trap 'echo ""; echo "🛑 Deteniendo servicios..."; kill $(jobs -p); exit' SIGINT

# Iniciar backend en segundo plano
echo "🚀 Iniciando backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Esperar un poco para que el backend se inicie
sleep 3

# Iniciar frontend
echo "🚀 Iniciando frontend..."
npm run dev &
FRONTEND_PID=$!

# Esperar a que terminen los procesos
wait $BACKEND_PID $FRONTEND_PID
