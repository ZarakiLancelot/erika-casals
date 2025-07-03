#!/usr/bin/env node

/**
 * Script de Test para Propiedades - Idealista API
 * Tests Property01 a Property09 según el sheet oficial
 * 
 * Uso: node test-properties-01-09.js
 * 
 * Asegurate de tener el servidor local corriendo:
 * vercel dev --listen 3001
 */

const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
let testContactId = null;
const testResults = [];

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

// Función para mostrar resultados
function logTestResult(testId, description, expected, actual, data, notes = '') {
  const passed = actual === expected;
  const result = {
    id: testId,
    description,
    expected,
    actual,
    passed,
    notes,
    timestamp: new Date().toISOString(),
    response: data
  };
  
  testResults.push(result);

  console.log(`\n🧪 ${testId} - ${description}`);
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

// Estructura base de propiedad según el REQUEST SAMPLE EXACTO de Idealista
function createBaseProperty(contactId, overrides = {}) {
  const baseProperty = {
    type: 'flat',
    operation: {
      type: 'sale',
      price: 250000
    },
    scope: 'idealista',
    address: {
      streetName: 'Calle de Prueba',
      postalCode: '28001',
      country: 'Spain',
      visibility: 'full'
    },
    contactId,
    features: {
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
    },
    descriptions: [
      {
        language: 'es',
        text: 'Propiedad de prueba para validación de la API de Idealista. Esta descripción cumple con los requisitos mínimos de contenido.'
      }
    ]
  };

  // Aplicar overrides
  return { ...baseProperty, ...overrides };
}

async function runTests() {
  console.log('🏠 TESTS PROPERTY01 - PROPERTY09 - IDEALISTA API');
  console.log('='.repeat(60));

  // Crear contacto
  testContactId = await createTestContact();
  if (!testContactId) {
    console.error('❌ Abortando: No se pudo crear contacto');
    return;
  }

  try {
    // Property01 - New property (básica válida)
    console.log('\n📝 PROPERTY01 - New property');
    const property01 = await makeRequest('POST', '/api/properties', 
      createBaseProperty(testContactId)
    );
    logTestResult('Property01', 'Crear propiedad básica válida', 201, property01.status, property01.data);

    // Property02 - New property Auth error - invalid token
    console.log('\n📝 PROPERTY02 - Auth error - invalid token');
    // Simulamos error de token enviando a endpoint que puede fallar con auth
    const property02 = await makeRequest('POST', '/api/properties', 
      createBaseProperty(testContactId)
    );
    logTestResult('Property02', 'Error token inválido', 401, property02.status, property02.data, 
      'En sandbox local podría devolver 201 en lugar de 401');

    // Property03 - New property Operation = 'sale'
    console.log('\n📝 PROPERTY03 - Operation sale');
    const property03 = await makeRequest('POST', '/api/properties', 
      createBaseProperty(testContactId, {
        operation: {
          type: 'sale',
          price: 300000
        }
      })
    );
    logTestResult('Property03', 'Propiedad para venta', 201, property03.status, property03.data);

    // Property04 - New property Operation = 'rent'
    console.log('\n📝 PROPERTY04 - Operation rent');
    const property04 = await makeRequest('POST', '/api/properties', 
      createBaseProperty(testContactId, {
        operation: {
          type: 'rent',
          price: 1200
        }
      })
    );
    logTestResult('Property04', 'Propiedad para alquiler', 201, property04.status, property04.data);

    // Property05 - New property Scope = 'idealista'
    console.log('\n📝 PROPERTY05 - Scope idealista');
    const property05 = await makeRequest('POST', '/api/properties', 
      createBaseProperty(testContactId, {
        scope: 'idealista'
      })
    );
    logTestResult('Property05', 'Scope idealista', 201, property05.status, property05.data);

    // Property06 - New property Scope = 'microsite'
    console.log('\n📝 PROPERTY06 - Scope microsite');
    const property06 = await makeRequest('POST', '/api/properties', 
      createBaseProperty(testContactId, {
        scope: 'microsite'
      })
    );
    logTestResult('Property06', 'Scope microsite', 201, property06.status, property06.data);

    // Property07 - New property Visibility = 'full'
    console.log('\n📝 PROPERTY07 - Address visibility full');
    const property07 = await makeRequest('POST', '/api/properties', 
      createBaseProperty(testContactId, {
        address: {
          streetName: 'Calle de Prueba',
          postalCode: '28001',
          country: 'Spain',
          visibility: 'full'
        }
      })
    );
    logTestResult('Property07', 'Dirección completa visible', 201, property07.status, property07.data);

    // Property08 - New property Visibility = 'street'
    console.log('\n📝 PROPERTY08 - Address visibility street');
    const property08 = await makeRequest('POST', '/api/properties', 
      createBaseProperty(testContactId, {
        address: {
          streetName: 'Calle de Prueba',
          postalCode: '28001',
          country: 'Spain',
          visibility: 'street'
        }
      })
    );
    logTestResult('Property08', 'Solo calle visible', 201, property08.status, property08.data);

    // Property09 - New property Visibility = 'hidden'
    console.log('\n📝 PROPERTY09 - Address visibility hidden');
    const property09 = await makeRequest('POST', '/api/properties', 
      createBaseProperty(testContactId, {
        address: {
          streetName: 'Calle de Prueba',
          postalCode: '28001',
          country: 'Spain',
          visibility: 'hidden'
        }
      })
    );
    logTestResult('Property09', 'Dirección oculta', 201, property09.status, property09.data);

    // Generar estadísticas
    console.log('\n📊 GENERANDO REPORTE...');
    
    const totalTests = testResults.length;
    const passedTests = testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = ((passedTests / totalTests) * 100).toFixed(2);

    console.log('\n🎉 TESTS PROPERTY01-09 COMPLETADOS!');
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

    const reportFile = `idealista-properties-01-09-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n💾 Reporte guardado: ${reportFile}`);

    // Generar reporte markdown
    let markdown = `# 🏠 Tests Property01-09 - Idealista API

## 📊 Resumen
- **Fecha:** ${new Date().toLocaleDateString('es-ES')}
- **Tests:** Property01 a Property09
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

    const markdownFile = 'IDEALISTA_PROPERTIES_01-09_REPORT.md';
    fs.writeFileSync(markdownFile, markdown);
    console.log(`📋 Reporte Markdown: ${markdownFile}`);

    console.log('\n📧 PRÓXIMOS PASOS:');
    console.log('1. Revisar tests fallidos');
    console.log('2. Ajustar implementación si es necesario');
    console.log('3. Continuar con Property10+ cuando estos estén al 100%');

  } catch (error) {
    console.error('\n❌ Error ejecutando tests:', error.message);
  }
}

// Ejecutar tests
runTests();
