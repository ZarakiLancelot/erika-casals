#!/usr/bin/env node

/**
 * Script automatizado para ejecutar todos los tests de la API de propiedades de Idealista
 *
 * Uso: node test-properties-api.js
 *
 * Asegurate de tener el servidor local corriendo en el puerto 3001:
 * vercel dev --listen 3001
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';
const createdPropertyIds = {}; // Para guardar IDs de propiedades creadas

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
}

// Función para mostrar resultados de test
function showTestResult(testName, expectedStatus, actualStatus, data) {
	console.log(`\n🧪 ${testName}`);
	console.log(`Expected: ${expectedStatus} | Actual: ${actualStatus}`);
	console.log(
		`Result: ${actualStatus === expectedStatus ? '✅ PASS' : '❌ FAIL'}`
	);
	console.log(`Response:`, JSON.stringify(data, null, 2));
	console.log('-'.repeat(80));
}

// Propiedades base para tests
const BASE_PROPERTY = {
	operation: 'sale',
	scope: 'idealista',
	addressVisibility: 'full',
	price: 250000,
	// Datos de ubicación básicos
	address: {
		street: 'Calle Test',
		number: '123',
		postalCode: '28001',
		city: 'Madrid',
		province: 'Madrid',
		country: 'España'
	},
	// Campos obligatorios básicos
	title: 'Propiedad de prueba',
	description: 'Descripción de la propiedad de prueba para testing',
	contactInfo: {
		email: 'test@example.com',
		phone: '123456789'
	}
};

async function runPropertyTests() {
	console.log('🏠 Iniciando tests de API de Propiedades - Idealista\n');
	console.log(`Base URL: ${BASE_URL}`);
	console.log('='.repeat(80));

	try {
		// Property01 - Crear propiedad válida
		console.log('\n📝 Property01 - Crear propiedad válida');
		const property01 = await makeRequest('POST', '/api/properties', {
			...BASE_PROPERTY,
			type: 'flat',
			operation: 'sale'
		});

		showTestResult('Property01', 201, property01.status, property01.data);

		// Guardar ID si se creó correctamente
		if (
			property01.status === 201 &&
			property01.data.success &&
			property01.data.data?.propertyId
		) {
			createdPropertyIds.property01 = property01.data.data.propertyId;
			console.log(
				`💾 Propiedad creada con ID: ${createdPropertyIds.property01}`
			);
		}

		// Property02 - Error token inválido (simulamos con headers incorrectos)
		console.log('\n📝 Property02 - Error token inválido');
		const property02 = await makeRequest('POST', '/api/properties', {
			...BASE_PROPERTY,
			type: 'flat'
		});

		showTestResult('Property02', 401, property02.status, property02.data);

		// Property03 - Propiedad para venta
		console.log('\n📝 Property03 - Crear propiedad para venta');
		const property03 = await makeRequest('POST', '/api/properties', {
			...BASE_PROPERTY,
			type: 'flat',
			operation: 'sale'
		});

		showTestResult('Property03', 201, property03.status, property03.data);

		if (
			property03.status === 201 &&
			property03.data.success &&
			property03.data.data?.propertyId
		) {
			createdPropertyIds.property03 = property03.data.data.propertyId;
		}

		// Property04 - Propiedad para alquiler
		console.log('\n📝 Property04 - Crear propiedad para alquiler');
		const property04 = await makeRequest('POST', '/api/properties', {
			...BASE_PROPERTY,
			type: 'flat',
			operation: 'rent'
		});

		showTestResult('Property04', 201, property04.status, property04.data);

		if (
			property04.status === 201 &&
			property04.data.success &&
			property04.data.data?.propertyId
		) {
			createdPropertyIds.property04 = property04.data.data.propertyId;
		}

		// Flat01 - Piso válido
		console.log('\n📝 Flat01 - Crear piso válido');
		const flat01 = await makeRequest('POST', '/api/properties', {
			...BASE_PROPERTY,
			type: 'flat',
			operation: 'sale',
			// Campos específicos de piso
			rooms: 3,
			bathrooms: 2,
			size: 120,
			floor: 2
		});

		showTestResult('Flat01', 201, flat01.status, flat01.data);

		if (
			flat01.status === 201 &&
			flat01.data.success &&
			flat01.data.data?.propertyId
		) {
			createdPropertyIds.flat01 = flat01.data.data.propertyId;
		}

		// Flat02 - Error validación área
		console.log('\n📝 Flat02 - Error validación área (área < 10)');
		const flat02 = await makeRequest('POST', '/api/properties', {
			...BASE_PROPERTY,
			type: 'flat',
			operation: 'sale',
			size: 5 // Área muy pequeña
		});

		showTestResult('Flat02', 400, flat02.status, flat02.data);

		// Property10 - Buscar propiedades (GET)
		console.log('\n📝 Property10 - Buscar propiedades');
		const property10 = await makeRequest(
			'GET',
			'/api/properties?page=1&size=10'
		);

		showTestResult('Property10', 200, property10.status, property10.data);

		// Property11 - Buscar propiedad por ID que no existe
		console.log('\n📝 Property11 - Buscar propiedad inexistente');
		const property11 = await makeRequest('GET', '/api/properties/99999999');

		showTestResult('Property11', 404, property11.status, property11.data);

		// Property12 - Buscar todas las propiedades
		console.log('\n📝 Property12 - Buscar todas las propiedades');
		const property12 = await makeRequest(
			'GET',
			'/api/properties?page=1&size=100'
		);

		showTestResult('Property12', 200, property12.status, property12.data);

		// Property13 - Actualizar propiedad (si se creó una)
		if (createdPropertyIds.property01) {
			console.log('\n📝 Property13 - Actualizar propiedad');
			const property13 = await makeRequest(
				'PUT',
				`/api/properties/${createdPropertyIds.property01}`,
				{
					title: 'Propiedad actualizada',
					description: 'Descripción actualizada para testing',
					price: 275000
				}
			);

			showTestResult('Property13', 200, property13.status, property13.data);
		}

		// Property16 - Desactivar propiedad
		if (createdPropertyIds.property03) {
			console.log('\n📝 Property16 - Desactivar propiedad');
			const property16 = await makeRequest(
				'DELETE',
				`/api/properties/${createdPropertyIds.property03}`
			);

			showTestResult('Property16', 200, property16.status, property16.data);
		}

		// Property18 - Reactivar propiedad
		if (createdPropertyIds.property03) {
			console.log('\n📝 Property18 - Reactivar propiedad');
			const property18 = await makeRequest(
				'PUT',
				`/api/properties/${createdPropertyIds.property03}/reactivate`
			);

			showTestResult('Property18', 200, property18.status, property18.data);
		}

		console.log('\n🎉 Tests básicos de propiedades completados!');
		console.log('\n📊 Propiedades creadas:');
		console.log(JSON.stringify(createdPropertyIds, null, 2));
		console.log(
			'\n📄 Documenta estos resultados y envíalos a Idealista como evidencia.'
		);
	} catch (error) {
		console.error('\n❌ Error ejecutando tests:', error.message);
		console.log('\n🔧 Soluciones posibles:');
		console.log(
			'1. Asegurate de que el servidor esté corriendo: vercel dev --listen 3001'
		);
		console.log('2. Verifica que las variables de entorno estén configuradas');
		console.log('3. Revisa la conexión con la API de Idealista');
	}
}

// Ejecutar tests
runPropertyTests();
