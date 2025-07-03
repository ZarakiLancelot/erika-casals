#!/usr/bin/env node

/**
 * Script de Test para Operaciones CRUD - Idealista API
 * Tests Property10-Property19 según el sheet oficial
 * 
 * Uso: node test-properties-crud-property10-19.js
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
  108635805, // Land01
  108635803  // StorageRoom01
];

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

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();
  
  return {
    status: response.status,
    data
  };
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
 * Property10: Buscar propiedades - debería devolver lista
 */
async function testProperty10() {
  return await makeRequest('/api/properties');
}

/**
 * Property11: Buscar propiedad específica por ID
 */
async function testProperty11() {
  const propertyId = VALID_PROPERTY_IDS[0]; // Usar Office01
  return await makeRequest(`/api/properties/${propertyId}`);
}

/**
 * Property12: Actualizar propiedad - cambiar precio
 */
async function testProperty12() {
  const propertyId = VALID_PROPERTY_IDS[1]; // Usar Commercial01
  
  const updatePayload = {
    operation: {
      type: 'sale',
      price: 750000 // Cambiar precio de 300000 a 750000
    },
    features: {
      areaConstructed: 200,
      areaUsable: 190,
      bathroomNumber: 1,
      conservation: 'good',
      energyCertificateRating: 'E',
      energyCertificateEmissionsRating: 'F',
      location: 'on_the_street',
      rooms: 3,
      type: 'retail'
    }
  };
  
  return await makeRequest(`/api/properties/${propertyId}`, 'PUT', updatePayload);
}

/**
 * Property13: Actualizar propiedad - cambiar descripción
 */
async function testProperty13() {
  const propertyId = VALID_PROPERTY_IDS[2]; // Usar Commercial02
  
  const updatePayload = {
    descriptions: [
      {
        language: 'es',
        text: 'Descripción actualizada para test Property13 - Propiedad comercial con transferencia válida.'
      }
    ],
    operation: {
      type: 'sale',
      price: 295000
    },
    features: {
      areaConstructed: 200,
      areaUsable: 190,
      bathroomNumber: 1,
      conservation: 'good',
      energyCertificateRating: 'E',
      energyCertificateEmissionsRating: 'F',
      location: 'on_the_street',
      rooms: 3,
      type: 'retail',
      isATransfer: true,
      commercialMainActivity: 'restaurant'
    }
  };
  
  return await makeRequest(`/api/properties/${propertyId}`, 'PUT', updatePayload);
}

/**
 * Property14: Desactivar propiedad
 */
async function testProperty14() {
  const propertyId = VALID_PROPERTY_IDS[4]; // Usar StorageRoom01
  return await makeRequest(`/api/properties/${propertyId}`, 'DELETE');
}

/**
 * Property15: Reactivar propiedad
 */
async function testProperty15() {
  const propertyId = VALID_PROPERTY_IDS[4]; // Mismo que Property14
  return await makeRequest(`/api/properties/${propertyId}/reactivate`, 'PUT');
}

/**
 * Property16: Eliminar propiedad (segunda desactivación)
 */
async function testProperty16() {
  const propertyId = VALID_PROPERTY_IDS[3]; // Usar Land05 (que debería existir)
  return await makeRequest(`/api/properties/${propertyId}`, 'DELETE');
}

/**
 * Property17: Buscar propiedad desactivada
 */
async function testProperty17() {
  const propertyId = VALID_PROPERTY_IDS[3]; // Mismo que Property16
  return await makeRequest(`/api/properties/${propertyId}`);
}

/**
 * Property18: Actualizar propiedad inexistente (debe fallar)
 */
async function testProperty18() {
  const fakePropertyId = 999999999;
  
  const updatePayload = {
    operation: {
      type: 'sale',
      price: 100000
    },
    features: {
      areaConstructed: 100,
      conservation: 'good'
    }
  };
  
  return await makeRequest(`/api/properties/${fakePropertyId}`, 'PUT', updatePayload);
}

/**
 * Property19: Eliminar propiedad inexistente (debe fallar)
 */
async function testProperty19() {
  const fakePropertyId = 888888888;
  return await makeRequest(`/api/properties/${fakePropertyId}`, 'DELETE');
}

/**
 * Función principal para ejecutar todos los tests
 */
async function runAllTests() {
  console.log('🚀 Iniciando tests CRUD Property10-Property19...\n');
  console.log('📋 Usando PropertyIds válidos:', VALID_PROPERTY_IDS);
  
  // Tests CRUD
  await runTest('Property10', 'Listar todas las propiedades', 200, testProperty10);
  await runTest('Property11', 'Buscar propiedad específica por ID', 200, testProperty11);
  await runTest('Property12', 'Actualizar propiedad - cambiar precio', 200, testProperty12);
  await runTest('Property13', 'Actualizar propiedad - cambiar descripción', 200, testProperty13);
  await runTest('Property14', 'Desactivar propiedad', 200, testProperty14);
  await runTest('Property15', 'Reactivar propiedad', 200, testProperty15);
  await runTest('Property16', 'Eliminar propiedad', 200, testProperty16);
  await runTest('Property17', 'Buscar propiedad eliminada (debe fallar)', 404, testProperty17);
  await runTest('Property18', 'Actualizar propiedad inexistente (debe fallar)', 404, testProperty18);
  await runTest('Property19', 'Eliminar propiedad inexistente (debe fallar)', 404, testProperty19);
  
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
    results: testResults
  };
  
  // Guardar JSON
  const jsonFileName = `idealista-properties-crud-property10-19-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(jsonFileName, JSON.stringify(report, null, 2));
  
  // Generar Markdown
  const mdFileName = `IDEALISTA_PROPERTIES_CRUD_PROPERTY10-19_REPORT.md`;
  let mdContent = `# Reporte de Tests CRUD - Idealista API\n\n`;
  mdContent += `**Fecha:** ${timestamp}\n\n`;
  mdContent += `## Resumen\n\n`;
  mdContent += `- **Total de Tests:** ${testResults.length}\n`;
  mdContent += `- **Tests Exitosos:** ${passedTests}\n`;
  mdContent += `- **Tests Fallidos:** ${failedTests}\n`;
  mdContent += `- **Tasa de Éxito:** ${successRate}%\n\n`;
  mdContent += `## PropertyIds Utilizados\n\n`;
  VALID_PROPERTY_IDS.forEach(id => {
    mdContent += `- ${id}\n`;
  });
  mdContent += `\n## Resultados Detallados\n\n`;
  
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
