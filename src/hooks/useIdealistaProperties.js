import { useState, useEffect, useCallback, useMemo } from 'react';

const STATIC_JSON = '/inmovilla-properties-all.json';

// ─── Hook principal ───────────────────────────────────────────────────────────
export const useIdealistaProperties = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedProperty, setSelectedProperty] = useState(null);
	const [propertyImages, setPropertyImages] = useState({});
	const [filter, setFilter] = useState('all');

	const fetchAllProperties = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(STATIC_JSON);
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const data = await response.json();
			setProperties(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error('Error cargando propiedades Inmovilla:', err);
			setError('Error cargando propiedades');
			setProperties([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchProperties = useCallback(
		async (_options = {}) => fetchAllProperties(),
		[fetchAllProperties]
	);

	const fetchProperty = useCallback(
		async propertyId => {
			// Buscar en las ya cargadas
			if (properties.length > 0) {
				const found = properties.find(p => p.propertyId === String(propertyId));
				if (found) {
					setSelectedProperty(found);
					return found;
				}
			}
			// Fallback: cargar el JSON estático y buscar en él
			try {
				const response = await fetch(STATIC_JSON);
				const data = await response.json();
				const found = (Array.isArray(data) ? data : []).find(
					p => p.propertyId === String(propertyId)
				);
				if (found) {
					setSelectedProperty(found);
					return found;
				}
				return null;
			} catch (err) {
				console.error('Error al cargar la propiedad:', err);
				setError('Error al cargar los detalles de la propiedad');
				return null;
			}
		},
		[properties]
	);

	const fetchPropertyImages = useCallback(
		async propertyId => {
			const property = properties.find(p => p.propertyId === String(propertyId));
			if (!property) return [];
			const images = property.images || [];
			setPropertyImages(prev => ({ ...prev, [propertyId]: images }));
			return images;
		},
		[properties]
	);

	const getPropertyMainImage = useCallback(
		propertyId => {
			if (!propertyId) return null;
			const cached = propertyImages[propertyId];
			if (cached && cached.length > 0) return cached[0].url;
			const property = properties.find(p => p.propertyId === String(propertyId));
			return property?.images?.[0]?.url || null;
		},
		[propertyImages, properties]
	);

	const getPropertyTitle = useCallback(property => {
		if (!property) return 'Propiedad';
		const typeMap = {
			flat: 'Piso', house: 'Casa', penthouse: 'Ático', duplex: 'Dúplex',
			studio: 'Estudio', loft: 'Loft', premises: 'Local', office: 'Oficina',
			garage: 'Garaje', storage: 'Trastero', land: 'Terreno',
			warehouse: 'Nave industrial', building: 'Edificio'
		};
		const type = typeMap[property.propertyType] || 'Propiedad';
		const location = property.district || property.address?.district || property.municipality || 'Madrid';
		return `${type} en ${location}`;
	}, []);

	const formatPrice = useCallback(property => {
		if (!property?.price) return 'Precio no disponible';
		const fmt = new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(property.price);

		if (property.source === 'contentful') {
			return `${fmt}${property.type === 'En alquiler' ? ' / mes' : ''}`;
		}

		const isRent = property.operation === 'rent' || property.operation === 'rent_to_own';
		return `${fmt}${isRent ? ' / mes' : ''}`;
	}, []);

	const filteredProperties = useMemo(() => {
		if (filter === 'all') return properties;
		return properties.filter(p => {
			const op = typeof p.operation === 'string' ? p.operation : p.operation?.type;
			return op === filter;
		});
	}, [properties, filter]);

	useEffect(() => {
		fetchAllProperties();
	}, [fetchAllProperties]);

	return {
		properties: filteredProperties,
		loading,
		error,
		selectedProperty,
		propertyImages,
		filter,
		fetchProperties,
		fetchAllProperties,
		fetchProperty,
		fetchPropertyImages,
		setSelectedProperty,
		setFilter,
		formatPrice,
		getPropertyMainImage,
		getPropertyTitle
	};
};
