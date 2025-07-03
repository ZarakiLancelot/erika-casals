#!/usr/bin/env node

/**
 * Script de Test para Operaciones CRUD - Idealista API
 * Tests Property10-Property19 SEGÚN EL SHEET OFICIAL EXACTO
 * 
 * Uso: node test-properties-crud-official.js
 * 
 * Asegurate de tener el servidor local corriendo:
 * vercel dev --listen 3001
 */

const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
const testResults = [];

// PropertyIds de propiedades ya creadas exitosamente
const VALID_PROPERTY_IDS = [
  108635797, // Office01
  108635799, // Commercial01
  108635801, // Commercial02
  108635805, // Land03 (countrynonbuildable)
  108635803  // StorageRoom01
];

// ContactId válido
const VALID_CONTACT_ID = 100206138;

/**
 * Función para hacer requests a la API
 */
async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    let data;
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text, rawResponse: true };
    }
    
    return {
      status: response.status,
      data
    };

  } catch (error) {
    return {
      status: 500,
      data: { error: error.message }
    };
  }
}

/**
 * Función para ejecutar un test y guardar resultado
 */
async function runTest(testId, description, expectedStatus, testFunction) {
  console.log(`\n🧪 Ejecutando ${testId}: ${description}`);
  
  try {
    const result = await testFunction();
    const passed = result.status === expectedStatus;
    
    const testResult = {
      id: testId,
      description,
      expected: expectedStatus,
      actual: result.status,
      passed,
      notes: passed ? "" : `Expected ${expectedStatus}, got ${result.status}`,
      timestamp: new Date().toISOString(),
      response: result.data
    };
    
    testResults.push(testResult);
    
    if (passed) {
      console.log(`✅ ${testId} PASSED`);
    } else {
      console.log(`❌ ${testId} FAILED - Expected ${expectedStatus}, got ${result.status}`);
      console.log(`Response:`, JSON.stringify(result.data, null, 2));
    }
    
    return testResult;
    
  } catch (error) {
    console.log(`💥 ${testId} ERROR:`, error.message);
    
    const testResult = {
      id: testId,
      description,
      expected: expectedStatus,
      actual: 'ERROR',
      passed: false,
      notes: error.message,
      timestamp: new Date().toISOString(),
      response: { error: error.message }
    };
    
    testResults.push(testResult);
    return testResult;
  }
}

/**
 * Property10: Find property - Find any of the properties previously created
 */
async function testProperty10() {
  const propertyId = VALID_PROPERTY_IDS[0]; // Usar Office01
  return await makeRequest(`/api/properties/${propertyId}`);
}

/**
 * Property11: Find property Error not found - Find a property using any property id not belonging to the office used for the tests
 */
async function testProperty11() {
  const fakePropertyId = 999999999; // ID que no pertenece a nuestra oficina
  return await makeRequest(`/api/properties/${fakePropertyId}`);
}

/**
 * Property12: Find all properties - Find all properties of the office. Make sure to send proper page and size values
 */
async function testProperty12() {
  return await makeRequest('/api/properties?page=1&size=50');
}

/**
 * Property13: Update property - Update any feature of any of the properties previously created
 */
async function testProperty13() {
  const propertyId = VALID_PROPERTY_IDS[0]; // Usar Office01
  
  const updatePayload = {
    type: 'office',
    operation: {
      type: 'sale',
      price: 250000 // Cambiar precio
    },
    address: {
      streetName: 'Calle de Prueba Actualizada Property13',
      postalCode: '28001',
      country: 'Spain',
      visibility: 'full'
    },
    contactId: VALID_CONTACT_ID,
    features: {
      areaConstructed: 180, // Cambiar área
      areaUsable: 170,
      bathroomNumber: 2,
      conservation: 'good',
      energyCertificateRating: 'D',
      energyCertificateEmissionsRating: 'E',
      conditionedAirType: 'cold',
      liftNumber: 1,
      officeBuilding: true,
      parkingSpacesNumber: 3, // Cambiar número de parkings
      roomsSplitted: 'withWalls',
      windowsLocation: 'external'
    },
    descriptions: [
      {
        language: 'es',
        text: 'Oficina actualizada en Property13 - Features modificados.'
      }
    ]
  };
  
  return await makeRequest(`/api/properties/${propertyId}`, 'PUT', updatePayload);
}

/**
 * Property14: Update property Business errors - type - Update the type of any of the properties previously created
 * (400 - error message describing that the type of the property cannot be changed)
 */
async function testProperty14() {
  const propertyId = VALID_PROPERTY_IDS[1]; // Usar Commercial01
  
  const updatePayload = {
    type: 'office', // ❌ INTENTAR CAMBIAR DE 'commercial' a 'office' - DEBE FALLAR
    operation: {
      type: 'sale',
      price: 300000
    },
    address: {
      streetName: 'Calle de Prueba',
      postalCode: '28001',
      country: 'Spain',
      visibility: 'full'
    },
    contactId: VALID_CONTACT_ID,
    features: {
      areaConstructed: 150,
      areaUsable: 140,
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
    descriptions: [
      {
        language: 'es',
        text: 'Intento de cambiar tipo - Property14.'
      }
    ]
  };
  
  return await makeRequest(`/api/properties/${propertyId}`, 'PUT', updatePayload);
}

/**
 * Property15: Update property Error not found - Update a property using any property id not belonging to the office used for the tests
 */
async function testProperty15() {
  const fakePropertyId = 888888888;
  
  const updatePayload = {
    type: 'office',
    operation: {
      type: 'sale',
      price: 100000
    },
    address: {
      streetName: 'Calle Inexistente',
      postalCode: '28001',
      country: 'Spain',
      visibility: 'full'
    },
    contactId: VALID_CONTACT_ID,
    features: {
      areaConstructed: 100,
      areaUsable: 90,
      bathroomNumber: 1,
      conservation: 'good',
      energyCertificateRating: 'E',
      energyCertificateEmissionsRating: 'F',
      conditionedAirType: 'cold',
      liftNumber: 0,
      officeBuilding: true,
      parkingSpacesNumber: 0,
      roomsSplitted: 'withWalls',
      windowsLocation: 'external'
    },
    descriptions: [
      {
        language: 'es',
        text: 'Esta propiedad no debería existir - test Property15.'
      }
    ]
  };
  
  return await makeRequest(`/api/properties/${fakePropertyId}`, 'PUT', updatePayload);
}

/**
 * Property16: Deactivate property - Deactivate any of the properties previously created
 */
async function testProperty16() {
  const propertyId = VALID_PROPERTY_IDS[4]; // Usar StorageRoom01
  return await makeRequest(`/api/properties/${propertyId}`, 'DELETE');
}

/**
 * Property17: Deactivate property Error not found - Deactivate a property using any property id not belonging to the office used for the tests
 */
async function testProperty17() {
  const fakePropertyId = 777777777;
  return await makeRequest(`/api/properties/${fakePropertyId}`, 'DELETE');
}

/**
 * Property18: Reactivate property - Reactivate any of the properties previously deactivated
 */
async function testProperty18() {
  const propertyId = VALID_PROPERTY_IDS[4]; // Mismo que Property16 (StorageRoom01)
  return await makeRequest(`/api/properties/${propertyId}/reactivate`, 'PUT');
}

/**
 * Property19: Reactivate property Error not found - Reactivate a property using any property id not belonging to the office used for the tests
 */
async function testProperty19() {
  const fakePropertyId = 666666666;
  return await makeRequest(`/api/properties/${fakePropertyId}/reactivate`, 'PUT');
}

/**
 * Función principal para ejecutar todos los tests
 */
async function runAllTests() {
  console.log('🚀 Iniciando tests CRUD Property10-Property19 (SHEET OFICIAL)...\n');
  console.log('📋 Usando PropertyIds válidos:', VALID_PROPERTY_IDS);
  console.log('📞 Usando ContactId válido:', VALID_CONTACT_ID);
  
  // Tests CRUD según sheet oficial EXACTO
  await runTest('Property10', 'Find property - Find any of the properties previously created', 200, testProperty10);
  await runTest('Property11', 'Find property Error not found - Find a property using any property id not belonging to the office used for the tests', 404, testProperty11);
  await runTest('Property12', 'Find all properties - Find all properties of the office. Make sure to send proper page and size values', 200, testProperty12);
  await runTest('Property13', 'Update property - Update any feature of any of the properties previously created', 200, testProperty13);
  await runTest('Property14', 'Update property Business errors - type - Update the type of any of the properties previously created (400 - error message describing that the type of the property cannot be changed)', 400, testProperty14);
  await runTest('Property15', 'Update property Error not found - Update a property using any property id not belonging to the office used for the tests', 404, testProperty15);
  await runTest('Property16', 'Deactivate property - Deactivate any of the properties previously created', 200, testProperty16);
  await runTest('Property17', 'Deactivate property Error not found - Deactivate a property using any property id not belonging to the office used for the tests', 404, testProperty17);
  await runTest('Property18', 'Reactivate property - Reactivate any of the properties previously deactivated', 200, testProperty18);
  await runTest('Property19', 'Reactivate property Error not found - Reactivate a property using any property id not belonging to the office used for the tests', 404, testProperty19);
  
  // Generar reporte
  await generateReport();
}

/**
 * Generar reporte de resultados
 */
async function generateReport() {
  const timestamp = new Date().toISOString();
  const passedTests = testResults.filter(r => r.passed).length;
  const failedTests = testResults.filter(r => !r.passed).length;
  const successRate = ((passedTests / testResults.length) * 100).toFixed(2);
  
  const report = {
    timestamp,
    summary: {
      totalTests: testResults.length,
      passedTests,
      failedTests,
      successRate: `${successRate}%`
    },
    validPropertyIds: VALID_PROPERTY_IDS,
    validContactId: VALID_CONTACT_ID,
    results: testResults
  };
  
  // Guardar JSON
  const jsonFileName = `idealista-properties-crud-official-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(jsonFileName, JSON.stringify(report, null, 2));
  
  // Generar Markdown
  const mdFileName = `IDEALISTA_PROPERTIES_CRUD_OFFICIAL_REPORT.md`;
  let mdContent = `# Reporte de Tests CRUD OFICIAL - Idealista API\n\n`;
  mdContent += `**Fecha:** ${timestamp}\n\n`;
  mdContent += `## Resumen\n\n`;
  mdContent += `- **Total de Tests:** ${testResults.length}\n`;
  mdContent += `- **Tests Exitosos:** ${passedTests}\n`;
  mdContent += `- **Tests Fallidos:** ${failedTests}\n`;
  mdContent += `- **Tasa de Éxito:** ${successRate}%\n\n`;
  mdContent += `## Tests según Sheet Oficial\n\n`;
  
  testResults.forEach(result => {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED';
    mdContent += `### ${result.id} - ${status}\n\n`;
    mdContent += `**Descripción:** ${result.description}\n\n`;
    mdContent += `**Esperado:** ${result.expected} | **Obtenido:** ${result.actual}\n\n`;
    if (result.notes) {
      mdContent += `**Notas:** ${result.notes}\n\n`;
    }
    mdContent += `**Respuesta de la API:**\n\`\`\`json\n${JSON.stringify(result.response, null, 2)}\n\`\`\`\n\n`;
    mdContent += `---\n\n`;
  });
  
  fs.writeFileSync(mdFileName, mdContent);
  
  console.log(`\n📊 REPORTE FINAL:`);
  console.log(`📋 Total de Tests: ${testResults.length}`);
  console.log(`✅ Tests Exitosos: ${passedTests}`);
  console.log(`❌ Tests Fallidos: ${failedTests}`);
  console.log(`📈 Tasa de Éxito: ${successRate}%`);
  console.log(`\n📄 Reportes guardados:`);
  console.log(`- JSON: ${jsonFileName}`);
  console.log(`- Markdown: ${mdFileName}`);
}

// Ejecutar tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testResults
};
