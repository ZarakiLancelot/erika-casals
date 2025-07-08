import { useState, useEffect, useCallback, useMemo } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const useIdealistaProperties = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedProperty, setSelectedProperty] = useState(null);
	const [propertyImages, setPropertyImages] = useState({});
	const [filter, setFilter] = useState('all'); // 'all', 'sale', 'rent'
	// Función para obtener todas las propiedades (múltiples páginas)
	const fetchAllProperties = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			let allProperties = [];
			let currentPage = 1;
			let hasMorePages = true;

			while (hasMorePages) {
				const params = new URLSearchParams({
					page: currentPage,
					size: 100, // Obtener 100 propiedades por página
					state: 'active'
				});

				const response = await fetch(`${BACKEND_URL}/api/properties?${params}`);
				const result = await response.json();

				if (result.success && result.data) {
					const pageProperties = result.data.properties || result.data || [];
					allProperties = [...allProperties, ...pageProperties];

					// Verificar si hay más páginas
					if (result.pagination) {
						const { page, size, total } = result.pagination;
						const totalPages = Math.ceil(total / size);
						hasMorePages = page < totalPages;
					} else {
						// Si no hay información de paginación y obtuvimos menos de 100, probablemente no hay más
						hasMorePages = pageProperties.length === 100;
					}

					currentPage++;
				} else {
					hasMorePages = false;
				}
			}

			setProperties(allProperties);
		} catch (err) {
			setError('Error de conexión con el servidor');
			setProperties([]);
		} finally {
			setLoading(false);
		}
	}, []);

	// Función para obtener todas las propiedades
	const fetchProperties = useCallback(async (options = {}) => {
		setLoading(true);
		setError(null);
		try {
			const params = new URLSearchParams({
				page: options.page || 1,
				size: options.size || 100,
				state: options.state || 'active'
			});

			const response = await fetch(`${BACKEND_URL}/api/properties?${params}`);
			const result = await response.json();

			if (result.success && result.data) {
				const properties = result.data.properties || result.data || [];
				setProperties(properties);
			} else {
				setError(result.error || 'Error al cargar propiedades');
				setProperties([]);
			}
		} catch (err) {
			setError('Error de conexión con el servidor');
			setProperties([]);
		} finally {
			setLoading(false);
		}
	}, []);

	// Función para obtener una propiedad específica
	const fetchProperty = useCallback(async propertyId => {
		try {
			const response = await fetch(
				`${BACKEND_URL}/api/properties/${propertyId}`
			);
			const result = await response.json();

			if (result.success && result.data) {
				setSelectedProperty(result.data);
				return result.data;
			} else {
				throw new Error(result.error || 'Error al cargar la propiedad');
			}
		} catch (err) {
			setError('Error al cargar los detalles de la propiedad');
			return null;
		}
	}, []);

	// Función para obtener imágenes de una propiedad
	const fetchPropertyImages = useCallback(async propertyId => {
		try {
			const response = await fetch(
				`${BACKEND_URL}/api/properties/${propertyId}/images`
			);

			if (!response.ok) {
				return [];
			}

			const result = await response.json();

			if (result.success && result.data && result.data.images) {
				setPropertyImages(prev => ({
					...prev,
					[propertyId]: result.data.images
				}));
				return result.data.images;
			} else {
				return [];
			}
		} catch (err) {
			return [];
		}
	}, []);
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

		// Construir dirección de manera más completa
		let location = '';
		if (property.address) {
			const parts = [];

			// Agregar calle y número si está disponible
			if (property.address.streetName) {
				const street = property.address.streetName;
				const number = property.address.streetNumber
					? ` ${property.address.streetNumber}`
					: '';
				parts.push(`${street}${number}`);
			}

			// Agregar distrito, ciudad o pueblo
			if (property.address.district) {
				parts.push(property.address.district);
			} else if (property.address.town) {
				parts.push(property.address.town);
			} else if (property.address.city) {
				parts.push(property.address.city);
			}

			location = parts.join(', ');
		}

		// Si no hay dirección, usar un texto genérico
		if (!location) {
			location = 'Madrid';
		}

		return `${type} en ${location}`;
	}, []); // Estado derivado para las propiedades filtradas - se actualiza cuando cambia filter o properties
	const filteredProperties = useMemo(() => {
		if (filter === 'all') {
			return properties;
		}

		const filtered = properties.filter(property => {
			if (!property.operation) {
				return false;
			}

			const isMatch = property.operation.type === filter;
			return isMatch;
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

		// Para propiedades de Idealista, usar la estructura operation
		if (!property.operation) return 'Precio no disponible';

		const { price, type } = property.operation;

		const formattedPrice = new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(price || 0);

		return `${formattedPrice}${type === 'rent' ? ' / mes' : ''}`;
	}, []);

	// Test de conexión con el backend
	const testConnection = useCallback(async () => {
		try {
			const response = await fetch(`${BACKEND_URL}/api/status`);
			const result = await response.json();
			return result.status === 'ok';
		} catch (err) {
			return false;
		}
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
		testConnection,

		// Utilidades
		formatPrice,
		getPropertyMainImage,
		getPropertyTitle
	};
};
