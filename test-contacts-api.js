#!/usr/bin/env node

/**
 * Script automatizado para ejecutar todos los tests de la API de contactos de Idealista
 * 
 * Uso: node test-contacts-api.js
 * 
 * Asegurate de tener el servidor local corriendo en el puerto 3001:
 * vercel dev --port 3001
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';
let createdContactId = null;

// Función helper para hacer requests HTTP
async function makeRequest(method, url, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${url}`, options);
  
  let data;
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.log(`⚠️ Non-JSON response (${contentType}):`, text.substring(0, 200));
    data = { error: 'Non-JSON response', content: text.substring(0, 500) };
  }

  return {
    status: response.status,
    data,
    headers: response.headers
  };
}

// Función para mostrar resultados de test
function showTestResult(testName, expectedStatus, actualStatus, data) {
  console.log(`\n🧪 ${testName}`);
  console.log(`Expected: ${expectedStatus} | Actual: ${actualStatus}`);
  console.log(`Result: ${actualStatus === expectedStatus ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Response:`, JSON.stringify(data, null, 2));
  console.log('-'.repeat(80));
}

async function runTests() {
  console.log('🚀 Iniciando tests de API de Contactos - Idealista\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('='.repeat(80));

  try {
    // Contact01 - Crear contacto válido
    console.log('\n📝 Contact01 - Crear contacto válido');
    const contact01 = await makeRequest('POST', '/api/contacts', {
      name: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      primaryPhonePrefix: '34',
      primaryPhoneNumber: '123456789'
    });
    
    showTestResult('Contact01', 201, contact01.status, contact01.data);
    
    // Guardar ID del contacto creado para los siguientes tests
    if (contact01.status === 201 && contact01.data.success && contact01.data.data.contactId) {
      createdContactId = contact01.data.data.contactId;
      console.log(`💾 Contacto creado con ID: ${createdContactId}`);
    }

    // Contact02 - Crear contacto sin email (Error)
    console.log('\n📝 Contact02 - Crear contacto sin email');
    const contact02 = await makeRequest('POST', '/api/contacts', {
      name: 'María',
      lastName: 'García',
      primaryPhonePrefix: '34',
      primaryPhoneNumber: '987654321'
    });
    
    showTestResult('Contact02', 400, contact02.status, contact02.data);

    // Contact03 - Crear contacto con email inválido (Error)
    console.log('\n📝 Contact03 - Crear contacto con email inválido');
    const contact03 = await makeRequest('POST', '/api/contacts', {
      name: 'Pedro',
      lastName: 'López',
      email: 'email-invalido',
      primaryPhonePrefix: '34',
      primaryPhoneNumber: '111222333'
    });
    
    showTestResult('Contact03', 400, contact03.status, contact03.data);

    // Contact04 - Obtener contacto por ID
    if (createdContactId) {
      console.log('\n📝 Contact04 - Obtener contacto por ID');
      const contact04 = await makeRequest('GET', `/api/contacts/${createdContactId}`);
      
      showTestResult('Contact04', 200, contact04.status, contact04.data);
    } else {
      console.log('\n❌ Contact04 - SKIPPED: No se pudo crear el contacto en Contact01');
    }

    // Contact05 - Actualizar contacto existente
    if (createdContactId) {
      console.log('\n📝 Contact05 - Actualizar contacto existente');
      const contact05 = await makeRequest('PUT', `/api/contacts/${createdContactId}`, {
        name: 'Juan Actualizado',
        lastName: 'Pérez Actualizado',
        email: 'juan.perez.updated@example.com',
        primaryPhonePrefix: '34',
        primaryPhoneNumber: '123456789'
      });
      
      showTestResult('Contact05', 200, contact05.status, contact05.data);
    } else {
      console.log('\n❌ Contact05 - SKIPPED: No se pudo crear el contacto en Contact01');
    }

    // Contact06 - Obtener todos los contactos
    console.log('\n📝 Contact06 - Obtener todos los contactos');
    const contact06 = await makeRequest('GET', '/api/contacts?page=1&size=10');
    
    showTestResult('Contact06', 200, contact06.status, contact06.data);

    console.log('\n🎉 Tests completados!');
    console.log('\n📄 Documenta estos resultados y envíalos a Idealista como evidencia.');

  } catch (error) {
    console.error('\n❌ Error ejecutando tests:', error.message);
    console.log('\n🔧 Soluciones posibles:');
    console.log('1. Asegurate de que el servidor esté corriendo: vercel dev --port 3001');
    console.log('2. Verifica que las variables de entorno estén configuradas');
    console.log('3. Revisa la conexión con la API de Idealista');
  }
}

// Ejecutar tests
runTests();
