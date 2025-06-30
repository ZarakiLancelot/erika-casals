// =================================
// BACKEND PARA PARTNERS API - Node.js + Express
// USANDO DOCUMENTACIÓN OFICIAL OpenAPI
// =================================

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // npm install node-fetch@2
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// =================================
// IDEALISTA PARTNERS API SERVICE - VERSIÓN OFICIAL
// =================================

class IdealistaPartnersService {
	constructor() {
		// Credenciales del correo
		this.clientId = process.env.IDEALISTA_CLIENT_ID || 'wow';
		this.clientSecret =
			process.env.IDEALISTA_CLIENT_SECRET || 'JhD6oblLrNlOBwU8ney2Gx1nunwsh2Qy';

		this.feedKey =
			process.env.IDEALISTA_FEED_KEY ||
			'ilcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

		// URLs oficiales
		this.sandboxURL = 'https://partners-sandbox.idealista.com';
		this.productionURL = 'https://partners.idealista.com';
		this.baseURL =
			process.env.NODE_ENV === 'production'
				? this.productionURL
				: this.sandboxURL;

		this.token = null;
		this.tokenExpiry = null;
	}

	// OAuth2 según documentación oficial
	async getOAuth2Token() {
		if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
			return this.token;
		}

		try {
			console.log('🔑 Obteniendo token OAuth2...');

			// Encoding según documentación: base64(clientId:clientSecret)
			const credentials = Buffer.from(
				`${this.clientId}:${this.clientSecret}`
			).toString('base64');

			const response = await fetch(`${this.baseURL}/oauth/token`, {
				method: 'POST',
				headers: {
					Authorization: `Basic ${credentials}`,
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
				},
				body: 'grant_type=client_credentials&scope=read'
			});

			if (response.ok) {
				const data = await response.json();
				this.token = data.access_token;
				this.tokenExpiry = Date.now() + data.expires_in * 1000;
				console.log(
					'✅ Token OAuth2 obtenido:',
					data.token_type,
					'expires in',
					data.expires_in,
					'seconds'
				);
				return this.token;
			} else {
				const errorText = await response.text();
				throw new Error(`Error OAuth2: ${response.status} - ${errorText}`);
			}
		} catch (error) {
			console.error('❌ Error OAuth2:', error.message);
			throw error;
		}
	}

	// Headers oficiales según documentación
	async getApiHeaders() {
		const token = await this.getOAuth2Token();

		return {
			feedKey: this.feedKey,
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		};
	}

	// ENDPOINT OFICIAL: GET /v1/properties
	async getAllProperties(options = {}) {
		try {
			console.log('🔍 Obteniendo propiedades con API oficial...');

			const headers = await this.getApiHeaders();

			const params = {
				page: options.page || 1,
				size: options.size || 100, // Máximo 100 según docs
				state: options.state || 'active' // active, inactive, pending
			};

			const queryString = new URLSearchParams(params).toString();
			const endpoint = `/v1/properties?${queryString}`;

			console.log(`📡 Consultando: ${this.baseURL}${endpoint}`);
			console.log('📋 Headers:', {
				feedKey: this.feedKey.substring(0, 10) + '...',
				Authorization:
					'Bearer ' +
					(this.token ? this.token.substring(0, 10) + '...' : 'null')
			});

			const response = await fetch(`${this.baseURL}${endpoint}`, {
				method: 'GET',
				headers
			});

			console.log(`📊 Respuesta: ${response.status} - ${response.statusText}`);
			if (response.ok) {
				const data = await response.json();
				console.log(`✅ Propiedades obtenidas:`, data);

				return {
					success: true,
					data,
					pagination: {
						page: params.page,
						size: params.size,
						totalElements: data.totalElements || 0,
						totalPages: data.totalPages || 0
					},
					timestamp: new Date().toISOString()
				};
			} else {
				const errorText = await response.text();
				console.log(`❌ Error ${response.status}:`, errorText);
				console.log(
					`🔄 Usando datos de fallback debido a error del servidor...`
				);

				// Fallback con datos de prueba cuando la API falla
				return {
					success: true,
					data: mockProperties,
					pagination: {
						page: params.page,
						size: params.size,
						totalElements: mockProperties.totalElements,
						totalPages: mockProperties.totalPages
					},
					timestamp: new Date().toISOString(),
					fallback: true,
					originalError: `HTTP ${response.status}: ${response.statusText}`
				};
			}
		} catch (error) {
			console.error('❌ Error general:', error);
			return {
				success: false,
				error: error.message
			};
		}
	}

	// ENDPOINT OFICIAL: GET /v1/properties/{propertyId}
	async getPropertyById(propertyId) {
		try {
			console.log(`🔍 Obteniendo propiedad ${propertyId}...`);

			const headers = await this.getApiHeaders();
			const endpoint = `/v1/properties/${propertyId}`;

			const response = await fetch(`${this.baseURL}${endpoint}`, {
				method: 'GET',
				headers
			});

			if (response.ok) {
				const data = await response.json();
				return {
					success: true,
					data,
					timestamp: new Date().toISOString()
				};
			} else {
				const errorText = await response.text();
				return {
					success: false,
					error: `HTTP ${response.status}: ${response.statusText}`,
					details: errorText
				};
			}
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	}

	// ENDPOINT OFICIAL: GET /v1/contacts
	async getAllContacts(options = {}) {
		try {
			console.log('👥 Obteniendo contactos...');

			const headers = await this.getApiHeaders();

			const params = {
				page: options.page || 1,
				size: options.size || 100
			};

			const queryString = new URLSearchParams(params).toString();
			const endpoint = `/v1/contacts?${queryString}`;

			const response = await fetch(`${this.baseURL}${endpoint}`, {
				method: 'GET',
				headers
			});

			if (response.ok) {
				const data = await response.json();
				return {
					success: true,
					data,
					timestamp: new Date().toISOString()
				};
			} else {
				const errorText = await response.text();
				return {
					success: false,
					error: `HTTP ${response.status}: ${response.statusText}`,
					details: errorText
				};
			}
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	}

	// ENDPOINT OFICIAL: GET /v1/customer/publishinfo
	async getPublishInfo() {
		try {
			console.log('📊 Obteniendo información de publicación...');

			const headers = await this.getApiHeaders();
			const endpoint = '/v1/customer/publishinfo';

			const response = await fetch(`${this.baseURL}${endpoint}`, {
				method: 'GET',
				headers
			});

			if (response.ok) {
				const data = await response.json();
				return {
					success: true,
					data,
					timestamp: new Date().toISOString()
				};
			} else {
				const errorText = await response.text();
				return {
					success: false,
					error: `HTTP ${response.status}: ${response.statusText}`,
					details: errorText
				};
			}
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	}

	// GET /api/properties/:id/images - Obtener imágenes de una propiedad
	async getPropertyImages(propertyId) {
		try {
			console.log(`🖼️ Obteniendo imágenes de propiedad ${propertyId}...`);

			const headers = await this.getApiHeaders();
			const endpoint = `/v1/properties/${propertyId}/images`;

			const response = await fetch(`${this.baseURL}${endpoint}`, {
				method: 'GET',
				headers
			});
			if (response.ok) {
				const data = await response.json();
				console.log(`✅ Imágenes obtenidas:`, data);
				return {
					success: true,
					data
				};
			} else {
				const errorText = await response.text();
				console.error(
					`❌ Error obteniendo imágenes: ${response.status} - ${errorText}`
				);
				console.log(`🔄 Usando imágenes de fallback...`);

				// Fallback con imágenes de prueba
				return {
					success: true,
					data: mockImages,
					fallback: true,
					originalError: `HTTP ${response.status}: ${errorText}`
				};
			}
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	}

	// Test de conectividad mejorado
	async testConnection() {
		try {
			console.log('🧪 Probando conectividad con API oficial...');

			// Test 1: OAuth2 token
			const tokenTest = await this.getOAuth2Token();

			// Test 2: Endpoint básico con headers
			const headers = await this.getApiHeaders();

			const tests = [
				{
					name: 'OAuth2 Token',
					success: !!tokenTest,
					details: tokenTest
						? 'Token obtenido correctamente'
						: 'Error obteniendo token'
				}
			];

			// Test 3: Endpoint de información de publicación (más básico)
			try {
				const publishInfo = await this.getPublishInfo();
				tests.push({
					name: 'Customer Publish Info',
					success: publishInfo.success,
					details: publishInfo.success
						? 'Endpoint responde'
						: publishInfo.error,
					data: publishInfo.data
				});
			} catch (error) {
				tests.push({
					name: 'Customer Publish Info',
					success: false,
					details: error.message
				});
			}

			return {
				success: true,
				baseURL: this.baseURL,
				feedKey: this.feedKey.substring(0, 10) + '...',
				clientId: this.clientId,
				tests,
				timestamp: new Date().toISOString()
			};
		} catch (error) {
			return {
				success: false,
				error: error.message,
				timestamp: new Date().toISOString()
			};
		}
	}
}

// Instancia del servicio
const idealistaService = new IdealistaPartnersService();

// =================================
// ENDPOINTS DE LA API
// =================================

// GET /api/test - Test de conectividad
app.get('/api/test', async (req, res) => {
	try {
		const result = await idealistaService.testConnection();
		res.json(result);
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message
		});
	}
});

// GET /api/properties - Obtener todas las propiedades
app.get('/api/properties', async (req, res) => {
	try {
		const options = {
			page: parseInt(req.query.page) || 1,
			size: parseInt(req.query.size) || 100,
			state: req.query.state || 'active'
		};

		const result = await idealistaService.getAllProperties(options);
		res.json(result);
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message
		});
	}
});

// GET /api/properties/:id - Obtener propiedad específica
app.get('/api/properties/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await idealistaService.getPropertyById(id);
		res.json(result);
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message
		});
	}
});

// GET /api/contacts - Obtener contactos
app.get('/api/contacts', async (req, res) => {
	try {
		const options = {
			page: parseInt(req.query.page) || 1,
			size: parseInt(req.query.size) || 100
		};

		const result = await idealistaService.getAllContacts(options);
		res.json(result);
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message
		});
	}
});

// GET /api/publish-info - Información de publicación
app.get('/api/publish-info', async (req, res) => {
	try {
		const result = await idealistaService.getPublishInfo();
		res.json(result);
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message
		});
	}
});

// GET /api/sandbox-status - Verificar si sandbox está disponible
app.get('/api/sandbox-status', async (req, res) => {
	try {
		const headers = await idealistaService.getApiHeaders();

		const response = await fetch(
			`${idealistaService.baseURL}/v1/customer/publishinfo`,
			{
				method: 'GET',
				headers
			}
		);

		const status = {
			available: response.status !== 503,
			status: response.status,
			statusText: response.statusText,
			timestamp: new Date().toISOString(),
			message:
				response.status === 503
					? 'Sandbox en mantenimiento. Intenta más tarde.'
					: response.ok
					? 'Sandbox disponible'
					: 'Sandbox responde pero con errores'
		};

		res.json(status);
	} catch (error) {
		res.status(500).json({
			available: false,
			error: error.message,
			timestamp: new Date().toISOString()
		});
	}
});

// GET /api/status - Estado del servicio
app.get('/api/status', (req, res) => {
	res.json({
		status: 'ok',
		environment: process.env.NODE_ENV || 'development',
		idealista_env: idealistaService.baseURL.includes('sandbox')
			? 'sandbox'
			: 'production',
		feedKey: idealistaService.feedKey
			? idealistaService.feedKey.substring(0, 10) + '...'
			: 'not configured',
		endpoints: {
			properties: '/api/properties',
			contacts: '/api/contacts',
			publishInfo: '/api/publish-info',
			test: '/api/test'
		},
		timestamp: new Date().toISOString()
	});
});

// GET /api/properties/:id/images - Obtener imágenes de una propiedad
app.get('/api/properties/:id/images', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await idealistaService.getPropertyImages(id);
		res.json(result);
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message
		});
	}
});

// =================================
// MANEJO DE ERRORES
// =================================

app.use((error, req, res, next) => {
	console.error('Error del servidor:', error);
	res.status(500).json({
		success: false,
		error: 'Error interno del servidor'
	});
});

// =================================
// SERVIDOR
// =================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log('🚀 Servidor iniciado en puerto', PORT);
	console.log('🧪 Entorno:', process.env.NODE_ENV || 'development');
	console.log('🔗 Idealista URL:', idealistaService.baseURL);
	console.log(
		'🔑 Feed Key:',
		idealistaService.feedKey
			? idealistaService.feedKey.substring(0, 10) + '...'
			: 'NO CONFIGURADO'
	);
	console.log('📋 Endpoints disponibles:');
	console.log('  GET /api/status - Estado del servicio');
	console.log('  GET /api/test - Test de conectividad');
	console.log('  GET /api/sandbox-status - Estado del sandbox');
	console.log('  GET /api/properties - Obtener propiedades');
	console.log('  GET /api/properties/:id - Obtener propiedad específica');
	console.log(
		'  GET /api/properties/:id/images - Obtener imágenes de propiedad'
	);
	console.log('  GET /api/contacts - Obtener contactos');
	console.log('  GET /api/publish-info - Información de publicación');

	if (!idealistaService.feedKey || idealistaService.feedKey.includes('xxx')) {
		console.log('⚠️  IMPORTANTE: Configura el IDEALISTA_FEED_KEY en el .env');
	}
});

// =================================
// DATOS DE PRUEBA (FALLBACK)
// =================================

const mockProperties = {
	properties: [
		{
			propertyId: 'mock-001',
			operation: { type: 'sale', price: 450000 },
			address: {
				streetName: 'Calle de Alcalá',
				district: 'Centro',
				city: 'Madrid'
			},
			propertyType: 'flat',
			size: 120,
			rooms: 3,
			bathrooms: 2,
			description:
				'Piso moderno en el centro de Madrid con todas las comodidades',
			features: ['terraza', 'ascensor', 'calefacción'],
			state: 'active'
		},
		{
			propertyId: 'mock-002',
			operation: { type: 'rent', price: 1800 },
			address: { streetName: 'Gran Vía', district: 'Centro', city: 'Madrid' },
			propertyType: 'flat',
			size: 85,
			rooms: 2,
			bathrooms: 1,
			description: 'Apartamento céntrico ideal para alquiler',
			features: ['aire acondicionado', 'amueblado'],
			state: 'active'
		},
		{
			propertyId: 'mock-003',
			operation: { type: 'sale', price: 320000 },
			address: {
				streetName: 'Calle Serrano',
				district: 'Salamanca',
				city: 'Madrid'
			},
			propertyType: 'flat',
			size: 95,
			rooms: 2,
			bathrooms: 2,
			description: 'Piso reformado en zona premium',
			features: ['parking', 'trastero', 'portero'],
			state: 'active'
		},
		{
			propertyId: 'mock-004',
			operation: { type: 'rent', price: 2200 },
			address: {
				streetName: 'Paseo de la Castellana',
				district: 'Chamberí',
				city: 'Madrid'
			},
			propertyType: 'flat',
			size: 140,
			rooms: 4,
			bathrooms: 3,
			description: 'Amplio piso familiar en zona residencial',
			features: ['terraza', 'garaje', 'jardín comunitario'],
			state: 'active'
		}
	],
	totalElements: 4,
	totalPages: 1
};

const mockImages = {
	images: [
		{ url: '/images/home-image-1.png', description: 'Salón principal' },
		{ url: '/images/home-image-2.png', description: 'Cocina moderna' },
		{ url: '/images/home-image-3.png', description: 'Dormitorio principal' }
	]
};
