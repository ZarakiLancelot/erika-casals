import { useState, useEffect, useCallback } from 'react';
import { mockProperties } from '../data/mockProperties';

// Servicio para conectar con nuestro backend
class BackendPropertyService {
	constructor() {
		this.backendURL =
			import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
	}

	async getAllProperties(options = {}) {
		try {
			const params = new URLSearchParams({
				page: options.page || 1,
				size: options.size || 100,
				state: options.state || 'active'
			});

			const response = await fetch(
				`${this.backendURL}/api/properties?${params}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			if (response.ok) {
				const result = await response.json();
				return result;
			} else {
				const errorText = await response.text();
				throw new Error(`Backend error: ${response.status} - ${errorText}`);
			}
		} catch (error) {
			console.error('Error obteniendo propiedades desde backend:', error);
			throw error;
		}
	}

	async testBackendConnection() {
		try {
			const response = await fetch(`${this.backendURL}/api/status`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.ok;
		} catch (error) {
			console.error('Backend no disponible:', error);
			return false;
		}
	}
}

export const useBackendProperties = (operation = 'all') => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [usingMockData, setUsingMockData] = useState(false);
	const [backendService] = useState(new BackendPropertyService());

	const loadMockProperties = useCallback(() => {
		console.log('📦 Cargando datos de prueba...');
		setUsingMockData(true);

		// Simular delay de API
		setTimeout(() => {
			let filteredProperties = mockProperties;

			if (operation === 'sale') {
				filteredProperties = mockProperties.filter(p => p.operation === 'sale');
			} else if (operation === 'rent') {
				filteredProperties = mockProperties.filter(p => p.operation === 'rent');
			}

			setProperties(filteredProperties);
			setLoading(false);
		}, 1000);
	}, [operation]);
	const transformIdealistaToMockFormat = idealistaProperty => {
		// Transformar el formato de Idealista al formato que espera nuestro componente
		const address = idealistaProperty.address || {};
		const operation = idealistaProperty.operation || {};
		const features = idealistaProperty.features || {};
		const descriptions = idealistaProperty.descriptions || [];

		// Obtener la descripción en español o la primera disponible
		const description =
			descriptions.find(desc => desc.language === 'es')?.text ||
			descriptions[0]?.text ||
			'Descripción no disponible';

		// Formatear la dirección
		const formattedAddress =
			[
				address.streetName,
				address.streetNumber,
				address.town,
				address.postalCode
			]
				.filter(Boolean)
				.join(', ') || 'Dirección no disponible';
		// Formatear las características de manera más legible
		const formattedFeatures = [];
		if (features.areaConstructed)
			formattedFeatures.push(`${features.areaConstructed} m² construidos`);
		if (features.energyCertificateRating)
			formattedFeatures.push(
				`Eficiencia energética: ${features.energyCertificateRating}`
			);
		if (features.liftAvailable) formattedFeatures.push('Ascensor');
		if (features.conditionedAir) formattedFeatures.push('Aire acondicionado');
		if (features.parkingAvailable) formattedFeatures.push('Parking');
		if (features.pool) formattedFeatures.push('Piscina');
		if (features.garden) formattedFeatures.push('Jardín');
		if (features.terrace) formattedFeatures.push('Terraza');
		if (features.balcony) formattedFeatures.push('Balcón');
		if (features.wardrobes) formattedFeatures.push('Armarios empotrados');
		if (features.storage) formattedFeatures.push('Trastero');
		if (address.floor) formattedFeatures.push(`Planta ${address.floor}`);
		return {
			id: idealistaProperty.propertyId || idealistaProperty.id,
			title: `${
				idealistaProperty.type === 'flat'
					? 'Piso'
					: idealistaProperty.type === 'house'
					? 'Casa'
					: idealistaProperty.type === 'commercial'
					? 'Local comercial'
					: 'Propiedad'
			} en ${address.town || 'Madrid'}`,
			operation: operation.type === 'sale' ? 'sale' : 'rent',
			price: operation.price || 0,
			size: features.areaConstructed || 0,
			rooms: features.rooms || 0,
			bathrooms: features.bathroomNumber || 0,
			address: formattedAddress,
			description,
			images: ['https://via.placeholder.com/800x600?text=Sin+Imagen'],
			features: formattedFeatures,
			coordinates:
				address.latitude && address.longitude
					? {
							latitude: address.latitude,
							longitude: address.longitude
					  }
					: null,
			contact: {
				name: 'Erika Casals',
				phone: '+34 666 777 888',
				email: 'erika@example.com'
			},
			// Campos adicionales específicos de Idealista
			propertyType: idealistaProperty.type,
			reference: idealistaProperty.reference,
			floor: address.floor,
			energyRating: features.energyCertificateRating,
			hasElevator: features.liftAvailable,
			hasAirConditioning: features.conditionedAir,
			hasParking: features.parkingAvailable,
			hasPool: features.pool,
			hasGarden: features.garden,
			hasTerrace: features.terrace,
			hasBalcony: features.balcony
		};
	};

	const loadBackendProperties = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			setUsingMockData(false);

			console.log('🌐 Verificando conexión con backend...');

			// Verificar si el backend está disponible
			const backendAvailable = await backendService.testBackendConnection();

			if (!backendAvailable) {
				console.warn('⚠️ Backend no disponible, usando datos de prueba');
				loadMockProperties();
				return;
			}

			console.log('🏠 Obteniendo propiedades desde backend...');

			const result = await backendService.getAllProperties({ size: 50 });

			console.log('📊 Respuesta del backend:', result);
			console.log('📊 Estructura de datos:', result.data);

			if (result.success && result.data) {
				let properties = [];

				// Estructura real de la API: data.properties
				if (result.data.properties && Array.isArray(result.data.properties)) {
					console.log('📋 Transformando datos de la API real...');
					properties = result.data.properties.map(
						transformIdealistaToMockFormat
					);
				} else if (
					result.data.elementList &&
					Array.isArray(result.data.elementList)
				) {
					// Estructura alternativa: data.elementList
					console.log('📋 Transformando datos de Idealista...');
					properties = result.data.elementList.map(
						transformIdealistaToMockFormat
					);
				} else if (Array.isArray(result.data)) {
					// Si recibimos array directo
					console.log('📋 Transformando array directo...');
					properties = result.data.map(transformIdealistaToMockFormat);
				} else {
					console.warn('⚠️ Estructura de datos no reconocida:', result.data);
				}

				// Filtrar por operación si es necesario
				if (operation === 'sale') {
					properties = properties.filter(p => p.operation === 'sale');
				} else if (operation === 'rent') {
					properties = properties.filter(p => p.operation === 'rent');
				}

				if (properties.length === 0) {
					console.warn(
						'⚠️ No se encontraron propiedades, usando datos de prueba'
					);
					loadMockProperties();
					return;
				}

				console.log(
					`✅ ${properties.length} propiedades cargadas desde backend`
				);
				setProperties(properties);
			} else {
				console.warn(
					'⚠️ Backend no devolvió datos válidos, usando datos de prueba'
				);
				loadMockProperties();
			}
		} catch (err) {
			console.error('❌ Error cargando propiedades desde backend:', err);
			console.warn('⚠️ Fallback a datos de prueba');
			setError(`Error conectando con backend: ${err.message}`);
			loadMockProperties();
			return;
		} finally {
			setLoading(false);
		}
	}, [operation, backendService, loadMockProperties]);

	useEffect(() => {
		loadBackendProperties();
	}, [loadBackendProperties]);

	const refreshProperties = useCallback(() => {
		loadBackendProperties();
	}, [loadBackendProperties]);

	return {
		properties,
		loading,
		error,
		refreshProperties,
		usingMockData,
		backendService
	};
};
