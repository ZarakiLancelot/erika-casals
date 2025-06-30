import { createClient } from 'contentful';

// Verificar si las variables de entorno están configuradas
const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const environment = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';

// Configuración del cliente de Contentful solo si las credenciales están disponibles
let client = null;

if (spaceId && accessToken) {
	client = createClient({
		space: spaceId,
		accessToken,
		
		environment
	});
}

// Función para obtener todas las propiedades
export const getProperties = async (type = null) => {
	try {
		// Verificar si las variables de entorno están configuradas
		if (!client) {
			console.warn('Contentful no está configurado. Usando datos de prueba.');
			return getMockProperties(type);
		}
		const query = {
			content_type: 'category',
			order: '-sys.createdAt',
			include: 2 // Para incluir las referencias de imágenes
		};

		// Filtrar por tipo si se especifica
		if (type) {
			query['fields.type'] = type;
		}
		const response = await client.getEntries(query);

		return response.items.map(item => ({
			id: item.sys.id,
			title: item.fields.title,
			description:
				item.fields.description?.content?.[0]?.content?.[0]?.value ||
				'Descripción no disponible',
			price: item.fields.price,
			location: item.fields.location
				? `${item.fields.location.lat}, ${item.fields.location.lon}`
				: 'Ubicación no disponible',
			type: item.fields.type,
			propertyType: item.fields.propertyType,
			rooms: item.fields.rooms,
			bathrooms: item.fields.bathrooms,
			size: item.fields.size,
			features: item.fields.features || [],
			images:
				item.fields.images?.map(image => ({
					url: image.fields?.file?.url || '',
					title: image.fields?.title || '',
					width: image.fields?.file?.details?.image?.width || 800,
					height: image.fields?.file?.details?.image?.height || 600
				})) || [],
			featured: item.fields.featured || false,
			status: item.fields.status || 'available',
			createdAt: item.sys.createdAt,
			updatedAt: item.sys.updatedAt,
			source: 'contentful'
		}));
	} catch (error) {
		console.error('Error fetching properties from Contentful:', error);
		console.warn('Fallback: Usando datos de prueba.');
		return getMockProperties(type);
	}
};

// Función para obtener una propiedad específica
export const getProperty = async id => {
	try {
		if (!client) {
			console.warn('Contentful no está configurado.');
			return null;
		}

		const response = await client.getEntry(id);
		return {
			id: response.sys.id,
			title: response.fields.title,
			description:
				response.fields.description?.content?.[0]?.content?.[0]?.value ||
				'Descripción no disponible',
			price: response.fields.price,
			location: response.fields.location
				? `${response.fields.location.lat}, ${response.fields.location.lon}`
				: 'Ubicación no disponible',
			type: response.fields.type,
			propertyType: response.fields.propertyType,
			rooms: response.fields.rooms,
			bathrooms: response.fields.bathrooms,
			size: response.fields.size,
			features: response.fields.features || [],
			images:
				response.fields.images?.map(image => ({
					url: image.fields?.file?.url || '',
					title: image.fields?.title || '',
					width: image.fields?.file?.details?.image?.width || 800,
					height: image.fields?.file?.details?.image?.height || 600
				})) || [],
			featured: response.fields.featured || false,
			status: response.fields.status || 'available',
			createdAt: response.sys.createdAt,
			updatedAt: response.sys.updatedAt,
			source: 'contentful'
		};
	} catch (error) {
		console.error('Error fetching property from Contentful:', error);
		return null;
	}
};

// Función para obtener propiedades destacadas
// Función para obtener propiedades destacadas
export const getFeaturedProperties = async () => {
	try {
		if (!client) {
			console.warn('Contentful no está configurado. Usando datos de prueba.');
			return getMockProperties().filter(property => property.featured);
		}
		const response = await client.getEntries({
			content_type: 'category',
			'fields.featured': true,
			order: '-sys.createdAt',
			include: 2 // Para incluir las referencias de imágenes
		});
		return response.items.map(item => ({
			id: item.sys.id,
			title: item.fields.title,
			description:
				item.fields.description?.content?.[0]?.content?.[0]?.value ||
				'Descripción no disponible',
			price: item.fields.price,
			location: item.fields.location
				? `${item.fields.location.lat}, ${item.fields.location.lon}`
				: 'Ubicación no disponible',
			type: item.fields.type,
			propertyType: item.fields.propertyType,
			rooms: item.fields.rooms,
			bathrooms: item.fields.bathrooms,
			size: item.fields.size,
			features: item.fields.features || [],
			images:
				item.fields.images?.map(image => ({
					url: image.fields?.file?.url || '',
					title: image.fields?.title || '',
					width: image.fields?.file?.details?.image?.width || 800,
					height: image.fields?.file?.details?.image?.height || 600
				})) || [],
			featured: item.fields.featured || false,
			status: item.fields.status || 'available',
			createdAt: item.sys.createdAt,
			updatedAt: item.sys.updatedAt,
			source: 'contentful'
		}));
	} catch (error) {
		console.error('Error fetching featured properties from Contentful:', error);
		console.warn(
			'Fallback: Usando datos de prueba para propiedades destacadas.'
		);
		return getMockProperties().filter(property => property.featured);
	}
};

// Función para propiedades de prueba cuando Contentful no está configurado
const getMockProperties = (type = null) => {
	const mockProperties = [
		{
			id: 'mock-1',
			title: 'Exclusivo Apartamento en Barcelona Centro',
			description:
				'Moderno apartamento en el corazón de Barcelona con todas las comodidades.',
			price: 450000,
			location: 'Barcelona, Eixample',
			type: 'En venta',
			propertyType: 'Apartamento',
			rooms: 3,
			bathrooms: 2,
			size: 95,
			features: ['Terraza', 'Aire acondicionado', 'Parking', 'Ascensor'],
			images: [
				{
					url: '/images/home-image-1.png',
					title: 'Vista principal',
					width: 800,
					height: 600
				}
			],
			featured: true,
			status: 'available',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			source: 'contentful'
		},
		{
			id: 'mock-2',
			title: 'Villa Exclusiva en Costa Brava',
			description:
				'Impresionante villa con vistas al mar en la prestigiosa Costa Brava.',
			price: 850000,
			location: 'Lloret de Mar, Girona',
			type: 'En venta',
			propertyType: 'Villa',
			rooms: 5,
			bathrooms: 4,
			size: 280,
			features: ['Piscina', 'Jardín', 'Vista al mar', 'Garaje', 'Zona BBQ'],
			images: [
				{
					url: '/images/home-image-2.png',
					title: 'Villa exterior',
					width: 800,
					height: 600
				}
			],
			featured: true,
			status: 'available',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			source: 'contentful'
		},
		{
			id: 'mock-3',
			title: 'Penthouse de Alquiler en Madrid',
			description:
				'Lujoso penthouse con terraza panorámica en el centro de Madrid.',
			price: 3500,
			location: 'Madrid, Salamanca',
			type: 'En alquiler',
			propertyType: 'Penthouse',
			rooms: 4,
			bathrooms: 3,
			size: 180,
			features: ['Terraza 100m²', 'Jacuzzi', 'Domótica', 'Parking doble'],
			images: [
				{
					url: '/images/home-image-3.png',
					title: 'Penthouse terraza',
					width: 800,
					height: 600
				}
			],
			featured: false,
			status: 'available',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			source: 'contentful'
		},
		{
			id: 'mock-4',
			title: 'Apartamento de Alquiler en Valencia',
			description: 'Acogedor apartamento cerca de la playa con vistas al mar.',
			price: 1200,
			location: 'Valencia, Malvarosa',
			type: 'En alquiler',
			propertyType: 'Apartamento',
			rooms: 2,
			bathrooms: 1,
			size: 70,
			features: ['Vista al mar', 'Balcón', 'Cerca de la playa'],
			images: [
				{
					url: '/images/home-image-4.png',
					title: 'Apartamento Valencia',
					width: 800,
					height: 600
				}
			],
			featured: true,
			status: 'available',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			source: 'contentful'
		}
	];
	// Filtrar por tipo si se especifica
	if (type) {
		return mockProperties.filter(property => property.type === type);
	}
	return mockProperties;
};

// Funciones específicas para propiedades de venta y alquiler
export const getSaleProperties = async () => {
	return await getProperties('En venta');
};

export const getRentProperties = async () => {
	return await getProperties('En alquiler');
};

export { client };
export default {
	getProperties,
	getProperty,
	getFeaturedProperties,
	getSaleProperties,
	getRentProperties
};
