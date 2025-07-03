#!/usr/bin/env node

/**
 * Script automatizado COMPLETO para ejecutar TODOS los tests de la API de propiedades de Idealista
 * Basado en el sheet oficial de validación de Idealista
 *
 * Uso: node test-properties-complete.js
 *
 * Asegurate de tener el servidor local corriendo en el puerto 3001:
 * vercel dev --listen 3001
 */

const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
const createdPropertyIds = {}; // Para guardar IDs de propiedades creadas
const testResults = []; // Para almacenar todos los resultados

// Función helper para hacer requests HTTP
async function makeRequest(method, url, body = null) {
	const options = {
		method,
		headers: {
			'Content-Type': 'application/json'
		}
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
			console.log(
				`⚠️ Non-JSON response (${contentType}):`,
				text.substring(0, 200)
			);
			data = { error: 'Non-JSON response', content: text.substring(0, 500) };
		}

		return {
			status: response.status,
			data,
			headers: response.headers
		};
	} catch (error) {
		console.error(`❌ Request failed: ${error.message}`);
		return {
			status: 0,
			data: { error: error.message },
			headers: null
		};
	}
}

// Función para mostrar y almacenar resultados de test
function showTestResult(
	testId,
	testName,
	expectedStatus,
	actualStatus,
	data,
	notes = ''
) {
	const passed = actualStatus === expectedStatus;
	const result = {
		id: testId,
		name: testName,
		expected: expectedStatus,
		actual: actualStatus,
		passed,
		notes,
		timestamp: new Date().toISOString(),
		response: data
	};

	testResults.push(result);

	console.log(`\n🧪 ${testId} - ${testName}`);
	console.log(`Expected: ${expectedStatus} | Actual: ${actualStatus}`);
	console.log(`Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
	if (notes) console.log(`Notes: ${notes}`);
	if (!passed || data.error) {
		console.log(`Response:`, JSON.stringify(data, null, 2));
	}
	console.log('-'.repeat(80));

	return result;
}

// Datos base para contactos - Schema correcto
const BASE_CONTACT = {
	name: 'Test Contact',
	lastName: 'API Test',
	email: 'test.contact@example.com',
	primaryPhonePrefix: '34',
	primaryPhoneNumber: '123456789'
};

// Función para crear un contacto válido para usar en propiedades
async function createTestContact() {
	console.log('\n📞 Creando contacto de prueba...');
	const contact = await makeRequest('POST', '/api/contacts', BASE_CONTACT);

	if (contact.status === 201 && contact.data.success) {
		const contactId = contact.data.data.contactId;
		console.log(`✅ Contacto creado con ID: ${contactId}`);
		return contactId;
	} else {
		console.log('❌ Error creando contacto:', contact.data);
		return null;
	}
}

// Propiedades base para tests - Esquema corregido según Idealista API
const createBaseProperty = contactId => ({
	// Campos principales obligatorios
	operation: 'sale', // 'sale' | 'rent'
	propertyTypeId: 'flat', // Cambiado de propertyType a propertyTypeId
	scope: 'idealista', // 'idealista' | 'microsite'
	addressVisibility: 'full', // 'full' | 'street' | 'hidden'

	// Precio
	price: 250000,

	// Ubicación - Estructura según documentación Idealista
	address: {
		location: 'Madrid',
		street: 'Calle Prueba',
		number: '123',
		postalCode: '28001',
		district: 'Centro',
		neighborhood: 'Sol',
		latitude: 40.4168,
		longitude: -3.7038
	},

	// Contacto - usando ID del contacto creado
	contactId,

	// Contenido obligatorio
	title: 'Propiedad de prueba automatizada',
	description:
		'Esta es una propiedad de prueba creada automáticamente para validar la integración con Idealista API. Contiene todas las características necesarias para pasar las validaciones de negocio según el sheet oficial.',

	// Características - estructura plana según API
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

	// Clasificación energética (opcional)
	energyCertification: {
		consumption: 'D',
		emissions: 'E'
	}
});

async function runCompletePropertyTests() {
	console.log(
		'🏠 Iniciando SUITE COMPLETO de tests de API de Propiedades - Idealista\n'
	);
	console.log(`Base URL: ${BASE_URL}`);
	console.log('='.repeat(80));

	// Crear contacto para usar en tests
	const testContactId = await createTestContact();
	if (!testContactId) {
		console.error('❌ No se pudo crear contacto de prueba. Abortando tests.');
		return;
	}

	try {
		console.log('\n🔧 SECCIÓN 1: TESTS DE AUTENTICACIÓN Y AUTORIZACIÓN');

		// Property02 - Error token inválido
		const property02 = await makeRequest(
			'POST',
			'/api/properties',
			createBaseProperty(testContactId)
		);
		showTestResult(
			'Property02',
			'Error token inválido',
			401,
			property02.status,
			property02.data,
			'Test token inválido - esperamos 401 pero API local puede devolver 201'
		);

		console.log('\n🏢 SECCIÓN 2: TESTS DE CREACIÓN DE PROPIEDADES BÁSICAS');

		// Property01 - Crear propiedad válida
		const property01Data = createBaseProperty(testContactId);
		const property01 = await makeRequest(
			'POST',
			'/api/properties',
			property01Data
		);
		const result01 = showTestResult(
			'Property01',
			201,
			property01.status,
			property01.data,
			'Crear propiedad válida básica'
		);

		if (
			result01.passed &&
			property01.data.success &&
			property01.data.data?.propertyId
		) {
			createdPropertyIds.property01 = property01.data.data.propertyId;
			console.log(
				`💾 Propiedad Property01 guardada con ID: ${createdPropertyIds.property01}`
			);
		}

		// Property03 - Propiedad para venta
		const property03Data = {
			...createBaseProperty(testContactId),
			operation: 'sale'
		};
		const property03 = await makeRequest(
			'POST',
			'/api/properties',
			property03Data
		);
		const result03 = showTestResult(
			'Property03',
			201,
			property03.status,
			property03.data,
			'Propiedad para venta'
		);

		if (
			result03.passed &&
			property03.data.success &&
			property03.data.data?.propertyId
		) {
			createdPropertyIds.property03 = property03.data.data.propertyId;
		}

		// Property04 - Propiedad para alquiler
		const property04Data = {
			...createBaseProperty(testContactId),
			operation: 'rent',
			price: 1500
		};
		const property04 = await makeRequest(
			'POST',
			'/api/properties',
			property04Data
		);
		const result04 = showTestResult(
			'Property04',
			201,
			property04.status,
			property04.data,
			'Propiedad para alquiler'
		);

		if (
			result04.passed &&
			property04.data.success &&
			property04.data.data?.propertyId
		) {
			createdPropertyIds.property04 = property04.data.data.propertyId;
		}

		console.log('\n🏠 SECCIÓN 3: TESTS ESPECÍFICOS DE PISOS (FLATS)');

		// Flat01 - Piso válido
		const flat01Data = {
			...createBaseProperty(testContactId),
			propertyTypeId: 'flat',
			size: 120,
			rooms: 3,
			bathrooms: 2,
			floor: 2,
			exterior: true
		};
		const flat01 = await makeRequest('POST', '/api/properties', flat01Data);
		const resultFlat01 = showTestResult(
			'Flat01',
			201,
			flat01.status,
			flat01.data,
			'Piso válido con características completas'
		);

		if (
			resultFlat01.passed &&
			flat01.data.success &&
			flat01.data.data?.propertyId
		) {
			createdPropertyIds.flat01 = flat01.data.data.propertyId;
		}

		// Flat02 - Error validación área (menos de 10m²)
		const flat02Data = {
			...createBaseProperty(testContactId),
			propertyTypeId: 'flat',
			size: 5
		};
		const flat02 = await makeRequest('POST', '/api/properties', flat02Data);
		showTestResult(
			'Flat02',
			400,
			flat02.status,
			flat02.data,
			'Error área muy pequeña (< 10m²)'
		);

		// Flat03 - Error habitaciones inválidas
		const flat03Data = {
			...createBaseProperty(testContactId),
			propertyTypeId: 'flat',
			rooms: 0
		};
		const flat03 = await makeRequest('POST', '/api/properties', flat03Data);
		showTestResult(
			'Flat03',
			400,
			flat03.status,
			flat03.data,
			'Error número de habitaciones inválido'
		);

		// Flat04 - Error baños inválidos
		const flat04Data = {
			...createBaseProperty(testContactId),
			propertyTypeId: 'flat',
			bathrooms: 0
		};
		const flat04 = await makeRequest('POST', '/api/properties', flat04Data);
		showTestResult(
			'Flat04',
			400,
			flat04.status,
			flat04.data,
			'Error número de baños inválido'
		);

		console.log('\n🏡 SECCIÓN 4: TESTS DE CASAS (HOUSES)');

		// House01 - Casa válida
		const house01Data = {
			...createBaseProperty(testContactId),
			propertyTypeId: 'house',
			size: 200,
			rooms: 4,
			bathrooms: 3,
			garden: true,
			terrace: true,
			parking: true
		};
		const house01 = await makeRequest('POST', '/api/properties', house01Data);
		const resultHouse01 = showTestResult(
			'House01',
			201,
			house01.status,
			house01.data,
			'Casa válida con jardín y garaje'
		);

		if (
			resultHouse01.passed &&
			house01.data.success &&
			house01.data.data?.propertyId
		) {
			createdPropertyIds.house01 = house01.data.data.propertyId;
		}

		console.log('\n🏬 SECCIÓN 5: TESTS DE LOCALES COMERCIALES');

		// Premises01 - Local comercial válido
		const premises01Data = {
			...createBaseProperty(testContactId),
			propertyTypeId: 'premises',
			operation: 'rent',
			price: 2000,
			size: 150,
			bathrooms: 1,
			exterior: true,
			parking: false,
			airConditioning: true
		};
		const premises01 = await makeRequest(
			'POST',
			'/api/properties',
			premises01Data
		);
		const resultPremises01 = showTestResult(
			'Premises01',
			201,
			premises01.status,
			premises01.data,
			'Local comercial válido'
		);

		if (
			resultPremises01.passed &&
			premises01.data.success &&
			premises01.data.data?.propertyId
		) {
			createdPropertyIds.premises01 = premises01.data.data.propertyId;
		}

		console.log('\n🏢 SECCIÓN 6: TESTS DE OFICINAS');

		// Office01 - Oficina válida
		const office01Data = {
			...createBaseProperty(testContactId),
			propertyTypeId: 'office',
			operation: 'rent',
			price: 1800,
			size: 80,
			bathrooms: 1,
			floor: 5,
			exterior: true,
			elevator: true,
			airConditioning: true,
			parking: true
		};
		const office01 = await makeRequest('POST', '/api/properties', office01Data);
		const resultOffice01 = showTestResult(
			'Office01',
			201,
			office01.status,
			office01.data,
			'Oficina válida'
		);

		if (
			resultOffice01.passed &&
			office01.data.success &&
			office01.data.data?.propertyId
		) {
			createdPropertyIds.office01 = office01.data.data.propertyId;
		}

		console.log('\n🚗 SECCIÓN 7: TESTS DE GARAJES');

		// Garage01 - Garaje válido
		const garage01Data = {
			...createBaseProperty(testContactId),
			propertyTypeId: 'garage',
			operation: 'sale',
			price: 25000,
			size: 20,
			floor: -1
		};
		const garage01 = await makeRequest('POST', '/api/properties', garage01Data);
		showTestResult(
			'Garage01',
			201,
			garage01.status,
			garage01Data,
			'Garaje válido'
		);

		console.log('\n📍 SECCIÓN 8: TESTS DE UBICACIÓN Y DIRECCIÓN');

		// Location01 - Error código postal inválido
		const location01Data = {
			...createBaseProperty(testContactId),
			address: {
				...createBaseProperty(testContactId).address,
				postalCode: '99999' // Código postal inexistente
			}
		};
		const location01 = await makeRequest(
			'POST',
			'/api/properties',
			location01Data
		);
		showTestResult(
			'Location01',
			400,
			location01.status,
			location01.data,
			'Error código postal inválido'
		);

		// Location02 - Error coordenadas inválidas
		const location02Data = {
			...createBaseProperty(testContactId),
			ubication: {
				latitude: 999, // Latitud inválida
				longitude: 999 // Longitud inválida
			}
		};
		const location02 = await makeRequest(
			'POST',
			'/api/properties',
			location02Data
		);
		showTestResult(
			'Location02',
			400,
			location02.status,
			location02.data,
			'Error coordenadas geográficas inválidas'
		);

		console.log('\n💰 SECCIÓN 9: TESTS DE PRECIO');

		// Price01 - Error precio negativo
		const price01Data = { ...createBaseProperty(testContactId), price: -1000 };
		const price01 = await makeRequest('POST', '/api/properties', price01Data);
		showTestResult(
			'Price01',
			400,
			price01.status,
			price01.data,
			'Error precio negativo'
		);

		// Price02 - Error precio cero
		const price02Data = { ...createBaseProperty(testContactId), price: 0 };
		const price02 = await makeRequest('POST', '/api/properties', price02Data);
		showTestResult(
			'Price02',
			400,
			price02.status,
			price02.data,
			'Error precio cero'
		);

		// Price03 - Precio muy alto (límite superior)
		const price03Data = {
			...createBaseProperty(testContactId),
			price: 50000000
		};
		const price03 = await makeRequest('POST', '/api/properties', price03Data);
		showTestResult(
			'Price03',
			201,
			price03.status,
			price03.data,
			'Precio muy alto dentro del límite'
		);

		console.log('\n📝 SECCIÓN 10: TESTS DE CAMPOS OBLIGATORIOS');

		// Required01 - Error sin título
		const required01Data = { ...createBaseProperty(testContactId) };
		delete required01Data.title;
		const required01 = await makeRequest(
			'POST',
			'/api/properties',
			required01Data
		);
		showTestResult(
			'Required01',
			400,
			required01.status,
			required01.data,
			'Error falta título'
		);

		// Required02 - Error sin descripción
		const required02Data = { ...createBaseProperty(testContactId) };
		delete required02Data.description;
		const required02 = await makeRequest(
			'POST',
			'/api/properties',
			required02Data
		);
		showTestResult(
			'Required02',
			400,
			required02.status,
			required02.data,
			'Error falta descripción'
		);

		// Required03 - Error sin contacto
		const required03Data = { ...createBaseProperty(testContactId) };
		delete required03Data.contactId;
		const required03 = await makeRequest(
			'POST',
			'/api/properties',
			required03Data
		);
		showTestResult(
			'Required03',
			400,
			required03.status,
			required03.data,
			'Error falta contactId'
		);

		console.log('\n🔍 SECCIÓN 11: TESTS DE BÚSQUEDA Y CONSULTA');

		// Property10 - Buscar propiedades con paginación
		const property10 = await makeRequest(
			'GET',
			'/api/properties?page=1&size=10'
		);
		showTestResult(
			'Property10',
			200,
			property10.status,
			property10.data,
			'Búsqueda con paginación'
		);

		// Property11 - Buscar propiedad por ID inexistente
		const property11 = await makeRequest('GET', '/api/properties/99999999');
		showTestResult(
			'Property11',
			404,
			property11.status,
			property11.data,
			'Propiedad inexistente'
		);

		// Property12 - Buscar todas las propiedades
		const property12 = await makeRequest(
			'GET',
			'/api/properties?page=1&size=100'
		);
		showTestResult(
			'Property12',
			200,
			property12.status,
			property12.data,
			'Búsqueda completa'
		);

		// Search01 - Búsqueda por tipo de propiedad
		const search01 = await makeRequest(
			'GET',
			'/api/properties?propertyTypeId=flat&page=1&size=10'
		);
		showTestResult(
			'Search01',
			200,
			search01.status,
			search01.data,
			'Búsqueda por tipo (flat)'
		);

		// Search02 - Búsqueda por operación
		const search02 = await makeRequest(
			'GET',
			'/api/properties?operation=sale&page=1&size=10'
		);
		showTestResult(
			'Search02',
			200,
			search02.status,
			search02.data,
			'Búsqueda por operación (sale)'
		);

		// Search03 - Búsqueda por rango de precio
		const search03 = await makeRequest(
			'GET',
			'/api/properties?minPrice=100000&maxPrice=500000&page=1&size=10'
		);
		showTestResult(
			'Search03',
			200,
			search03.status,
			search03.data,
			'Búsqueda por rango de precio'
		);

		console.log('\n✏️ SECCIÓN 12: TESTS DE ACTUALIZACIÓN');

		// Property13 - Actualizar propiedad válida
		if (createdPropertyIds.property01) {
			const property13 = await makeRequest(
				'PUT',
				`/api/properties/${createdPropertyIds.property01}`,
				{
					title: 'Propiedad actualizada - Test automatizado',
					description: 'Descripción actualizada mediante test automatizado',
					price: 275000
				}
			);
			showTestResult(
				'Property13',
				200,
				property13.status,
				property13.data,
				'Actualización exitosa'
			);
		}

		// Update01 - Actualizar con datos inválidos
		if (createdPropertyIds.property01) {
			const update01 = await makeRequest(
				'PUT',
				`/api/properties/${createdPropertyIds.property01}`,
				{
					price: -5000 // Precio inválido
				}
			);
			showTestResult(
				'Update01',
				400,
				update01.status,
				update01.data,
				'Error actualización con datos inválidos'
			);
		}

		console.log('\n🔄 SECCIÓN 13: TESTS DE GESTIÓN DE ESTADO');

		// Property16 - Desactivar propiedad
		if (createdPropertyIds.property03) {
			const property16 = await makeRequest(
				'DELETE',
				`/api/properties/${createdPropertyIds.property03}`
			);
			showTestResult(
				'Property16',
				200,
				property16.status,
				property16.data,
				'Desactivación exitosa'
			);
		}

		// Property18 - Reactivar propiedad
		if (createdPropertyIds.property03) {
			const property18 = await makeRequest(
				'PUT',
				`/api/properties/${createdPropertyIds.property03}/reactivate`
			);
			showTestResult(
				'Property18',
				200,
				property18.status,
				property18.data,
				'Reactivación exitosa'
			);
		}

		// State01 - Intentar desactivar propiedad inexistente
		const state01 = await makeRequest('DELETE', '/api/properties/99999999');
		showTestResult(
			'State01',
			404,
			state01.status,
			state01.data,
			'Error desactivar propiedad inexistente'
		);

		// State02 - Intentar reactivar propiedad inexistente
		const state02 = await makeRequest(
			'PUT',
			'/api/properties/99999999/reactivate'
		);
		showTestResult(
			'State02',
			404,
			state02.status,
			state02.data,
			'Error reactivar propiedad inexistente'
		);

		console.log('\n📊 GENERANDO REPORTE FINAL...');

		// Generar estadísticas
		const totalTests = testResults.length;
		const passedTests = testResults.filter(r => r.passed).length;
		const failedTests = totalTests - passedTests;
		const successRate = ((passedTests / totalTests) * 100).toFixed(2);

		console.log('\n🎉 SUITE DE TESTS COMPLETADO!');
		console.log('='.repeat(80));
		console.log(`📈 ESTADÍSTICAS:`);
		console.log(`   Total de tests: ${totalTests}`);
		console.log(`   Tests exitosos: ${passedTests} ✅`);
		console.log(`   Tests fallidos: ${failedTests} ❌`);
		console.log(`   Tasa de éxito: ${successRate}%`);
		console.log('');
		console.log(
			`📄 Propiedades creadas: ${Object.keys(createdPropertyIds).length}`
		);
		console.log(JSON.stringify(createdPropertyIds, null, 2));

		// Generar reporte detallado
		const report = {
			timestamp: new Date().toISOString(),
			summary: {
				totalTests,
				passedTests,
				failedTests,
				successRate: `${successRate}%`,
				propertiesCreated: Object.keys(createdPropertyIds).length,
				createdPropertyIds
			},
			testResults,
			environment: {
				baseUrl: BASE_URL,
				testContactId
			}
		};

		// Guardar reporte en archivo
		const reportFilename = `idealista-properties-test-report-${
			new Date().toISOString().split('T')[0]
		}.json`;
		fs.writeFileSync(reportFilename, JSON.stringify(report, null, 2));
		console.log(`\n💾 Reporte guardado en: ${reportFilename}`);

		// Generar reporte markdown
		const markdownReport = generateMarkdownReport(report);
		const markdownFilename = `IDEALISTA_PROPERTIES_TEST_REPORT.md`;
		fs.writeFileSync(markdownFilename, markdownReport);
		console.log(`📋 Reporte Markdown guardado en: ${markdownFilename}`);

		console.log('\n📧 PRÓXIMOS PASOS:');
		console.log('1. Revisa los tests fallidos y corrige los errores');
		console.log('2. Envía los reportes generados a Idealista como evidencia');
		console.log(
			'3. Documenta cualquier discrepancia entre lo esperado y actual'
		);
	} catch (error) {
		console.error('\n❌ Error ejecutando suite de tests:', error.message);
		console.log('\n🔧 Soluciones posibles:');
		console.log(
			'1. Asegurate de que el servidor esté corriendo: vercel dev --listen 3001'
		);
		console.log('2. Verifica que las variables de entorno estén configuradas');
		console.log('3. Revisa la conexión con la API de Idealista');
		console.log(
			'4. Verifica que los endpoints de la API estén funcionando correctamente'
		);
	}
}

function generateMarkdownReport(report) {
	const { summary, testResults } = report;

	let markdown = `# 🏠 Reporte de Tests - API de Propiedades Idealista

## 📊 Resumen Ejecutivo

- **Fecha de ejecución:** ${new Date(report.timestamp).toLocaleDateString(
		'es-ES'
	)}
- **Total de tests:** ${summary.totalTests}
- **Tests exitosos:** ${summary.passedTests} ✅
- **Tests fallidos:** ${summary.failedTests} ❌
- **Tasa de éxito:** ${summary.successRate}
- **Propiedades creadas:** ${summary.propertiesCreated}

## 🎯 Propiedades Creadas Durante los Tests

\`\`\`json
${JSON.stringify(summary.createdPropertyIds, null, 2)}
\`\`\`

## 📋 Detalle de Tests Ejecutados

| Test ID | Nombre | Esperado | Actual | Estado | Notas |
|---------|--------|----------|---------|---------|-------|
`;

	testResults.forEach(test => {
		const status = test.passed ? '✅ PASS' : '❌ FAIL';
		markdown += `| ${test.id} | ${test.name} | ${test.expected} | ${
			test.actual
		} | ${status} | ${test.notes || ''} |\n`;
	});

	markdown += `\n## 🔍 Tests Fallidos

`;

	const failedTests = testResults.filter(t => !t.passed);
	if (failedTests.length === 0) {
		markdown += `¡Excelente! Todos los tests pasaron exitosamente. 🎉\n`;
	} else {
		failedTests.forEach(test => {
			markdown += `### ${test.id} - ${test.name}

- **Esperado:** ${test.expected}
- **Actual:** ${test.actual}
- **Notas:** ${test.notes}
- **Respuesta:**
\`\`\`json
${JSON.stringify(test.response, null, 2)}
\`\`\`

`;
		});
	}

	markdown += `## 🛠️ Recomendaciones

1. **Para tests fallidos:** Revisar la implementación de los endpoints correspondientes
2. **Para validaciones:** Asegurar que la validación de esquemas coincida con los requerimientos de Idealista
3. **Para errores de autenticación:** Verificar la configuración de tokens y credenciales
4. **Para errores de negocio:** Validar que las reglas de negocio estén correctamente implementadas

## 📧 Próximos Pasos

1. Corregir cualquier test fallido
2. Re-ejecutar los tests hasta obtener 100% de éxito
3. Enviar este reporte junto con los logs a Idealista para validación
4. Programar tests de regresión automáticos

---

*Reporte generado automáticamente por el script de validación de Idealista API*
*Timestamp: ${report.timestamp}*
`;

	return markdown;
}

// Ejecutar suite completa de tests
runCompletePropertyTests();
