#!/bin/bash
# test_inmovilla_curl.sh

echo "🔧 Testing Inmovilla API with CURL"
echo "=================================="
echo ""

# Credenciales (CAMBIAR AQUÍ)
NUMAGENCIA="413"
PASSWORD="TU_PASSWORD_AQUI"
IDIOMA="1"
PAGINA="1"
LIMITE="10"

echo "📝 Generando parámetros..."

# Generar parámetros con PHP
PARAMETROS=$(php -r "
\$p = array(
    'numagencia' => $NUMAGENCIA,
    'password' => '$PASSWORD',
    'idioma' => $IDIOMA,
    'proceso' => 'paginacion',
    'pagina' => $PAGINA,
    'limite' => $LIMITE
);
echo base64_encode(serialize(\$p));
")

echo "✅ Parámetros generados"
echo "📦 Parámetros: $PARAMETROS"
echo ""

echo "🌐 Llamando a API de Inmovilla..."
echo ""

# Hacer CURL
RESPONSE=$(curl -s -X POST \
  https://apiweb.inmovilla.com/apiweb/apiweb.php \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "parametros=${PARAMETROS}")

echo "📥 Respuesta recibida:"
echo "=================================="
echo "$RESPONSE"
echo "=================================="
echo ""

# Guardar respuesta
echo "$RESPONSE" > inmovilla_response.php

echo "💾 Respuesta guardada en: inmovilla_response.php"
echo ""
echo "⚠️  NOTA: La respuesta es código PHP, no JSON"
echo "   Necesitas ejecutarlo con PHP para obtener los datos"
