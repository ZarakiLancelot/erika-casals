#!/usr/bin/env node

/**
 * Script automatizado COMPLETO para ejecutar TODOS los tests de la API de propiedades de Idealista
 * Basado en el sheet oficial de validación de Idealista
 *
 * Uso: node test-properties-idealista.js
 *
 * Asegurate de tener el servidor local corriendo en el puerto 3001:
 * vercel dev --listen 3001
 */

const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
const testResults = [];
let testContactId = null;

// Helper para hacer requests
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

// Función para registrar resultados
function testResult(id, name, expected, actual, data, notes = '') {
	const passed = actual === expected;
	const result = {
		id,
		name,
		expected,
		actual,
		passed,
		notes,
		timestamp: new Date().toISOString(),
		response: data
	};

	testResults.push(result);

	console.log(`\n🧪 ${id} - ${name}`);
	console.log(
		`Expected: ${expected} | Actual: ${actual} | ${
			passed ? '✅ PASS' : '❌ FAIL'
		}`
	);
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
		lastName: 'API Validation',
		email: 'test.validation@idealista.com',
		primaryPhonePrefix: '34',
		primaryPhoneNumber: '666777888'
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
function createValidProperty(contactId, overrides = {}) {
	return {
		// Campos obligatorios básicos
		operation: 'sale',
		type: 'flat',
		scope: 'idealista',
		addressVisibility: 'full',
		price: 250000,
		contactId,

		// Ubicación
		address: {
			location: 'Madrid',
			street: 'Calle de Prueba',
			number: '123',
			postalCode: '28001',
			district: 'Centro',
			neighborhood: 'Sol',
			latitude: 40.4168,
			longitude: -3.7038
		},

		// Contenido
		title: 'Piso de prueba - Validación Idealista API',
		description:
			'Propiedad de prueba creada automáticamente para validar la integración con Idealista Partners API. Esta descripción contiene suficiente detalle para pasar las validaciones requeridas por la plataforma.',

		// Características
		size: 100,
		rooms: 3,
		bathrooms: 2,
		floor: 2,
		exterior: true,
		furnished: false,
		parking: false,
		terrace: false,
		garden: false,
		swimmingPool: false,
		airConditioning: false,
		heating: true,
		elevator: true,

		// Aplicar overrides
		...overrides
	};
}

async function runAllTests() {
	console.log('🏠 SUITE COMPLETO DE TESTS - IDEALISTA PROPERTIES API');
	console.log('='.repeat(70));

	// Crear contacto
	testContactId = await createTestContact();
	if (!testContactId) {
		console.error('❌ Abortando: No se pudo crear contacto');
		return;
	}

	try {
		// SECCIÓN 1: TESTS BÁSICOS DE CREACIÓN
		console.log('\n🔧 SECCIÓN 1: CREACIÓN DE PROPIEDADES');

		// Property01 - Propiedad válida
		const prop01 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId)
		);
		testResult(
			'Property01',
			'Crear propiedad válida',
			201,
			prop01.status,
			prop01.data
		);

		// Property03 - Operación sale
		const prop03 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, { operation: 'sale' })
		);
		testResult(
			'Property03',
			'Propiedad para venta',
			201,
			prop03.status,
			prop03.data
		);

		// Property04 - Operación rent
		const prop04 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, { operation: 'rent', price: 1200 })
		);
		testResult(
			'Property04',
			'Propiedad para alquiler',
			201,
			prop04.status,
			prop04.data
		);

		// Property05 - Scope idealista
		const prop05 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, { scope: 'idealista' })
		);
		testResult(
			'Property05',
			'Scope idealista',
			201,
			prop05.status,
			prop05.data
		);

		// Property06 - Scope microsite
		const prop06 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, { scope: 'microsite' })
		);
		testResult(
			'Property06',
			'Scope microsite',
			201,
			prop06.status,
			prop06.data
		);

		// Property07 - Address full
		const prop07 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, { addressVisibility: 'full' })
		);
		testResult(
			'Property07',
			'Dirección completa',
			201,
			prop07.status,
			prop07.data
		);

		// Property08 - Address street
		const prop08 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, { addressVisibility: 'street' })
		);
		testResult(
			'Property08',
			'Dirección calle',
			201,
			prop08.status,
			prop08.data
		);

		// Property09 - Address hidden
		const prop09 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, { addressVisibility: 'hidden' })
		);
		testResult(
			'Property09',
			'Dirección oculta',
			201,
			prop09.status,
			prop09.data
		);

		// SECCIÓN 2: TESTS DE PISOS (FLATS)
		console.log('\n🏠 SECCIÓN 2: TESTS DE PISOS');

		// Flat01 - Piso válido completo
		const flat01 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'flat',
				size: 120,
				rooms: 4,
				bathrooms: 2,
				floor: 3,
				exterior: true
			})
		);
		testResult(
			'Flat01',
			'Piso válido completo',
			201,
			flat01.status,
			flat01.data
		);

		// Flat02 - Error área pequeña
		const flat02 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, { size: 5 })
		);
		testResult(
			'Flat02',
			'Error área < 10m²',
			400,
			flat02.status,
			flat02.data,
			'Debería fallar por área muy pequeña'
		);

		// Flat03 - Error área vs habitaciones
		const flat03 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, { size: 15, rooms: 5 })
		);
		testResult(
			'Flat03',
			'Error área vs habitaciones',
			400,
			flat03.status,
			flat03.data,
			'Área muy pequeña para 5 habitaciones'
		);

		// Flat04 - Error conservación y baños
		const flat04 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				conservation: 'good',
				bathrooms: 0
			})
		);
		testResult(
			'Flat04',
			'Error conservación/baños',
			400,
			flat04.status,
			flat04.data,
			'Conservación good no compatible con 0 baños'
		);

		// Flat05 - Error parking price
		const flat05 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				parking: false,
				parkingIncludedInPrice: true
			})
		);
		testResult(
			'Flat05',
			'Error parking sin precio',
			400,
			flat05.status,
			flat05.data,
			'Parking included pero parking=false'
		);

		// SECCIÓN 3: TESTS DE OTROS TIPOS DE PROPIEDAD
		console.log('\n🏡 SECCIÓN 3: OTROS TIPOS DE PROPIEDAD');

		// House01 - Casa válida
		const house01 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'house',
				size: 200,
				rooms: 5,
				bathrooms: 3,
				garden: true,
				terrace: true,
				parking: true
			})
		);
		testResult('House01', 'Casa válida', 201, house01.status, house01.data);

		// CountryHouse01 - Casa de campo
		const countryHouse01 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'countryhouse',
				size: 300,
				rooms: 6,
				bathrooms: 4,
				garden: true
			})
		);
		testResult(
			'CountryHouse01',
			'Casa de campo',
			201,
			countryHouse01.status,
			countryHouse01.data
		);

		// Garage01 - Garaje válido
		const garage01 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'garage',
				size: 25,
				floor: -1,
				rooms: 0,
				bathrooms: 0
			})
		);
		testResult(
			'Garage01',
			'Garaje válido',
			201,
			garage01.status,
			garage01.data
		);

		// Office01 - Oficina válida
		const office01 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'office',
				operation: 'rent',
				price: 1800,
				size: 80,
				bathrooms: 1,
				floor: 5,
				elevator: true
			})
		);
		testResult(
			'Office01',
			'Oficina válida',
			201,
			office01.status,
			office01.data
		);

		// Commercial01 - Local comercial
		const commercial01 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'premises',
				operation: 'rent',
				price: 2500,
				size: 150,
				bathrooms: 1,
				floor: 0
			})
		);
		testResult(
			'Commercial01',
			'Local comercial',
			201,
			commercial01.status,
			commercial01.data
		);

		// Commercial02 - Local con transferencia válida
		const commercial02 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'premises',
				operation: 'transfer',
				price: 50000,
				size: 120,
				isTransfer: true,
				commercialMainActivity: 'retail'
			})
		);
		testResult(
			'Commercial02',
			'Local transferencia válida',
			201,
			commercial02.status,
			commercial02.data
		);

		// Commercial03 - Error transferencia sin actividad
		const commercial03 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'premises',
				operation: 'transfer',
				isTransfer: true
				// Falta commercialMainActivity
			})
		);
		testResult(
			'Commercial03',
			'Error transferencia sin actividad',
			400,
			commercial03.status,
			commercial03.data,
			'Transferencia requiere actividad comercial'
		);

		// SECCIÓN 4: TESTS DE TERRENOS
		console.log('\n🌱 SECCIÓN 4: TESTS DE TERRENOS');

		// Land01 - Terreno urbano
		const land01 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'land',
				size: 500,
				rooms: 0,
				bathrooms: 0,
				featuresType: 'urban'
			})
		);
		testResult('Land01', 'Terreno urbano', 201, land01.status, land01.data);

		// Land02 - Terreno edificable
		const land02 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'land',
				size: 1000,
				rooms: 0,
				bathrooms: 0,
				featuresType: 'countrybuildable'
			})
		);
		testResult('Land02', 'Terreno edificable', 201, land02.status, land02.data);

		// Land03 - Terreno no edificable
		const land03 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'land',
				size: 2000,
				rooms: 0,
				bathrooms: 0,
				featuresType: 'countrynonbuildable'
			})
		);
		testResult(
			'Land03',
			'Terreno no edificable',
			201,
			land03.status,
			land03.data
		);

		// Land04 - Error tipo incompatible
		const land04 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'land',
				featuresType: 'countrynonbuildable',
				electricity: true
			})
		);
		testResult(
			'Land04',
			'Error tipo incompatible',
			400,
			land04.status,
			land04.data,
			'Terreno no edificable no puede tener electricidad'
		);

		// Land05 - Error acceso sin permisos
		const land05 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'land',
				roadAccess: false,
				accessType: 'public'
			})
		);
		testResult(
			'Land05',
			'Error acceso sin permisos',
			400,
			land05.status,
			land05.data,
			'accessType solo permitido con roadAccess=true'
		);

		// SECCIÓN 5: OTROS TESTS
		console.log('\n🏢 SECCIÓN 5: OTROS TESTS');

		// StorageRoom01 - Trastero
		const storage01 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'storage',
				size: 15,
				rooms: 0,
				bathrooms: 0,
				floor: -1
			})
		);
		testResult(
			'StorageRoom01',
			'Trastero válido',
			201,
			storage01.status,
			storage01.data
		);

		// Building01 - Edificio
		const building01 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'building',
				size: 1000,
				rooms: 0,
				bathrooms: 0
			})
		);
		testResult(
			'Building01',
			'Edificio válido',
			201,
			building01.status,
			building01.data
		);

		// Building02 - Error sin clasificación
		const building02 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'building',
				size: 800
				// Falta classification
			})
		);
		testResult(
			'Building02',
			'Error edificio sin clasificación',
			400,
			building02.status,
			building02.data,
			'Edificio requiere al menos una clasificación'
		);

		// Room01 - Habitación alquiler
		const room01 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'room',
				operation: 'rent',
				price: 400,
				size: 20,
				rooms: 1,
				bathrooms: 0
			})
		);
		testResult(
			'Room01',
			'Habitación alquiler',
			201,
			room01.status,
			room01.data
		);

		// Room02 - Error habitación venta
		const room02 = await makeRequest(
			'POST',
			'/api/properties',
			createValidProperty(testContactId, {
				type: 'room',
				operation: 'sale', // Error: habitaciones solo alquiler
				price: 50000
			})
		);
		testResult(
			'Room02',
			'Error habitación venta',
			400,
			room02.status,
			room02.data,
			'Habitaciones solo pueden ser para alquiler'
		);

		// SECCIÓN 6: TESTS DE BÚSQUEDA
		console.log('\n🔍 SECCIÓN 6: TESTS DE BÚSQUEDA');

		// Property10 - Buscar propiedades
		const search10 = await makeRequest('GET', '/api/properties?page=1&size=10');
		testResult(
			'Property10',
			'Búsqueda con paginación',
			200,
			search10.status,
			search10.data
		);

		// Property11 - Propiedad inexistente
		const search11 = await makeRequest('GET', '/api/properties/99999999');
		testResult(
			'Property11',
			'Propiedad inexistente',
			404,
			search11.status,
			search11.data
		);

		// Property12 - Búsqueda completa
		const search12 = await makeRequest(
			'GET',
			'/api/properties?page=1&size=100'
		);
		testResult(
			'Property12',
			'Búsqueda completa',
			200,
			search12.status,
			search12.data
		);

		// SECCIÓN 7: TESTS DE ACTUALIZACIÓN Y GESTIÓN
		console.log('\n✏️ SECCIÓN 7: ACTUALIZACIÓN Y GESTIÓN');

		// Obtener una propiedad creada para actualizar
		let propertyToUpdate = null;
		if (prop01.status === 201 && prop01.data.success) {
			propertyToUpdate = prop01.data.data.propertyId;
		}

		if (propertyToUpdate) {
			// Property13 - Actualizar propiedad
			const update13 = await makeRequest(
				'PUT',
				`/api/properties/${propertyToUpdate}`,
				{
					title: 'Propiedad actualizada - Test automatizado',
					price: 275000
				}
			);
			testResult(
				'Property13',
				'Actualización válida',
				200,
				update13.status,
				update13.data
			);

			// Property14 - Error cambiar tipo
			const update14 = await makeRequest(
				'PUT',
				`/api/properties/${propertyToUpdate}`,
				{
					type: 'house' // No se puede cambiar el tipo
				}
			);
			testResult(
				'Property14',
				'Error cambiar tipo',
				400,
				update14.status,
				update14.data,
				'No se puede cambiar el tipo de propiedad'
			);

			// Property16 - Desactivar propiedad
			const deactivate16 = await makeRequest(
				'DELETE',
				`/api/properties/${propertyToUpdate}`
			);
			testResult(
				'Property16',
				'Desactivar propiedad',
				200,
				deactivate16.status,
				deactivate16.data
			);

			// Property18 - Reactivar propiedad
			const reactivate18 = await makeRequest(
				'PUT',
				`/api/properties/${propertyToUpdate}/reactivate`
			);
			testResult(
				'Property18',
				'Reactivar propiedad',
				200,
				reactivate18.status,
				reactivate18.data
			);
		}

		// Property15 - Actualizar inexistente
		const update15 = await makeRequest('PUT', '/api/properties/99999999', {
			title: 'Test'
		});
		testResult(
			'Property15',
			'Actualizar inexistente',
			404,
			update15.status,
			update15.data
		);

		// Property17 - Desactivar inexistente
		const deactivate17 = await makeRequest(
			'DELETE',
			'/api/properties/99999999'
		);
		testResult(
			'Property17',
			'Desactivar inexistente',
			404,
			deactivate17.status,
			deactivate17.data
		);

		// Property19 - Reactivar inexistente
		const reactivate19 = await makeRequest(
			'PUT',
			'/api/properties/99999999/reactivate'
		);
		testResult(
			'Property19',
			'Reactivar inexistente',
			404,
			reactivate19.status,
			reactivate19.data
		);

		// ESTADÍSTICAS FINALES
		console.log('\n📊 GENERANDO REPORTE...');

		const totalTests = testResults.length;
		const passedTests = testResults.filter(r => r.passed).length;
		const failedTests = totalTests - passedTests;
		const successRate = ((passedTests / totalTests) * 100).toFixed(2);

		console.log('\n🎉 SUITE DE TESTS COMPLETADO!');
		console.log('='.repeat(70));
		console.log(`📈 ESTADÍSTICAS:`);
		console.log(`   Total: ${totalTests} tests`);
		console.log(`   Exitosos: ${passedTests} ✅`);
		console.log(`   Fallidos: ${failedTests} ❌`);
		console.log(`   Tasa de éxito: ${successRate}%`);

		// Guardar reportes
		const report = {
			timestamp: new Date().toISOString(),
			summary: {
				totalTests,
				passedTests,
				failedTests,
				successRate: `${successRate}%`
			},
			testContactId,
			results: testResults
		};

		const reportFile = `idealista-properties-complete-${
			new Date().toISOString().split('T')[0]
		}.json`;
		fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
		console.log(`\n💾 Reporte JSON: ${reportFile}`);

		// Generar reporte markdown
		let markdown = `# 🏠 Reporte Completo - Tests Propiedades Idealista

## 📊 Resumen
- **Fecha:** ${new Date().toLocaleDateString('es-ES')}
- **Total tests:** ${totalTests}
- **Exitosos:** ${passedTests} ✅
- **Fallidos:** ${failedTests} ❌
- **Tasa éxito:** ${successRate}%

## 📋 Resultados Detallados

| Test ID | Nombre | Esperado | Actual | Estado | Notas |
|---------|--------|----------|---------|---------|-------|
`;

		testResults.forEach(test => {
			const status = test.passed ? '✅ PASS' : '❌ FAIL';
			markdown += `| ${test.id} | ${test.name} | ${test.expected} | ${
				test.actual
			} | ${status} | ${test.notes || ''} |\n`;
		});

		if (failedTests > 0) {
			markdown += `\n## ❌ Tests Fallidos\n\n`;
			testResults
				.filter(t => !t.passed)
				.forEach(test => {
					markdown += `### ${test.id} - ${test.name}\n`;
					markdown += `- **Esperado:** ${test.expected}\n`;
					markdown += `- **Obtenido:** ${test.actual}\n`;
					markdown += `- **Notas:** ${test.notes}\n\n`;
				});
		}

		markdown += `\n---\n*Reporte generado automáticamente - ${new Date().toISOString()}*`;

		const markdownFile = 'IDEALISTA_PROPERTIES_COMPLETE_REPORT.md';
		fs.writeFileSync(markdownFile, markdown);
		console.log(`📋 Reporte Markdown: ${markdownFile}`);

		console.log('\n📧 PRÓXIMOS PASOS:');
		console.log('1. Revisa los tests fallidos en el reporte');
		console.log('2. Corrige la implementación según los errores');
		console.log('3. Vuelve a ejecutar hasta obtener 100% de éxito');
		console.log('4. Envía los reportes a Idealista como evidencia');
	} catch (error) {
		console.error('\n❌ Error ejecutando tests:', error.message);
	}
}

// Ejecutar todos los tests
runAllTests();
