/**
 * IDEALISTA API - TESTS BÁSICOS DE PROPIEDADES (Property01-Property09)
 *
 * Script limpio que implementa únicamente los primeros 9 tests de propiedades
 * según la hoja de validación de Idealista, usando el esquema correcto.
 *
 * Esquema correcto basado en la API oficial:
 * - operation: objeto con type ("sale"/"rent") y price
 * - address: objeto con streetName, streetNumber, postalCode, town, etc.
 * - features: objeto con propiedades específicas del tipo de propiedad
 * - type: string con el tipo de propiedad ("flat", "house", etc.)
 */

const https = require('https');
const fs = require('fs');

// ============================
// CONFIGURACIÓN
// ============================

const CONFIG = {
	CLIENT_ID: 'idealista-client-id',
	CLIENT_SECRET: 'idealista-client-secret',
	FEED_KEY: 'ilc-fake-feed-key-for-testing-purposes-only',
	BASE_URL: 'https://partners-sandbox.idealista.com',
	// Usar backend local para evitar problemas de CORS
	USE_LOCAL_BACKEND: true,
	LOCAL_BACKEND_URL: 'http://localhost:3001/api'
};

// ============================
// UTILIDADES
// ============================

let accessToken = null;

// Función para obtener token OAuth2
async function getAccessToken() {
	if (accessToken) return accessToken;

	const credentials = Buffer.from(
		`${CONFIG.CLIENT_ID}:${CONFIG.CLIENT_SECRET}`
	).toString('base64');

	const postData = 'grant_type=client_credentials&scope=write';

	const options = {
		hostname: 'partners-sandbox.idealista.com',
		port: 443,
		path: '/oauth/token',
		method: 'POST',
		headers: {
			Authorization: `Basic ${credentials}`,
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(postData)
		}
	};

	return new Promise((resolve, reject) => {
		const req = https.request(options, res => {
			let data = '';
			res.on('data', chunk => {
				data += chunk;
			});
			res.on('end', () => {
				try {
					const tokenData = JSON.parse(data);
					if (tokenData.access_token) {
						accessToken = tokenData.access_token;
						resolve(accessToken);
					} else {
						reject(new Error('No access token received'));
					}
				} catch (error) {
					reject(error);
				}
			});
		});

		req.on('error', reject);
		req.write(postData);
		req.end();
	});
}

// Función para hacer peticiones HTTP
async function makeRequest(method, endpoint, data = null) {
	if (CONFIG.USE_LOCAL_BACKEND) {
		// Usar fetch con backend local
		const url = `${CONFIG.LOCAL_BACKEND_URL}${endpoint}`;

		const options = {
			method,
			headers: {
				'Content-Type': 'application/json',
				feedKey: CONFIG.FEED_KEY
			}
		};

		if (data) {
			options.body = JSON.stringify(data);
		}

		try {
			const response = await fetch(url, options);
			const result = await response.json();

			return {
				success: response.ok,
				status: response.status,
				data: result,
				error: response.ok ? null : result.error || result.message
			};
		} catch (error) {
			return {
				success: false,
				status: 500,
				error: error.message,
				data: null
			};
		}
	} else {
		// Petición directa a Idealista (requiere token)
		const token = await getAccessToken();

		const postData = data ? JSON.stringify(data) : null;

		const options = {
			hostname: 'partners-sandbox.idealista.com',
			port: 443,
			path: `/v1${endpoint}`,
			method,
			headers: {
				Authorization: `Bearer ${token}`,
				feedKey: CONFIG.FEED_KEY,
				'Content-Type': 'application/json'
			}
		};

		if (postData) {
			options.headers['Content-Length'] = Buffer.byteLength(postData);
		}

		return new Promise((resolve, reject) => {
			const req = https.request(options, res => {
				let responseData = '';
				res.on('data', chunk => {
					responseData += chunk;
				});
				res.on('end', () => {
					try {
						const result = responseData ? JSON.parse(responseData) : null;
						resolve({
							success: res.statusCode >= 200 && res.statusCode < 300,
							status: res.statusCode,
							data: result,
							error: result?.error || null
						});
					} catch (error) {
						resolve({
							success: false,
							status: res.statusCode,
							error: responseData,
							data: null
						});
					}
				});
			});

			req.on('error', reject);
			if (postData) req.write(postData);
			req.end();
		});
	}
}

// ============================
// DEFINICIÓN DE TESTS
// ============================

const PROPERTY_TESTS = [
	{
		id: 'Property01',
		name: 'Crear propiedad válida básica',
		expectedStatus: 201,
		payload: {
			code: 'TEST-PROP-001',
			type: 'flat',
			operation: {
				type: 'sale',
				price: 250000
			},
			address: {
				streetName: 'Calle Gran Vía',
				streetNumber: '123',
				postalCode: '28013',
				town: 'Madrid',
				country: 'ES'
			},
			features: {
				areaConstructed: 85,
				rooms: 3,
				bathroomNumber: 2
			},
			descriptions: [
				{
					language: 'es',
					text: 'Piso de 3 habitaciones en el centro de Madrid'
				}
			],
			contactId: 1
		}
	},
	{
		id: 'Property02',
		name: 'Error sin token de autorización',
		expectedStatus: 401,
		payload: {
			code: 'TEST-PROP-002',
			type: 'flat',
			operation: {
				type: 'sale',
				price: 300000
			},
			address: {
				streetName: 'Calle Serrano',
				streetNumber: '45',
				postalCode: '28001',
				town: 'Madrid',
				country: 'ES'
			},
			features: {
				areaConstructed: 95,
				rooms: 3,
				bathroomNumber: 2
			},
			descriptions: [
				{
					language: 'es',
					text: 'Piso en zona premium de Madrid'
				}
			],
			contactId: 1
		},
		skipAuth: true // Este test debe fallar por falta de autorización
	},
	{
		id: 'Property03',
		name: 'Propiedad para venta',
		expectedStatus: 201,
		payload: {
			code: 'TEST-PROP-003',
			type: 'house',
			operation: {
				type: 'sale',
				price: 450000
			},
			address: {
				streetName: 'Avenida de la Castellana',
				streetNumber: '200',
				postalCode: '28046',
				town: 'Madrid',
				country: 'ES'
			},
			features: {
				areaConstructed: 120,
				rooms: 4,
				bathroomNumber: 3,
				garden: true,
				terrace: true
			},
			descriptions: [
				{
					language: 'es',
					text: 'Casa unifamiliar con jardín y terraza'
				}
			],
			contactId: 1
		}
	},
	{
		id: 'Property04',
		name: 'Propiedad para alquiler',
		expectedStatus: 201,
		payload: {
			code: 'TEST-PROP-004',
			type: 'flat',
			operation: {
				type: 'rent',
				price: 1200
			},
			address: {
				streetName: 'Calle Fuencarral',
				streetNumber: '78',
				postalCode: '28004',
				town: 'Madrid',
				country: 'ES'
			},
			features: {
				areaConstructed: 70,
				rooms: 2,
				bathroomNumber: 1,
				liftAvailable: true,
				conditionedAir: true
			},
			descriptions: [
				{
					language: 'es',
					text: 'Apartamento moderno en alquiler, completamente amueblado'
				}
			],
			contactId: 1
		}
	},
	{
		id: 'Property05',
		name: 'Error sin código de propiedad',
		expectedStatus: 400,
		payload: {
			// code: 'TEST-PROP-005', // Omitido intencionalmente
			type: 'flat',
			operation: {
				type: 'sale',
				price: 280000
			},
			address: {
				streetName: 'Calle Alcalá',
				streetNumber: '150',
				postalCode: '28009',
				town: 'Madrid',
				country: 'ES'
			},
			features: {
				areaConstructed: 90,
				rooms: 3,
				bathroomNumber: 2
			},
			descriptions: [
				{
					language: 'es',
					text: 'Piso sin código de referencia'
				}
			],
			contactId: 1
		}
	},
	{
		id: 'Property06',
		name: 'Error sin tipo de propiedad',
		expectedStatus: 400,
		payload: {
			code: 'TEST-PROP-006',
			// type: 'flat', // Omitido intencionalmente
			operation: {
				type: 'sale',
				price: 320000
			},
			address: {
				streetName: 'Calle Preciados',
				streetNumber: '25',
				postalCode: '28013',
				town: 'Madrid',
				country: 'ES'
			},
			features: {
				areaConstructed: 100,
				rooms: 3,
				bathroomNumber: 2
			},
			descriptions: [
				{
					language: 'es',
					text: 'Propiedad sin tipo especificado'
				}
			],
			contactId: 1
		}
	},
	{
		id: 'Property07',
		name: 'Error sin operación',
		expectedStatus: 400,
		payload: {
			code: 'TEST-PROP-007',
			type: 'flat',
			// operation: { ... }, // Omitido intencionalmente
			address: {
				streetName: 'Calle Mayor',
				streetNumber: '50',
				postalCode: '28013',
				town: 'Madrid',
				country: 'ES'
			},
			features: {
				areaConstructed: 75,
				rooms: 2,
				bathroomNumber: 1
			},
			descriptions: [
				{
					language: 'es',
					text: 'Propiedad sin operación especificada'
				}
			],
			contactId: 1
		}
	},
	{
		id: 'Property08',
		name: 'Error sin dirección',
		expectedStatus: 400,
		payload: {
			code: 'TEST-PROP-008',
			type: 'flat',
			operation: {
				type: 'sale',
				price: 290000
			},
			// address: { ... }, // Omitido intencionalmente
			features: {
				areaConstructed: 80,
				rooms: 3,
				bathroomNumber: 2
			},
			descriptions: [
				{
					language: 'es',
					text: 'Propiedad sin dirección especificada'
				}
			],
			contactId: 1
		}
	},
	{
		id: 'Property09',
		name: 'Error sin contacto',
		expectedStatus: 400,
		payload: {
			code: 'TEST-PROP-009',
			type: 'flat',
			operation: {
				type: 'sale',
				price: 310000
			},
			address: {
				streetName: 'Calle Velázquez',
				streetNumber: '80',
				postalCode: '28001',
				town: 'Madrid',
				country: 'ES'
			},
			features: {
				areaConstructed: 95,
				rooms: 3,
				bathroomNumber: 2
			},
			descriptions: [
				{
					language: 'es',
					text: 'Propiedad sin contacto especificado'
				}
			]
			// contactId: 1 // Omitido intencionalmente
		}
	}
];

// ============================
// EJECUCIÓN DE TESTS
// ============================

async function runPropertyTest(test) {
	console.log(`\n🧪 Ejecutando ${test.id}: ${test.name}`);
	console.log(`📋 Esperando status: ${test.expectedStatus}`);

	try {
		// Si es un test que debe fallar por autorización, usar configuración especial
		if (test.skipAuth) {
			// TODO: Implementar test sin autorización
			console.log('⚠️  Test de autorización no implementado en backend local');
			return {
				id: test.id,
				name: test.name,
				expected: test.expectedStatus,
				actual: { status: 'SKIPPED' },
				passed: false,
				notes: 'Test de autorización pendiente de implementación',
				timestamp: new Date().toISOString()
			};
		}

		const result = await makeRequest('POST', '/properties', test.payload);

		console.log(`📊 Status recibido: ${result.status}`);
		console.log(`📝 Respuesta:`, result.data);

		const passed = result.status === test.expectedStatus;

		if (passed) {
			console.log('✅ Test PASADO');
		} else {
			console.log('❌ Test FALLIDO');
			console.log(
				`   Esperado: ${test.expectedStatus}, Recibido: ${result.status}`
			);
			if (result.error) {
				console.log(`   Error: ${result.error}`);
			}
		}

		return {
			id: test.id,
			name: test.name,
			expected: test.expectedStatus,
			actual: {
				status: result.status,
				success: result.success,
				data: result.data,
				error: result.error
			},
			passed,
			notes: '',
			timestamp: new Date().toISOString(),
			propertyId: result.data?.propertyId || null
		};
	} catch (error) {
		console.log('💥 Error en test:', error.message);

		return {
			id: test.id,
			name: test.name,
			expected: test.expectedStatus,
			actual: {
				status: 'ERROR',
				error: error.message
			},
			passed: false,
			notes: `Error de ejecución: ${error.message}`,
			timestamp: new Date().toISOString()
		};
	}
}

async function runAllTests() {
	console.log(
		'🚀 INICIANDO TESTS DE PROPIEDADES BÁSICAS (Property01-Property09)'
	);
	console.log('='.repeat(60));

	const results = [];
	const createdProperties = [];

	for (const test of PROPERTY_TESTS) {
		const result = await runPropertyTest(test);
		results.push(result);

		if (result.passed && result.propertyId) {
			createdProperties.push(result.propertyId);
		}

		// Pequeña pausa entre tests
		await new Promise(resolve => setTimeout(resolve, 1000));
	}

	// Generar resumen
	const summary = {
		totalTests: results.length,
		passedTests: results.filter(r => r.passed).length,
		failedTests: results.filter(r => !r.passed).length,
		successRate: `${(
			(results.filter(r => r.passed).length / results.length) *
			100
		).toFixed(2)}%`,
		propertiesCreated: createdProperties.length,
		createdPropertyIds: createdProperties
	};

	console.log('\n' + '='.repeat(60));
	console.log('📊 RESUMEN DE RESULTADOS');
	console.log('='.repeat(60));
	console.log(`Total de tests: ${summary.totalTests}`);
	console.log(`Tests exitosos: ${summary.passedTests}`);
	console.log(`Tests fallidos: ${summary.failedTests}`);
	console.log(`Tasa de éxito: ${summary.successRate}`);
	console.log(`Propiedades creadas: ${summary.propertiesCreated}`);

	if (createdProperties.length > 0) {
		console.log(`IDs de propiedades creadas: ${createdProperties.join(', ')}`);
	}

	// Mostrar detalles de tests fallidos
	const failedTests = results.filter(r => !r.passed);
	if (failedTests.length > 0) {
		console.log('\n❌ TESTS FALLIDOS:');
		failedTests.forEach(test => {
			console.log(`  ${test.id}: ${test.name}`);
			console.log(
				`    Esperado: ${test.expected}, Recibido: ${test.actual.status}`
			);
			if (test.actual.error) {
				console.log(`    Error: ${test.actual.error}`);
			}
		});
	}

	// Generar reporte JSON
	const report = {
		timestamp: new Date().toISOString(),
		summary,
		testResults: results
	};

	const reportFilename = `test-properties-basic-report-${
		new Date().toISOString().split('T')[0]
	}.json`;
	fs.writeFileSync(reportFilename, JSON.stringify(report, null, 2));

	console.log(`\n📄 Reporte guardado en: ${reportFilename}`);

	return report;
}

// ============================
// EJECUCIÓN PRINCIPAL
// ============================

if (require.main === module) {
	console.log('🏃‍♂️ Iniciando tests de propiedades básicas...');

	// Verificar que el backend local esté funcionando
	if (CONFIG.USE_LOCAL_BACKEND) {
		console.log('🔧 Usando backend local:', CONFIG.LOCAL_BACKEND_URL);
	}

	runAllTests()
		.then(report => {
			console.log('\n✅ Tests completados');
			if (report.summary.passedTests === report.summary.totalTests) {
				console.log('🎉 ¡Todos los tests pasaron!');
				process.exit(0);
			} else {
				console.log(
					'⚠️  Algunos tests fallaron. Revisar el reporte para más detalles.'
				);
				process.exit(1);
			}
		})
		.catch(error => {
			console.error('💥 Error fatal:', error);
			process.exit(1);
		});
}

module.exports = {
	runAllTests,
	runPropertyTest,
	PROPERTY_TESTS
};
