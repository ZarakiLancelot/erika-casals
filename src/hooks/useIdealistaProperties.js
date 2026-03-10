import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE = 'https://api.erikacasals.com/api.php';
const NUMAGENCIA = '13731';

// ─── Mapeo de tipos Inmovilla → formato interno ───────────────────────────────
const TIPO_MAP = {
	Piso: 'flat',
	Apartamento: 'flat',
	Estudio: 'studio',
	Loft: 'loft',
	'Ático': 'penthouse',
	Atico: 'penthouse',
	'Dúplex': 'duplex',
	Duplex: 'duplex',
	'Casa / Chalet': 'house',
	Casa: 'house',
	Chalet: 'house',
	'Villa / Chalet': 'house',
	Adosado: 'house',
	Local: 'premises',
	Oficina: 'office',
	Garaje: 'garage',
	Trastero: 'storage',
	Terreno: 'land',
	'Nave industrial': 'warehouse',
	Nave: 'warehouse',
	Edificio: 'building'
};

// ─── Construir URLs de imágenes ───────────────────────────────────────────────
function buildImages(codOfer, numFotos, fotoBase) {
	if (numFotos && numFotos > 0) {
		return Array.from({ length: numFotos }, (_, i) => ({
			url: `https://fotos15.apinmo.com/${NUMAGENCIA}/${codOfer}/${i + 1}-1.jpg`,
			id: `${codOfer}-${i + 1}`,
			position: i + 1
		}));
	}
	if (fotoBase) {
		return [{ url: fotoBase, id: `${codOfer}-1`, position: 1 }];
	}
	return [];
}

// ─── Transformar un item de paginación Inmovilla al formato interno ──────────
function transformInmovillaItem(item) {
	if (!item || !item.cod_ofer) return null;

	const isRent = item.keyacci === 2;
	const price = isRent ? item.precioalq : item.precioinmo;
	const images = buildImages(item.cod_ofer, item.numfotos, item.foto);
	const description = item.observaciones || item.texto || '';

	return {
		propertyId: String(item.cod_ofer),
		source: 'inmovilla',
		price,
		operation: isRent ? 'rent' : 'sale',
		size: item.m_cons || item.m_uties || null,
		rooms: item.habitaciones || null,
		bathrooms: item.banyos || null,
		images,
		description,
		descriptions: description ? [{ language: 'es', text: description }] : [],
		propertyType: TIPO_MAP[item.nbtipo] || 'flat',
		reference: String(item.cod_ofer),
		address: {
			town: item.ciudad || 'Madrid',
			district: item.zona || '',
			latitude: item.latitud || null,
			longitude: item.altitud || null
		},
		municipality: item.ciudad || 'Madrid',
		district: item.zona || '',
		latitude: item.latitud || null,
		longitude: item.altitud || null,
		features: item.features || {}
	};
}

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
			const url = `${API_BASE}?accion=paginacion&pagina=1&por_pagina=200`;
			const response = await fetch(url);
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const result = await response.json();
			if (!result.ok) throw new Error(result.error || 'Error en la API');
			const items = (result.data?.paginacion || []).filter(
				item => item.cod_ofer !== undefined
			);
			setProperties(items.map(transformInmovillaItem).filter(Boolean));
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
			// Fallback: traer todas y buscar
			try {
				const url = `${API_BASE}?accion=paginacion&pagina=1&por_pagina=200`;
				const response = await fetch(url);
				const result = await response.json();
				const items = (result.data?.paginacion || []).filter(
					i => i.cod_ofer !== undefined
				);
				const found = items.find(i => String(i.cod_ofer) === String(propertyId));
				if (found) {
					const property = transformInmovillaItem(found);
					setSelectedProperty(property);
					return property;
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

	// Las imágenes ya vienen en el objeto; esta función es para compatibilidad
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
		if (!property) return 'Precio no disponible';

		if (property.source === 'contentful') {
			if (!property.price) return 'Precio no disponible';
			const fmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(property.price);
			return `${fmt}${property.type === 'En alquiler' ? ' / mes' : ''}`;
		}

		if (property.source === 'inmovilla' || property.source === 'idealista-ftp') {
			if (!property.price) return 'Precio no disponible';
			const fmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(property.price);
			const isRent = property.operation === 'rent' || property.operation === 'rent_to_own';
			return `${fmt}${isRent ? ' / mes' : ''}`;
		}

		// Legado Idealista API
		if (!property.operation) return 'Precio no disponible';
		const price = typeof property.operation === 'object' ? property.operation.price : property.price;
		const opType = typeof property.operation === 'string' ? property.operation : property.operation.type;
		if (!price) return 'Precio no disponible';
		const fmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
		return `${fmt}${opType === 'rent' ? ' / mes' : ''}`;
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
