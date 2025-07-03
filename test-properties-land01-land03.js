#!/usr/bin/env node

/**
 * Script de Test para Propiedades LAND - Idealista API
 * Tests Land01-Land03 según el sheet oficial de validaciones
 * 
 * Uso: node test-properties-land01-land03.js
 * 
 * Asegurate de tener el servidor local corriendo:
 * vercel dev --listen 3001
 */

const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
let testContactId = null;
const testResults = [];
const CACHE_FILE = 'test-properties-land01-land03-cache.json';

// Cargar caché de tests exitosos
function loadTestCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      console.log(`📦 Caché cargado: ${Object.keys(cache.results || {}).length} tests exitosos`);
      return cache;
    }
  } catch (error) {
    console.log('⚠️ No se pudo cargar el caché:', error.message);
  }
  return { results: {}, contactId: null };
}

// Guardar caché de tests exitosos
function saveTestCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    console.log(`💾 Caché actualizado: ${Object.keys(cache.results).length} tests exitosos`);
  } catch (error) {
    console.log('⚠️ No se pudo guardar el caché:', error.message);
  }
}

// Helper para hacer requests HTTP
async function makeRequest(method, url, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, options);
    let data;
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { error: 'Non-JSON response', content: text.substring(0, 500) };
    }

    return { status: response.status, data };
  } catch (error) {
    return { status: 0, data: { error: error.message } };
  }
}

// Función para mostrar resultados con soporte de caché
function logTestResult(testId, description, expected, actual, data, notes = '', fromCache = false) {
  const passed = actual === expected;
  const result = {
    id: testId,
    description,
    expected,
    actual,
    passed,
    notes,
    timestamp: new Date().toISOString(),
    response: data,
    fromCache
  };
  
  testResults.push(result);

  console.log(`\n🧪 ${testId} - ${description}`);
  console.log(`Expected: ${expected} | Actual: ${actual} | ${passed ? '✅ PASS' : '❌ FAIL'}${fromCache ? ' 📦 CACHED' : ''}`);
  if (notes) console.log(`📝 ${notes}`);
  if (!passed && !fromCache) {
    console.log(`📋 Response:`, JSON.stringify(data, null, 2));
  }
  console.log('-'.repeat(60));
  
  return passed;
}

// Crear contacto de prueba
async function createTestContact() {
  console.log('📞 Creando contacto de prueba...');
  const contact = await makeRequest('POST', '/api/contacts', {
    name: 'Test Contact',
    lastName: 'Land Property Validation',
    email: 'land.test@idealista.com',
    primaryPhonePrefix: '34',
    primaryPhoneNumber: '666111333'
  });
  
  if (contact.status === 201 && contact.data.success) {
    const contactId = contact.data.data.contactId;
    console.log(`✅ Contacto creado: ${contactId}`);
    return contactId;
  } else {
    console.error('❌ Error creando contacto:', contact.data);
    return null;
  }
}

// Crear propiedad land según especificación oficial de Idealista
function createLandProperty(contactId, landType, classification = null, overrides = {}) {
  const property = {
    type: 'land',
    operation: { 
      type: 'sale', 
      price: 100000 
    },
    scope: 'idealista',
    address: {
      streetName: 'Parcela de Prueba',
      postalCode: '28001',
      country: 'Spain',
      visibility: 'full'
    },
    contactId,
    features: {
      areaPlot: 1000, // Campo requerido
      roadAccess: true, // Campo requerido
      type: landType // Campo requerido - enum: urban/countrybuildable/countrynonbuildable
    },
    descriptions: [
      {
        language: 'es',
        text: 'Terreno de prueba para validación de la API de Idealista. Esta descripción cumple con los requisitos mínimos de contenido para propiedades de tipo land.'
      }
    ]
  };

  // Aplicar reglas según el tipo de land
  if (landType === 'urban' || landType === 'countrybuildable') {
    // Para urban y countrybuildable se requiere al menos un campo de clasificación
    if (classification) {
      Object.keys(classification).forEach(key => {
        property.features[key] = classification[key];
      });
    } else {
      // Por defecto, añadir una clasificación básica
      property.features.classificationChalet = true;
    }
    
    // Campos opcionales permitidos para urban y countrybuildable
    property.features.accessType = landType === 'urban' ? 'urban' : 'road';
    property.features.electricity = true;
    property.features.water = true;
    property.features.location = 'inside_town';
    
  } else if (landType === 'countrynonbuildable') {
    // Para countrynonbuildable NO se permiten campos de clasificación ni utilities
    property.features.roadAccess = false; // Típico para terrenos no edificables
    // NO incluir: accessType, electricity, water, sewerage, etc.
    // NO incluir campos de clasificación
    property.features.location = 'outside_town';
    property.features.nearestLocationKm = 5.5;
  }

  // Aplicar overrides
  if (overrides.features) {
    property.features = { ...property.features, ...overrides.features };
    delete overrides.features;
  }
  
  return { ...property, ...overrides };
}

async function runTests() {
  console.log('🏞️ TESTS LAND01-LAND03 - IDEALISTA API VALIDATION');
  console.log('='.repeat(60));

  // Cargar caché
  const cache = loadTestCache();
  
  // Usar contacto del caché si existe, sino crear nuevo
  if (cache.contactId) {
    testContactId = cache.contactId;
    console.log(`📞 Usando contacto del caché: ${testContactId}`);
  } else {
    testContactId = await createTestContact();
    if (!testContactId) {
      console.error('❌ Abortando: No se pudo crear contacto');
      return;
    }
    cache.contactId = testContactId;
  }

  // Función helper para ejecutar o usar caché
  async function executeOrUseCache(testId, description, expected, requestFn, notes = '') {
    if (cache.results[testId] && cache.results[testId].passed) {
      const cachedResult = cache.results[testId];
      logTestResult(testId, description, expected, cachedResult.actual, cachedResult.response, notes, true);
      return cachedResult;
    } else {
      console.log(`\n📝 ${testId.toUpperCase()} - ${description}`);
      const result = await requestFn();
      const passed = logTestResult(testId, description, expected, result.status, result.data, notes);
      if (passed) {
        cache.results[testId] = {
          passed: true,
          actual: result.status,
          response: result.data,
          timestamp: new Date().toISOString()
        };
      }
      return result;
    }
  }

  try {
    // Land01 - New property Type = land, Features type = urban
    // Según sheet: "Create new property with type = 'land'. Features: send all the fields you have in your CRM that are compatible with features type = 'urban'"
    await executeOrUseCache('Land01', 'Crear nueva propiedad tipo land urban con clasificación', 201, 
      () => {
        const property = createLandProperty(testContactId, 'urban', {
          classificationChalet: true, // Al menos una clasificación requerida
          classificationCommercial: false,
          classificationIndustrial: false
        }, {
          features: {
            areaPlot: 1500,
            areaBuildable: 1000,
            areaTradableMinimum: 800,
            floorsBuildable: 3,
            electricity: true,
            water: true,
            sewerage: true,
            sidewalk: true,
            streetLighting: true,
            naturalGas: false,
            location: 'inside_town'
          }
        });
        
        console.log('📋 Payload Land01:', JSON.stringify(property, null, 2));
        return makeRequest('POST', '/api/properties', property);
      },
      'Land urbano con todos los campos compatibles'
    );

    // Land02 - New property Type = land, Features type = countrybuildable  
    // Según sheet: "Create new property with type = 'land'. Features: send all the fields you have in your CRM that are compatible with features type = 'countrybuildable'"
    await executeOrUseCache('Land02', 'Crear nueva propiedad tipo land countrybuildable con clasificación', 201,
      () => {
        const property = createLandProperty(testContactId, 'countrybuildable', {
          classificationIndustrial: true, // Al menos una clasificación requerida
          classificationCommercial: false,
          classificationChalet: false
        }, {
          features: {
            areaPlot: 2500,
            areaBuildable: 1800,
            areaTradableMinimum: 1500,
            floorsBuildable: 2,
            electricity: true,
            water: true,
            sewerage: false,
            sidewalk: false,
            streetLighting: false,
            naturalGas: false,
            location: 'outside_town',
            nearestLocationKm: 2.5
          }
        });
        
        console.log('📋 Payload Land02:', JSON.stringify(property, null, 2));
        return makeRequest('POST', '/api/properties', property);
      },
      'Land countrybuildable con todos los campos compatibles'
    );

    // Land03 - New property Type = land, Features type = countrynonbuildable
    // Según sheet: "Create new property with type = 'land'. Features: send all the fields you have in your CRM that are compatible with features type = 'countrynonbuildable'"
    await executeOrUseCache('Land03', 'Crear nueva propiedad tipo land countrynonbuildable', 201,
      () => {
        const property = createLandProperty(testContactId, 'countrynonbuildable', null, {
          features: {
            areaPlot: 5000,
            roadAccess: false, // Sin acceso por carretera
            location: 'outside_town',
            nearestLocationKm: 12.0
            // NO incluir: clasificaciones, electricity, water, sewerage, etc.
            // NO incluir: areaBuildable, areaTradableMinimum, floorsBuildable
            // NO incluir: accessType (solo cuando roadAccess es true)
          }
        });
        
        console.log('📋 Payload Land03:', JSON.stringify(property, null, 2));
        return makeRequest('POST', '/api/properties', property);
      },
      'Land countrynonbuildable solo con campos permitidos'
    );

    // Guardar caché actualizado
    saveTestCache(cache);

    // Generar estadísticas
    console.log('\n📊 GENERANDO REPORTE...');
    
    const totalTests = testResults.length;
    const passedTests = testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = ((passedTests / totalTests) * 100).toFixed(2);

    console.log('\n🎉 TESTS LAND01-LAND03 COMPLETADOS!');
    console.log('='.repeat(60));
    console.log(`📈 ESTADÍSTICAS:`);
    console.log(`   Total: ${totalTests} tests`);
    console.log(`   Exitosos: ${passedTests} ✅`);
    console.log(`   Fallidos: ${failedTests} ❌`);
    console.log(`   Tasa de éxito: ${successRate}%`);

    // Guardar reporte
    const report = {
      timestamp: new Date().toISOString(),
      summary: { totalTests, passedTests, failedTests, successRate: `${successRate}%` },
      testContactId,
      results: testResults
    };

    const reportFile = `idealista-properties-land01-land03-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n💾 Reporte guardado: ${reportFile}`);

    // Generar reporte markdown
    let markdown = `# 🏞️ Tests Land01-Land03 - Idealista API

## 📊 Resumen
- **Fecha:** ${new Date().toLocaleDateString('es-ES')}
- **Tests:** Land01 a Land03 (Tipos de terreno)
- **Total:** ${totalTests}
- **Exitosos:** ${passedTests} ✅
- **Fallidos:** ${failedTests} ❌
- **Tasa éxito:** ${successRate}%

## 📋 Resultados

| Test ID | Descripción | Esperado | Actual | Estado |
|---------|-------------|----------|---------|---------|
`;

    testResults.forEach(test => {
      const status = test.passed ? '✅ PASS' : '❌ FAIL';
      markdown += `| ${test.id} | ${test.description} | ${test.expected} | ${test.actual} | ${status} |\n`;
    });

    // Documentar payloads enviados y responses recibidos
    markdown += `\n## 📋 Payloads y Responses

### Land01 - Urban
**Payload enviado:**
\`\`\`json
${JSON.stringify(testResults.find(t => t.id === 'Land01')?.response?.requestPayload || 'No disponible', null, 2)}
\`\`\`

**Response recibido:**
\`\`\`json
${JSON.stringify(testResults.find(t => t.id === 'Land01')?.response || 'No disponible', null, 2)}
\`\`\`

### Land02 - Countrybuildable
**Payload enviado:**
\`\`\`json
${JSON.stringify(testResults.find(t => t.id === 'Land02')?.response?.requestPayload || 'No disponible', null, 2)}
\`\`\`

**Response recibido:**
\`\`\`json
${JSON.stringify(testResults.find(t => t.id === 'Land02')?.response || 'No disponible', null, 2)}
\`\`\`

### Land03 - Countrynonbuildable
**Payload enviado:**
\`\`\`json
${JSON.stringify(testResults.find(t => t.id === 'Land03')?.response?.requestPayload || 'No disponible', null, 2)}
\`\`\`

**Response recibido:**
\`\`\`json
${JSON.stringify(testResults.find(t => t.id === 'Land03')?.response || 'No disponible', null, 2)}
\`\`\`
`;

    if (failedTests > 0) {
      markdown += `\n## ❌ Tests Fallidos\n\n`;
      testResults.filter(t => !t.passed).forEach(test => {
        markdown += `### ${test.id} - ${test.description}\n`;
        markdown += `- **Esperado:** ${test.expected}\n`;
        markdown += `- **Obtenido:** ${test.actual}\n`;
        if (test.notes) markdown += `- **Notas:** ${test.notes}\n`;
        markdown += `- **Error:** \`${JSON.stringify(test.response, null, 2)}\`\n`;
        markdown += `\n`;
      });
    }

    markdown += `\n---\n*Reporte generado automáticamente - ${new Date().toISOString()}*`;

    const markdownFile = 'IDEALISTA_PROPERTIES_LAND01-LAND03_REPORT.md';
    fs.writeFileSync(markdownFile, markdown);
    console.log(`📋 Reporte Markdown: ${markdownFile}`);

    console.log('\n📧 PRÓXIMOS PASOS:');
    console.log('1. Revisar responses de cada tipo de land');
    console.log('2. Validar que los campos enviados coinciden con la documentación');
    console.log('3. Documentar cualquier discrepancia encontrada');

  } catch (error) {
    console.error('\n❌ Error ejecutando tests:', error.message);
  }
}

// Ejecutar tests
runTests();
