#!/usr/bin/env node

/**
 * Script de Test para Imágenes - Idealista API
 * Tests Image03-Image06 según el sheet oficial de validaciones
 *
 * Uso: node test-properties-image03-image06.js
 *
 * Asegurate de tener el servidor local corriendo:
 * vercel dev --listen 3001
 */

const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
let testContactId = null;
let testPropertyId = null;
const testResults = [];
const CACHE_FILE = 'test-properties-image03-image06-cache.json';

// Cargar caché de tests exitosos
function loadTestCache() {
	try {
		if (fs.existsSync(CACHE_FILE)) {
			const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
			console.log(
				`📦 Caché cargado: ${
					Object.keys(cache.results || {}).length
				} tests exitosos`
			);
			return cache;
		}
	} catch (error) {
		console.log('⚠️ No se pudo cargar el caché:', error.message);
	}
	return { results: {}, contactId: null, propertyId: null };
}

// Guardar caché de tests exitosos
function saveTestCache(cache) {
	try {
		fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
		console.log(
			`💾 Caché actualizado: ${
				Object.keys(cache.results).length
			} tests exitosos`
		);
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
function logTestResult(
	testId,
	description,
	expected,
	actual,
	data,
	notes = '',
	fromCache = false
) {
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
	console.log(
		`Expected: ${expected} | Actual: ${actual} | ${
			passed ? '✅ PASS' : '❌ FAIL'
		}${fromCache ? ' 📦 CACHED' : ''}`
	);
	if (notes) console.log(`📝 ${notes}`);
	if (!passed && !fromCache) {
		console.log(`📋 Response:`, JSON.stringify(data, null, 2));
	}
	console.log('-'.repeat(60));

	return passed;
}

// Crear payload para imágenes con orden intercambiado (Image03)
function createImagePayloadSwappedOrder() {
	return {
		images: [
			{
				url: 'https://img4.idealista.com/blur/WEB_LISTING-M/0/id.pro.es.image.master/2c/80/aa/0987654321.webp',
				label: 'Cocina moderna',
				order: 1 // Ahora es primera
			},
			{
				url: 'https://img4.idealista.com/blur/WEB_LISTING-M/0/id.pro.es.image.master/2c/80/aa/1234567890.webp',
				label: 'Salón principal',
				order: 2 // Ahora es segunda
			}
		]
	};
}

// Crear payload para imágenes con labels cambiados (Image04)
function createImagePayloadChangedLabels() {
	return {
		images: [
			{
				url: 'https://img4.idealista.com/blur/WEB_LISTING-M/0/id.pro.es.image.master/2c/80/aa/1234567890.webp',
				label: 'Salón renovado', // Label cambiado
				order: 1
			},
			{
				url: 'https://img4.idealista.com/blur/WEB_LISTING-M/0/id.pro.es.image.master/2c/80/aa/0987654321.webp',
				label: 'Cocina equipada', // Label cambiado
				order: 2
			}
		]
	};
}

// Crear payload para eliminar una imagen específica (Image05)
function createImagePayloadDeleteOne() {
	return {
		images: [
			{
				url: 'https://img4.idealista.com/blur/WEB_LISTING-M/0/id.pro.es.image.master/2c/80/aa/1234567890.webp',
				label: 'Salón renovado',
				order: 1
			}
			// Solo una imagen - la segunda se elimina
		]
	};
}

async function runTests() {
	console.log('📷 TESTS IMAGE03-IMAGE06 - IDEALISTA API VALIDATION');
	console.log('='.repeat(60));

	// Cargar caché
	const cache = loadTestCache();

	// Usar contacto y propiedad del caché o de tests anteriores
	if (cache.contactId && cache.propertyId) {
		testContactId = cache.contactId;
		testPropertyId = cache.propertyId;
		console.log(`📞 Usando contacto del caché: ${testContactId}`);
		console.log(`🏠 Usando propiedad del caché: ${testPropertyId}`);
	} else {
		// Usar IDs de tests anteriores exitosos
		testContactId = 100206138; // ID del contacto usado en tests anteriores
		testPropertyId = 108635797; // ID de Office01 exitoso
		console.log(`📞 Usando contacto de tests anteriores: ${testContactId}`);
		console.log(`🏠 Usando propiedad de tests anteriores: ${testPropertyId}`);
		cache.contactId = testContactId;
		cache.propertyId = testPropertyId;
	}

	// Función helper para ejecutar o usar caché
	async function executeOrUseCache(
		testId,
		description,
		expected,
		requestFn,
		notes = ''
	) {
		if (cache.results[testId] && cache.results[testId].passed) {
			const cachedResult = cache.results[testId];
			logTestResult(
				testId,
				description,
				expected,
				cachedResult.actual,
				cachedResult.response,
				notes,
				true
			);
			return cachedResult;
		} else {
			console.log(`\n📝 ${testId.toUpperCase()} - ${description}`);
			const result = await requestFn();
			const passed = logTestResult(
				testId,
				description,
				expected,
				result.status,
				result.data,
				notes
			);
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
		// Image03 - Update order
		await executeOrUseCache(
			'Image03',
			'Actualizar orden de imágenes',
			202,
			() =>
				makeRequest(
					'POST',
					`/api/properties/${testPropertyId}/images`,
					createImagePayloadSwappedOrder()
				),
			'Intercambiar el orden de las imágenes del test Image01'
		);

		// Image04 - Update label
		await executeOrUseCache(
			'Image04',
			'Actualizar labels de imágenes',
			202,
			() =>
				makeRequest(
					'POST',
					`/api/properties/${testPropertyId}/images`,
					createImagePayloadChangedLabels()
				),
			'Cambiar los labels de las imágenes del test Image01'
		);

		// Image05 - Delete single image
		await executeOrUseCache(
			'Image05',
			'Eliminar una imagen específica',
			202,
			() =>
				makeRequest(
					'POST',
					`/api/properties/${testPropertyId}/images`,
					createImagePayloadDeleteOne()
				),
			'Eliminar una imagen específica de la propiedad usada en Image01'
		);

		// Image06 - Delete all images
		await executeOrUseCache(
			'Image06',
			'Eliminar todas las imágenes',
			200,
			() => makeRequest('DELETE', `/api/properties/${testPropertyId}/images`),
			'Eliminar todas las imágenes de una propiedad usando el endpoint delete all'
		);

		// Guardar caché actualizado
		saveTestCache(cache);

		// Generar estadísticas
		console.log('\n📊 GENERANDO REPORTE...');

		const totalTests = testResults.length;
		const passedTests = testResults.filter(r => r.passed).length;
		const failedTests = totalTests - passedTests;
		const successRate = ((passedTests / totalTests) * 100).toFixed(2);

		console.log('\n🎉 TESTS IMAGE03-IMAGE06 COMPLETADOS!');
		console.log('='.repeat(60));
		console.log(`📈 ESTADÍSTICAS:`);
		console.log(`   Total: ${totalTests} tests`);
		console.log(`   Exitosos: ${passedTests} ✅`);
		console.log(`   Fallidos: ${failedTests} ❌`);
		console.log(`   Tasa de éxito: ${successRate}%`);

		// Guardar reporte
		const report = {
			timestamp: new Date().toISOString(),
			summary: {
				totalTests,
				passedTests,
				failedTests,
				successRate: `${successRate}%`
			},
			testContactId,
			testPropertyId,
			results: testResults
		};

		const reportFile = `idealista-properties-image03-image06-${
			new Date().toISOString().split('T')[0]
		}.json`;
		fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
		console.log(`\n💾 Reporte guardado: ${reportFile}`);

		// Generar reporte markdown
		let markdown = `# 📷 Tests Image03-Image06 - Idealista API

## 📊 Resumen
- **Fecha:** ${new Date().toLocaleDateString('es-ES')}
- **Tests:** Image03 a Image06 (Actualizar y eliminar imágenes)
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
			testResults
				.filter(t => !t.passed)
				.forEach(test => {
					markdown += `### ${test.id} - ${test.description}\n`;
					markdown += `- **Esperado:** ${test.expected}\n`;
					markdown += `- **Obtenido:** ${test.actual}\n`;
					if (test.notes) markdown += `- **Notas:** ${test.notes}\n`;
					markdown += `\n`;
				});
		}

		markdown += `\n---\n*Reporte generado automáticamente - ${new Date().toISOString()}*`;

		const markdownFile = 'IDEALISTA_PROPERTIES_IMAGE03-IMAGE06_REPORT.md';
		fs.writeFileSync(markdownFile, markdown);
		console.log(`📋 Reporte Markdown: ${markdownFile}`);

		console.log('\n📧 PRÓXIMOS PASOS:');
		console.log('1. Revisar tests de validación fallidos');
		console.log(
			'2. Verificar que las operaciones de actualización funcionan correctamente'
		);
		console.log(
			'3. Confirmar que la eliminación de imágenes funciona como esperado'
		);
	} catch (error) {
		console.error('\n❌ Error ejecutando tests:', error.message);
	}
}

// Ejecutar tests
runTests();
