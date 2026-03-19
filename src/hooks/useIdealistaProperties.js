import { useState, useEffect, useCallback, useMemo } from 'react';

const STATIC_JSON = '/inmovilla-properties-all.json';
const API_BASE = 'https://api.erikacasals.com/api.php';
const NUMAGENCIA = '13731';

const TIPO_MAP = {
	Piso: 'flat', Apartamento: 'flat', Estudio: 'studio', Loft: 'loft',
	'Ático': 'penthouse', Atico: 'penthouse', 'Dúplex': 'duplex', Duplex: 'duplex',
	'Casa / Chalet': 'house', Casa: 'house', Chalet: 'house',
	'Villa / Chalet': 'house', Adosado: 'house',
	Local: 'premises', 'Local comercial': 'premises',
	Oficina: 'office', Garaje: 'garage', Trastero: 'storage',
	Terreno: 'land', 'Terreno urbano': 'land',
	'Nave industrial': 'warehouse', Nave: 'warehouse', Edificio: 'building'
};

function transformPaginationItem(item, description = '') {
	if (!item?.cod_ofer) return null;
	const isRent = item.keyacci === 2;
	const fotoletra = item.fotoletra || 1;
	const numFotos = item.numfotos || 0;
	const images = numFotos > 0
		? Array.from({ length: numFotos }, (_, i) => ({
				url: `https://fotos15.apinmo.com/${NUMAGENCIA}/${item.cod_ofer}/${fotoletra}-${i + 1}.jpg`,
				id: `${item.cod_ofer}-${fotoletra}-${i + 1}`,
				position: i + 1
			}))
		: item.foto ? [{ url: item.foto, id: `${item.cod_ofer}-1`, position: 1 }] : [];

	return {
		propertyId: String(item.cod_ofer),
		source: 'inmovilla',
		price: isRent ? item.precioalq : item.precioinmo,
		operation: isRent ? 'rent' : 'sale',
		size: item.m_cons || item.m_uties || null,
		rooms: item.habitaciones || null,
		bathrooms: item.banyos || null,
		images,
		description,
		descriptions: description ? [{ language: 'es', text: description }] : [],
		propertyType: TIPO_MAP[item.nbtipo] || 'flat',
		reference: item.ref || String(item.cod_ofer),
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
		features: {
			liftAvailable: item.ascensor === 1,
			terrace: item.terraza === 1,
			conditionedAir: item.aire_con === 1,
			balcony: item.balcon === 1,
			parkingAvailable: item.plaza_gara === 1 || item.parking === 1,
			pool: item.piscina_com === 1 || item.piscina_prop === 1,
			storage: item.trastero === 1,
		}
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

		// ── 1. Cargar JSON estático primero (instantáneo desde CDN) ──────────
		const descriptionCache = new Map();
		try {
			const res = await fetch(STATIC_JSON);
			if (res.ok) {
				const data = await res.json();
				const list = Array.isArray(data) ? data : (data.properties || []);
				// Mostrar inmediatamente mientras llega la API
				setProperties(list);
				// Guardar descripciones en caché
				for (const p of list) {
					descriptionCache.set(p.propertyId, p.description || '');
				}
			}
		} catch { /* sin JSON, continuar */ }

		// ── 2. Fetch fresco desde la API (2 llamadas en paralelo) ────────────
		try {
			const [res1, res2] = await Promise.all([
				fetch(`${API_BASE}?accion=paginacion&pagina=1&por_pagina=50`),
				fetch(`${API_BASE}?accion=paginacion&pagina=51&por_pagina=50`)
			]);

			const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

			const items1 = (data1.data?.paginacion || []).filter(i => i.cod_ofer !== undefined);
			const items2 = (data2.data?.paginacion || []).filter(i => i.cod_ofer !== undefined);

			const freshProperties = [...items1, ...items2]
				.map(item => transformPaginationItem(
					item,
					descriptionCache.get(String(item.cod_ofer)) || ''
				))
				.filter(Boolean);

			if (freshProperties.length > 0) {
				setProperties(freshProperties);
			}
		} catch {
			// API caída — seguimos mostrando el JSON estático
			if (descriptionCache.size === 0) {
				setError('Error cargando propiedades');
			}
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
			if (properties.length > 0) {
				const found = properties.find(p => p.propertyId === String(propertyId));
				if (found) { setSelectedProperty(found); return found; }
			}
			// Fallback: buscar en JSON estático
			try {
				const res = await fetch(STATIC_JSON);
				const data = await res.json();
				const list = Array.isArray(data) ? data : (data.properties || []);
				const found = list.find(p => p.propertyId === String(propertyId));
				if (found) { setSelectedProperty(found); return found; }
			} catch { /* ignorar */ }
			return null;
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
			style: 'currency', currency: 'EUR',
			minimumFractionDigits: 0, maximumFractionDigits: 0
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
