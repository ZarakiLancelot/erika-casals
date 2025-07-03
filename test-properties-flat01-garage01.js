#!/usr/bin/env node

/**
 * Script de Test para Propiedades - Idealista API
 * Tests Flat01-Garage01 según el sheet oficial de validaciones
 * 
 * Uso: node test-properties-flat01-garage01.js
 * 
 * Asegurate de tener el servidor local corriendo:
 * vercel dev --listen 3001
 */

const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
let testContactId = null;
const testResults = [];
const CACHE_FILE = 'test-properties-cache.json';

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

  const cacheFlag = fromCache ? '📦 (CACHE)' : '';
  console.log(`\n🧪 ${testId} - ${description} ${cacheFlag}`);
  console.log(`Expected: ${expected} | Actual: ${actual} | ${passed ? '✅ PASS' : '❌ FAIL'}`);
  if (notes) console.log(`📝 ${notes}`);
  if (!passed) {
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
    lastName: 'Property Validation',
    email: 'properties.test@idealista.com',
    primaryPhonePrefix: '34',
    primaryPhoneNumber: '666111222'
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

// Estructura base de propiedad válida
function createBaseProperty(contactId, type = 'flat', overrides = {}) {
  let features = {};
  
  if (type === 'flat') {
    features = {
      areaConstructed: 100,
      areaUsable: 95,
      bathroomNumber: 2,
      rooms: 3,
      conservation: 'good',
      liftAvailable: true,
      balcony: false,
      terrace: false,
      garden: false,
      pool: false,
      parkingAvailable: false,
      parkingIncludedInPrice: false,
      conditionedAir: false,
      heatingType: 'central_gas',
      energyCertificateRating: 'D',
      energyCertificateEmissionsRating: 'E',
      windowsLocation: 'external'
    };
  } else if (type === 'house' || type === 'countryhouse') {
    features = {
      type: type === 'house' ? 'independent' : 'countryhouse',
      areaConstructed: 200,
      areaUsable: 180,
      bathroomNumber: 3,
      rooms: 4,
      conservation: 'good',
      balcony: false,
      terrace: true,
      garden: true,
      pool: false,
      parkingAvailable: true,
      conditionedAir: false,
      heatingType: 'central_gas',
      energyCertificateRating: 'D',
      energyCertificateEmissionsRating: 'E'
    };
  } else if (type === 'garage') {
    features = {
      areaConstructed: 20,
      garageCapacity: 'car_compact'
    };
  }

  const baseProperty = {
    type,
    operation: {
      type: 'sale',
      price: type === 'garage' ? 25000 : 250000
    },
    scope: 'idealista',
    address: {
      streetName: 'Calle de Prueba',
      postalCode: '28001',
      country: 'Spain',
      visibility: 'full'
    },
    contactId,
    features,
    descriptions: [
      {
        language: 'es',
        text: 'Propiedad de prueba para validación de la API de Idealista. Esta descripción cumple con los requisitos mínimos de contenido.'
      }
    ]
  };

  // Aplicar overrides
  if (overrides.features) {
    baseProperty.features = { ...baseProperty.features, ...overrides.features };
    delete overrides.features;
  }
  
  return { ...baseProperty, ...overrides };
}

async function runTests() {
  console.log('🏠 TESTS FLAT01-GARAGE01 - IDEALISTA API VALIDATION');
  console.log('='.repeat(60));

  // Cargar caché de tests exitosos
  const testCache = loadTestCache();
  
  // Usar contacto del caché o crear uno nuevo
  if (testCache.contactId) {
    testContactId = testCache.contactId;
    console.log(`📦 Usando contacto del caché: ${testContactId}`);
  } else {
    testContactId = await createTestContact();
    if (!testContactId) {
      console.error('❌ Abortando: No se pudo crear contacto');
      return;
    }
    testCache.contactId = testContactId;
  }

  // Función helper para ejecutar o usar caché
  async function executeOrUseCache(testId, description, expectedStatus, testFunction) {
    const cacheKey = testId;
    
    if (testCache.results[cacheKey] && testCache.results[cacheKey].passed) {
      // Usar resultado del caché
      const cached = testCache.results[cacheKey];
      logTestResult(testId, description, expectedStatus, cached.actual, cached.response, cached.notes, true);
      return true;
    } else {
      // Ejecutar test
      console.log(`\n📝 ${testId.toUpperCase()} - ${description}`);
      const result = await testFunction();
      const passed = logTestResult(testId, description, expectedStatus, result.status, result.data);
      
      // Guardar en caché si pasó
      if (passed) {
        testCache.results[cacheKey] = {
          actual: result.status,
          response: result.data,
          passed: true,
          notes: '',
          timestamp: new Date().toISOString()
        };
      }
      
      return passed;
    }
  }

  try {
    // Flat01 - New property Type = flat (should pass)
    await executeOrUseCache('Flat01', 'Crear nueva propiedad tipo flat', 201, async () => {
      return await makeRequest('POST', '/api/properties', createBaseProperty(testContactId, 'flat'));
    });

    // Flat02 - Basic validation error - area (areaConstructed < 10)
    await executeOrUseCache('Flat02', 'Error validación básica - área menor a 10', 400, async () => {
      return await makeRequest('POST', '/api/properties', 
        createBaseProperty(testContactId, 'flat', {
          features: {
            ...createBaseProperty(testContactId, 'flat').features,
            areaConstructed: 5  // Menor a 10 para generar error
          }
        })
      );
    });

    // Flat03 - Business validation error - areaConstructed cannot be lower than areaUsable
    await executeOrUseCache('Flat03', 'Error negocio - areaConstructed < areaUsable', 400, async () => {
      return await makeRequest('POST', '/api/properties', 
        createBaseProperty(testContactId, 'flat', {
          features: {
            ...createBaseProperty(testContactId, 'flat').features,
            areaConstructed: 80,
            areaUsable: 100  // areaUsable mayor que areaConstructed
          }
        })
      );
    });

    // Flat04 - Business validation error - conservation/bathroomNumber
    await executeOrUseCache('Flat04', 'Error negocio - conservation incompatible con bathroomNumber', 400, async () => {
      return await makeRequest('POST', '/api/properties', 
        createBaseProperty(testContactId, 'flat', {
          features: {
            ...createBaseProperty(testContactId, 'flat').features,
            conservation: 'good',
            bathroomNumber: 0  // Inconsistencia: conservación buena pero 0 baños
          }
        })
      );
    });

    // Flat05 - Business validation error - parkingAvailable/parkingIncludedInPrice
    await executeOrUseCache('Flat05', 'Error negocio - parking no disponible pero incluido en precio', 400, async () => {
      return await makeRequest('POST', '/api/properties', 
        createBaseProperty(testContactId, 'flat', {
          features: {
            ...createBaseProperty(testContactId, 'flat').features,
            parkingAvailable: false,
            parkingIncludedInPrice: true  // Inconsistencia: no parking disponible pero incluido en precio
          }
        })
      );
    });

    // House01 - New property Type = house
    await executeOrUseCache('House01', 'Crear nueva propiedad tipo house', 201, async () => {
      return await makeRequest('POST', '/api/properties', createBaseProperty(testContactId, 'house'));
    });

    // CountryHouse01 - New property Type = countryhouse
    await executeOrUseCache('CountryHouse01', 'Crear nueva propiedad tipo countryhouse', 201, async () => {
      return await makeRequest('POST', '/api/properties', createBaseProperty(testContactId, 'countryhouse'));
    });

    // Garage01 - New property Type = garage
    await executeOrUseCache('Garage01', 'Crear nueva propiedad tipo garage', 201, async () => {
      return await makeRequest('POST', '/api/properties', createBaseProperty(testContactId, 'garage'));
    });

    // Guardar caché actualizado
    saveTestCache(testCache);

    // Generar estadísticas
    console.log('\n📊 GENERANDO REPORTE...');
    
    const totalTests = testResults.length;
    const passedTests = testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = ((passedTests / totalTests) * 100).toFixed(2);

    console.log('\n🎉 TESTS FLAT01-GARAGE01 COMPLETADOS!');
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

    const reportFile = `idealista-properties-flat01-garage01-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n💾 Reporte guardado: ${reportFile}`);

    // Generar reporte markdown
    let markdown = `# 🏠 Tests Flat01-Garage01 - Idealista API

## 📊 Resumen
- **Fecha:** ${new Date().toLocaleDateString('es-ES')}
- **Tests:** Flat01 a Garage01 (Validaciones y tipos de propiedad)
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

    if (failedTests > 0) {
      markdown += `\n## ❌ Tests Fallidos\n\n`;
      testResults.filter(t => !t.passed).forEach(test => {
        markdown += `### ${test.id} - ${test.description}\n`;
        markdown += `- **Esperado:** ${test.expected}\n`;
        markdown += `- **Obtenido:** ${test.actual}\n`;
        if (test.notes) markdown += `- **Notas:** ${test.notes}\n`;
        markdown += `\n`;
      });
    }

    markdown += `\n---\n*Reporte generado automáticamente - ${new Date().toISOString()}*`;

    const markdownFile = 'IDEALISTA_PROPERTIES_FLAT01-GARAGE01_REPORT.md';
    fs.writeFileSync(markdownFile, markdown);
    console.log(`📋 Reporte Markdown: ${markdownFile}`);

    console.log('\n📧 PRÓXIMOS PASOS:');
    console.log('1. Revisar tests de validación fallidos');
    console.log('2. Ajustar reglas de validación si es necesario');
    console.log('3. Continuar con más tipos de propiedades');

  } catch (error) {
    console.error('\n❌ Error ejecutando tests:', error.message);
  }
}

// Ejecutar tests
runTests();
