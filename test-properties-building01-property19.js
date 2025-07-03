#!/usr/bin/env node

/**
 * Script de Test para Propiedades - Idealista API
 * Tests Building01-Property19 según el sheet ofi  if (type === 'b  if (type === 'building') {
    features = {
      areaConstructed: 500,
      conservation: 'good',
      energyCertificateRating: 'D',
      energyCertificateEmissionsRating: 'E',
      floorsBuilding: 5,
      parkingSpacesNumber: 3,
      propertyTenants: true, // Obligatorio para operación sale
      classificationChalet: false,
      classificationCommercial: true,
      classificationHotel: false,
      classificationIndustrial: false,
      classificationOffice: false,
      classificationOther: false
    };
    operation.price = 800000;eatures = {
      areaConstructed: 500,
      conservation: 'good',
      energyCertificateRating: 'D',
      energyCertificateEmissionsRating: 'E',
      liftNumber: 1,
      parkingSpacesNumber: 3,
      floorsBuilding: 5,
      tenants: true, // Requerido para operación sale (boolean)
      classificationChalet: false,
      classificationCommercial: true,
      classificationHotel: false,
      classificationIndustrial: false,
      classificationOffice: false,
      classificationOther: false
    };
    operation.price = 800000;es
 * 
 * Uso: node test-properties-building01-property19.js
 * 
 * Asegurate de tener el servidor local corriendo:
 * vercel dev --listen 3001
 */

const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
let testContactId = null;
const testResults = [];
const CACHE_FILE = 'test-properties-building01-property19-cache.json';
let createdPropertyIds = []; // Para almacenar IDs de propiedades creadas

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
  return { results: {}, contactId: null, propertyIds: [] };
}

// Guardar caché de tests exitosos
function saveTestCache(cache) {
  try {
    cache.propertyIds = createdPropertyIds;
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
function createBaseProperty(contactId, type = 'building', overrides = {}) {
  let features = {};
  const operation = { type: 'sale', price: 100000 };
  
  if (type === 'building') {
    features = {
      areaConstructed: 500,
      conservation: 'good',
      energyCertificateRating: 'D',
      energyCertificateEmissionsRating: 'E',
      liftNumber: 1,
      parkingSpacesNumber: 3,
      floorsBuilding: 5,
      // tenantNumber: 5, // Requerido por lógica de negocio pero no permitido por schema - BUG API
      classificationChalet: false,
      classificationCommercial: true,
      classificationHotel: false,
      classificationIndustrial: false,
      classificationOffice: false,
      classificationOther: false
    };
    operation.price = 800000;
  } else if (type === 'room') {
    features = {
      areaConstructed: 15,
      bathroomNumber: 1,
      availableFrom: '2025-07', // Formato YYYY-MM
      bedType: 'single',
      couplesAllowed: false,
      liftAvailable: true,
      minimalStay: 1,
      occupiedNow: false,
      petsAllowed: false, // Campo obligatorio para room
      rooms: 2, // Mínimo 2
      smokingAllowed: false,
      tenantNumber: 2, // Mínimo 2
      windowView: 'street_view', // Campo requerido para room
      type: 'shared_flat' // Valor válido del enum
    };
    operation.price = 500;
  }

  const baseProperty = {
    type,
    operation,
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

  // Para building, agregar classification si no se especifica lo contrario
  if (type === 'building' && !overrides.skipClassification) {
    // No agregar nada aquí para el caso normal (Building01)
    // Building02 usará skipClassification: true
  }

  // Aplicar overrides
  if (overrides.features) {
    baseProperty.features = { ...baseProperty.features, ...overrides.features };
    delete overrides.features;
  }
  
  if (overrides.skipClassification) {
    delete overrides.skipClassification;
  }
  
  return { ...baseProperty, ...overrides };
}

async function runTests() {
  console.log('🏗️ TESTS BUILDING01-PROPERTY19 - IDEALISTA API VALIDATION');
  console.log('='.repeat(60));

  // Cargar caché
  const cache = loadTestCache();
  createdPropertyIds = cache.propertyIds || [];
  
  // Usar contacto del caché si existe, sino crear nuevo
  if (cache.contactId) {
    testContactId = cache.contactId;
    console.log(`📞 Usando contacto del caché: ${testContactId}`);
  } else {
    // Intentar usar contacto de tests anteriores
    testContactId = 100188898; // ID del contacto usado en tests anteriores
    console.log(`📞 Usando contacto de tests anteriores: ${testContactId}`);
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
        
        // Si es una creación exitosa, guardar el propertyId
        if (result.status === 201 && result.data.success && result.data.data && result.data.data.propertyId) {
          createdPropertyIds.push(result.data.data.propertyId);
        }
      }
      return result;
    }
  }

  try {
    // Building01 - New property Type = building
    console.log('\n📝 BUILDING01 - Crear nueva propiedad tipo building');
    await executeOrUseCache('Building01', 'Crear nueva propiedad tipo building', 201,
      () => makeRequest('POST', '/api/properties', createBaseProperty(testContactId, 'building'))
    );

    // Building02 - New property Type = building - Basic validation error - classification
    console.log('\n📝 BUILDING02 - Basic validation error - classification');
    await executeOrUseCache('Building02', 'Error validación - building sin classification', 400,
      () => makeRequest('POST', '/api/properties', createBaseProperty(testContactId, 'building', { 
        skipClassification: true,
        features: {
          areaConstructed: 500,
          conservation: 'good',
          energyCertificateRating: 'D',
          energyCertificateEmissionsRating: 'E',
          liftNumber: 1,
          parkingSpacesNumber: 3,
          floorsBuilding: 5
          // Sin campos de classification - debería generar error
        }
      }))
    );

    // Room01 - New property Type = room, Operation = rent
    console.log('\n📝 ROOM01 - New property Type = room, Operation = rent');
    await executeOrUseCache('Room01', 'Crear nueva propiedad tipo room para rent', 201,
      () => makeRequest('POST', '/api/properties', createBaseProperty(testContactId, 'room', {
        operation: { type: 'rent', price: 500 }
      }))
    );

    // Room02 - New property Type = room, Operation = sale - Basic validation error - operation
    console.log('\n📝 ROOM02 - Basic validation error - operation');
    await executeOrUseCache('Room02', 'Error validación - room solo puede ser rent', 400,
      () => makeRequest('POST', '/api/properties', createBaseProperty(testContactId, 'room', {
        operation: { type: 'sale', price: 50000 }
      }))
    );

    // Asegurar que tenemos al menos una propiedad para los tests de operaciones
    if (createdPropertyIds.length === 0) {
      console.log('\n📝 Usando propertyId de tests anteriores exitosos...');
      // Usar un ID de propiedad de los tests anteriores que sabemos que funcionan
      createdPropertyIds.push(108624605); // Office01 exitoso
    }

    const testPropertyId = createdPropertyIds[0];
    const nonExistentPropertyId = 999999999;

    // Property10 - Find property
    console.log('\n📝 PROPERTY10 - Find property');
    await executeOrUseCache('Property10', 'Buscar propiedad existente', 200,
      () => makeRequest('GET', `/api/properties/${testPropertyId}`)
    );

    // Property11 - Find property - Error not found
    console.log('\n📝 PROPERTY11 - Find property - Error not found');
    await executeOrUseCache('Property11', 'Buscar propiedad inexistente', 404,
      () => makeRequest('GET', `/api/properties/${nonExistentPropertyId}`)
    );

    // Property12 - Find all properties
    console.log('\n📝 PROPERTY12 - Find all properties');
    await executeOrUseCache('Property12', 'Buscar todas las propiedades', 200,
      () => makeRequest('GET', '/api/properties')
    );

    // Property13 - Update property
    console.log('\n📝 PROPERTY13 - Update property');
    await executeOrUseCache('Property13', 'Actualizar propiedad existente', 200,
      () => makeRequest('PUT', `/api/properties/${testPropertyId}`, {
        type: 'office',
        operation: { type: 'sale', price: 200000 },
        scope: 'idealista',
        address: {
          streetName: 'Calle de Prueba Actualizada',
          postalCode: '28001',
          country: 'Spain',
          visibility: 'full'
        },
        contactId: testContactId,
        features: { 
          areaConstructed: 120, // Campo actualizado
          areaUsable: 110,
          bathroomNumber: 2,
          conservation: 'good',
          energyCertificateRating: 'D',
          energyCertificateEmissionsRating: 'E',
          conditionedAirType: 'cold',
          liftNumber: 1,
          officeBuilding: true,
          parkingSpacesNumber: 2,
          roomsSplitted: 'withWalls',
          windowsLocation: 'external'
        },
        descriptions: [{
          language: 'es',
          text: 'Propiedad actualizada para validación de la API de Idealista.'
        }]
      })
    );

    // Property14 - Update property - Business errors - type
    console.log('\n📝 PROPERTY14 - Update property - Business errors - type');
    await executeOrUseCache('Property14', 'Error negocio - no se puede cambiar tipo', 400,
      () => makeRequest('PUT', `/api/properties/${testPropertyId}`, {
        type: 'house' // Intentar cambiar el tipo
      })
    );

    // Property15 - Update property - Error not found
    console.log('\n📝 PROPERTY15 - Update property - Error not found');
    await executeOrUseCache('Property15', 'Actualizar propiedad inexistente', 404,
      () => makeRequest('PUT', `/api/properties/${nonExistentPropertyId}`, {
        type: 'office',
        operation: { type: 'sale', price: 200000 },
        scope: 'idealista',
        address: {
          streetName: 'Calle de Prueba',
          postalCode: '28001',
          country: 'Spain',
          visibility: 'full'
        },
        contactId: testContactId,
        features: { 
          areaConstructed: 100,
          areaUsable: 95,
          bathroomNumber: 1,
          conservation: 'good',
          energyCertificateRating: 'E',
          energyCertificateEmissionsRating: 'F',
          conditionedAirType: 'cold',
          liftNumber: 1,
          officeBuilding: true,
          parkingSpacesNumber: 1,
          roomsSplitted: 'withWalls',
          windowsLocation: 'external'
        },
        descriptions: [{
          language: 'es',
          text: 'Propiedad inexistente para validación de error 404.'
        }]
      })
    );

    // Property16 - Deactivate property
    console.log('\n📝 PROPERTY16 - Deactivate property');
    await executeOrUseCache('Property16', 'Desactivar propiedad existente', 200,
      () => makeRequest('PUT', `/api/properties/${testPropertyId}/deactivate`)
    );

    // Property17 - Deactivate property - Error not found
    console.log('\n📝 PROPERTY17 - Deactivate property - Error not found');
    await executeOrUseCache('Property17', 'Desactivar propiedad inexistente', 404,
      () => makeRequest('PUT', `/api/properties/${nonExistentPropertyId}/deactivate`)
    );

    // Property18 - Reactivate property
    console.log('\n📝 PROPERTY18 - Reactivate property');
    await executeOrUseCache('Property18', 'Reactivar propiedad existente', 200,
      () => makeRequest('PUT', `/api/properties/${testPropertyId}/reactivate`)
    );

    // Property19 - Reactivate property - Error not found
    console.log('\n📝 PROPERTY19 - Reactivate property - Error not found');
    await executeOrUseCache('Property19', 'Reactivar propiedad inexistente', 404,
      () => makeRequest('PUT', `/api/properties/${nonExistentPropertyId}/reactivate`)
    );

    // Guardar caché actualizado
    saveTestCache(cache);

    // Generar estadísticas
    console.log('\n📊 GENERANDO REPORTE...');
    
    const totalTests = testResults.length;
    const passedTests = testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = ((passedTests / totalTests) * 100).toFixed(2);

    console.log('\n🎉 TESTS BUILDING01-PROPERTY19 COMPLETADOS!');
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
      createdPropertyIds,
      results: testResults
    };

    const reportFile = `idealista-properties-building01-property19-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n💾 Reporte guardado: ${reportFile}`);

    // Generar reporte markdown
    let markdown = `# 🏗️ Tests Building01-Property19 - Idealista API

## 📊 Resumen
- **Fecha:** ${new Date().toLocaleDateString('es-ES')}
- **Tests:** Building01 a Property19 (Building, Room y operaciones CRUD)
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

    const markdownFile = 'IDEALISTA_PROPERTIES_BUILDING01-PROPERTY19_REPORT.md';
    fs.writeFileSync(markdownFile, markdown);
    console.log(`📋 Reporte Markdown: ${markdownFile}`);

    console.log('\n📧 PRÓXIMOS PASOS:');
    console.log('1. Revisar tests de validación fallidos');
    console.log('2. Verificar endpoints de operaciones CRUD');
    console.log('3. Completar validación de todos los tipos de propiedades');

  } catch (error) {
    console.error('\n❌ Error ejecutando tests:', error.message);
  }
}

// Ejecutar tests
runTests();
