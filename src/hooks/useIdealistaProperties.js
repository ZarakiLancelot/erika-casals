import { useState, useEffect, useCallback, useMemo } from 'react';
import {
	formatAddressByVisibility,
	shouldShowAddress
} from '../utils/addressUtils';

// NUEVO: Leer del JSON estático generado por el sistema FTP de Idealista
// El archivo se actualiza cada 8 horas mediante el script npm run update:idealista
const STATIC_JSON_PATH = '/idealista-properties.json';

export const useIdealistaProperties = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedProperty, setSelectedProperty] = useState(null);
	const [propertyImages, setPropertyImages] = useState({});
	const [filter, setFilter] = useState('all'); // 'all', 'sale', 'rent'

	// Función para obtener todas las propiedades desde el JSON estático
	const fetchAllProperties = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			// Leer del archivo JSON estático en /public
			const response = await fetch(STATIC_JSON_PATH);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (result.success && result.data) {
				const allProperties = result.data.properties || result.data || [];
				setProperties(allProperties);
			} else {
				throw new Error('Formato de datos inválido');
			}
		} catch (err) {
			console.error('Error cargando propiedades:', err);
			setError('Error cargando propiedades desde Idealista');
			setProperties([]);
		} finally {
			setLoading(false);
		}
	}, []);

	// Función para obtener todas las propiedades
	const fetchProperties = useCallback(
		async (options = {}) => {
			// Ahora simplemente redirige a fetchAllProperties ya que todo está en un archivo
			return fetchAllProperties();
		},
		[fetchAllProperties]
	);

	// Función para obtener una propiedad específica
	const fetchProperty = useCallback(
		async propertyId => {
			try {
				// Buscar en las propiedades ya cargadas
				if (properties.length > 0) {
					const property = properties.find(p => p.propertyId === propertyId);
					if (property) {
						setSelectedProperty(property);
						return property;
					}
				}

				// Si no están cargadas, cargarlas primero
				const response = await fetch(STATIC_JSON_PATH);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result = await response.json();
				if (result.success && result.data) {
					const allProperties = result.data.properties || [];
					const property = allProperties.find(p => p.propertyId === propertyId);

					if (property) {
						setSelectedProperty(property);
						return property;
					}
				}

				throw new Error('Propiedad no encontrada');
			} catch (err) {
				console.error('Error al cargar la propiedad:', err);
				setError('Error al cargar los detalles de la propiedad');
				return null;
			}
		},
		[properties]
	);

	// Función para obtener imágenes de una propiedad
	const fetchPropertyImages = useCallback(
		async propertyId => {
			try {
				// Las imágenes ya vienen en el JSON de la propiedad
				const property = properties.find(p => p.propertyId === propertyId);

				if (property && property.images) {
					const images = property.images.map(img => ({
						url: img.url,
						id: img.id,
						position: img.position,
						tag: img.tag || 'unknown'
					}));

					setPropertyImages(prev => ({
						...prev,
						[propertyId]: images
					}));

					return images;
				}

				// Si no está en properties, intentar cargar del JSON
				const response = await fetch(STATIC_JSON_PATH);
				if (!response.ok) {
					return [];
				}

				const result = await response.json();
				if (result.success && result.data) {
					const allProperties = result.data.properties || [];
					const foundProperty = allProperties.find(
						p => p.propertyId === propertyId
					);

					if (foundProperty && foundProperty.images) {
						const images = foundProperty.images.map(img => ({
							url: img.url,
							id: img.id,
							position: img.position,
							tag: img.tag || 'unknown'
						}));

						setPropertyImages(prev => ({
							...prev,
							[propertyId]: images
						}));

						return images;
					}
				}

				return [];
			} catch (err) {
				console.error('Error al cargar imágenes:', err);
				return [];
			}
		},
		[properties]
	);
	// Función para obtener la primera imagen de una propiedad para el grid
	const getPropertyMainImage = useCallback(
		propertyId => {
			if (!propertyId) return null;
			const images = propertyImages[propertyId];
			if (images && images.length > 0) {
				return images[0].url || images[0].link;
			}
			return null; // Retorna null si no hay imagen, para usar placeholder
		},
		[propertyImages]
	);

	// Función para generar título informativo de la propiedad
	const getPropertyTitle = useCallback(property => {
		if (!property) return 'Propiedad';

		// Traducir el tipo de propiedad
		const propertyTypeMap = {
			flat: 'Piso',
			house: 'Casa',
			commercial: 'Local comercial',
			garage: 'Plaza de garaje',
			land: 'Terreno',
			office: 'Oficina',
			premises: 'Local',
			store: 'Local comercial',
			warehouse: 'Nave industrial'
		};

		// Usar propertyType o type según esté disponible
		const propertyType = property.propertyType || property.type || 'flat';
		const type = propertyTypeMap[propertyType] || 'Propiedad';

		// Construir dirección respetando la configuración de visibilidad
		let location = '';
		if (property.address && shouldShowAddress(property.address)) {
			location = formatAddressByVisibility(property.address);
		} else if (property.address) {
			// Si no se puede mostrar la dirección completa, mostrar solo distrito/zona
			const district = property.address.district;
			const town = property.address.town;

			if (district && town) {
				location = `${district}, ${town}`;
			} else if (town) {
				location = town;
			} else if (district) {
				location = district;
			}
		}

		// Si no hay dirección, usar un texto genérico
		if (!location) {
			location = 'Madrid';
		}

		return `${type} en calle ${location}`;
	}, []);

	// Estado derivado para las propiedades filtradas - se actualiza cuando cambia filter o properties
	const filteredProperties = useMemo(() => {
		if (filter === 'all') {
			return properties;
		}

		const filtered = properties.filter(property => {
			if (!property.operation) {
				return false;
			}

			// Soportar tanto el formato nuevo (string) como el antiguo (objeto)
			const operationType =
				typeof property.operation === 'string'
					? property.operation
					: property.operation.type;

			return operationType === filter;
		});

		return filtered;
	}, [properties, filter]);

	// Función para formatear precio
	const formatPrice = useCallback(property => {
		if (!property) return 'Precio no disponible';

		// Para propiedades de Contentful, el precio está directamente en property.price
		if (property.source === 'contentful') {
			if (!property.price) return 'Precio no disponible';

			const formattedPrice = new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			}).format(property.price);

			// Determinar si es alquiler por el tipo
			const isRent = property.type === 'En alquiler';
			return `${formattedPrice}${isRent ? ' / mes' : ''}`;
		}

		// Para propiedades de Inmovilla XML (mismo formato que idealista-ftp)
		if (property.source === 'inmovilla') {
			if (!property.price) return 'Precio no disponible';
			const formattedPrice = new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			}).format(property.price);
			const isRent = property.operation === 'rent';
			return `${formattedPrice}${isRent ? ' / mes' : ''}`;
		}

		// Para propiedades de Idealista FTP (nuevo formato)
		if (property.source === 'idealista-ftp') {
			if (!property.price) return 'Precio no disponible';

			const formattedPrice = new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			}).format(property.price);

			// operation es un string: 'sale', 'rent', 'rent_to_own'
			const isRent =
				property.operation === 'rent' || property.operation === 'rent_to_own';
			return `${formattedPrice}${isRent ? ' / mes' : ''}`;
		}

		// Para propiedades de Idealista API (formato antiguo con objeto operation)
		if (!property.operation) return 'Precio no disponible';

		// Soportar tanto formato string como objeto
		const price =
			typeof property.operation === 'object'
				? property.operation.price
				: property.price;
		const operationType =
			typeof property.operation === 'string'
				? property.operation
				: property.operation.type;

		if (!price) return 'Precio no disponible';

		const formattedPrice = new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(price);

		return `${formattedPrice}${operationType === 'rent' ? ' / mes' : ''}`;
	}, []);

	// Cargar propiedades al montar el componente
	useEffect(() => {
		fetchAllProperties(); // Usar la nueva función que carga todas las propiedades
	}, [fetchAllProperties]);

	return {
		// Estado
		properties: filteredProperties,
		loading,
		error,
		selectedProperty,
		propertyImages,
		filter,
		// Acciones
		fetchProperties,
		fetchAllProperties, // Nueva función para cargar todas las propiedades
		fetchProperty,
		fetchPropertyImages,
		setSelectedProperty,
		setFilter,

		// Utilidades
		formatPrice,
		getPropertyMainImage,
		getPropertyTitle
	};
};
