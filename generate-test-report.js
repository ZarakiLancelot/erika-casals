#!/usr/bin/env node

/**
 * Script para generar un JSON con todos los resultados de tests
 * para enviar a Idealista como evidencia
 */

const fs = require('fs');
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function generateTestReport() {
  console.log('📊 Generando reporte JSON para Idealista...\n');

  const report = {
    partner: "Partner Name", // Cambiar por el nombre real
    testDate: new Date().toISOString(),
    environment: "sandbox",
    baseUrl: BASE_URL,
    totalTests: 6,
    passedTests: 6,
    failedTests: 0,
    successRate: "100%",
    tests: []
  };

  try {
    // Test 01 - Crear contacto
    console.log('🧪 Ejecutando Contact01...');
    const contact01Response = await fetch(`${BASE_URL}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.test@example.com',
        primaryPhonePrefix: '34',
        primaryPhoneNumber: '123456789'
      })
    });
    const contact01Data = await contact01Response.json();
    const createdContactId = contact01Data.data?.contactId;

    report.tests.push({
      testId: "Contact01",
      testName: "Create valid contact",
      method: "POST",
      endpoint: "/api/contacts",
      expectedStatus: 201,
      actualStatus: contact01Response.status,
      passed: contact01Response.status === 201,
      request: {
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.test@example.com',
        primaryPhonePrefix: '34',
        primaryPhoneNumber: '123456789'
      },
      response: contact01Data
    });

    // Test 02 - Error email requerido
    console.log('🧪 Ejecutando Contact02...');
    const contact02Response = await fetch(`${BASE_URL}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'María',
        lastName: 'García',
        primaryPhonePrefix: '34',
        primaryPhoneNumber: '987654321'
      })
    });
    const contact02Data = await contact02Response.json();

    report.tests.push({
      testId: "Contact02",
      testName: "Email validation error - missing",
      method: "POST",
      endpoint: "/api/contacts",
      expectedStatus: 400,
      actualStatus: contact02Response.status,
      passed: contact02Response.status === 400,
      request: {
        name: 'María',
        lastName: 'García',
        primaryPhonePrefix: '34',
        primaryPhoneNumber: '987654321'
      },
      response: contact02Data
    });

    // Test 03 - Error formato email
    console.log('🧪 Ejecutando Contact03...');
    const contact03Response = await fetch(`${BASE_URL}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Pedro',
        lastName: 'López',
        email: 'email-invalido',
        primaryPhonePrefix: '34',
        primaryPhoneNumber: '111222333'
      })
    });
    const contact03Data = await contact03Response.json();

    report.tests.push({
      testId: "Contact03",
      testName: "Email validation error - invalid format",
      method: "POST",
      endpoint: "/api/contacts",
      expectedStatus: 400,
      actualStatus: contact03Response.status,
      passed: contact03Response.status === 400,
      request: {
        name: 'Pedro',
        lastName: 'López',
        email: 'email-invalido',
        primaryPhonePrefix: '34',
        primaryPhoneNumber: '111222333'
      },
      response: contact03Data
    });

    // Test 04 - Obtener por ID (solo si el contacto fue creado)
    if (createdContactId) {
      console.log('🧪 Ejecutando Contact04...');
      const contact04Response = await fetch(`${BASE_URL}/api/contacts/${createdContactId}`);
      const contact04Data = await contact04Response.json();

      report.tests.push({
        testId: "Contact04",
        testName: "Get contact by ID",
        method: "GET",
        endpoint: `/api/contacts/${createdContactId}`,
        expectedStatus: 200,
        actualStatus: contact04Response.status,
        passed: contact04Response.status === 200,
        request: null,
        response: contact04Data
      });

      // Test 05 - Actualizar contacto
      console.log('🧪 Ejecutando Contact05...');
      const contact05Response = await fetch(`${BASE_URL}/api/contacts/${createdContactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Juan Actualizado',
          lastName: 'Pérez Actualizado',
          email: 'juan.updated@example.com',
          primaryPhonePrefix: '34',
          primaryPhoneNumber: '123456789'
        })
      });
      const contact05Data = await contact05Response.json();

      report.tests.push({
        testId: "Contact05",
        testName: "Update existing contact",
        method: "PUT",
        endpoint: `/api/contacts/${createdContactId}`,
        expectedStatus: 200,
        actualStatus: contact05Response.status,
        passed: contact05Response.status === 200,
        request: {
          name: 'Juan Actualizado',
          lastName: 'Pérez Actualizado',
          email: 'juan.updated@example.com',
          primaryPhonePrefix: '34',
          primaryPhoneNumber: '123456789'
        },
        response: contact05Data
      });
    }

    // Test 06 - Obtener todos los contactos
    console.log('🧪 Ejecutando Contact06...');
    const contact06Response = await fetch(`${BASE_URL}/api/contacts?page=1&size=10`);
    const contact06Data = await contact06Response.json();

    report.tests.push({
      testId: "Contact06",
      testName: "Get all contacts with pagination",
      method: "GET",
      endpoint: "/api/contacts?page=1&size=10",
      expectedStatus: 200,
      actualStatus: contact06Response.status,
      passed: contact06Response.status === 200,
      request: null,
      response: contact06Data
    });

    // Actualizar contadores
    report.passedTests = report.tests.filter(t => t.passed).length;
    report.failedTests = report.tests.filter(t => !t.passed).length;
    report.successRate = `${Math.round((report.passedTests / report.totalTests) * 100)}%`;

    // Guardar reporte
    const fileName = `idealista-test-report-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(fileName, JSON.stringify(report, null, 2));

    console.log('\n✅ Reporte generado exitosamente!');
    console.log(`📄 Archivo: ${fileName}`);
    console.log(`📊 Tests pasados: ${report.passedTests}/${report.totalTests} (${report.successRate})`);
    console.log('\n📤 Este archivo JSON está listo para enviar a Idealista como evidencia.');

  } catch (error) {
    console.error('\n❌ Error generando reporte:', error.message);
  }
}

generateTestReport();
