// Distritos de Madrid basados en los datos oficiales
export const MADRID_DISTRICTS = [
	{ id: '079601', name: 'Centro' },
	{ id: '079602', name: 'Arganzuela' },
	{ id: '079603', name: 'Retiro' },
	{ id: '079604', name: 'Salamanca' },
	{ id: '079605', name: 'Chamartín' },
	{ id: '079606', name: 'Tetuán' },
	{ id: '079607', name: 'Chamberí' },
	{ id: '079608', name: 'Fuencarral-El Pardo' },
	{ id: '079609', name: 'Moncloa-Aravaca' },
	{ id: '079610', name: 'Latina' },
	{ id: '079611', name: 'Carabanchel' },
	{ id: '079612', name: 'Usera' },
	{ id: '079613', name: 'Puente de Vallecas' },
	{ id: '079614', name: 'Moratalaz' },
	{ id: '079615', name: 'Ciudad Lineal' },
	{ id: '079616', name: 'Hortaleza' },
	{ id: '079617', name: 'Villaverde' },
	{ id: '079618', name: 'Villa de Vallecas' },
	{ id: '079619', name: 'Vicálvaro' },
	{ id: '079620', name: 'San Blas-Canillejas' },
	{ id: '079621', name: 'Barajas' }
];

// Función para determinar si una propiedad está en Madrid
export const isInMadrid = property => {
	if (!property.address) return false;
	return property.address.town?.toLowerCase() === 'madrid';
};

// Función para obtener el distrito aproximado basándose en coordenadas
// Esta es una aproximación inicial, se puede refinar con más datos
export const getDistrictFromCoordinates = (latitude, longitude) => {
	if (!latitude || !longitude) return null;

	// Rangos aproximados de coordenadas para algunos distritos principales
	const districtRanges = {
		Centro: { latMin: 40.408, latMax: 40.428, lngMin: -3.716, lngMax: -3.689 },
		Salamanca: {
			latMin: 40.425,
			latMax: 40.445,
			lngMin: -3.695,
			lngMax: -3.665
		},
		Chamberí: { latMin: 40.435, latMax: 40.455, lngMin: -3.715, lngMax: -3.69 },
		Retiro: { latMin: 40.405, latMax: 40.425, lngMin: -3.69, lngMax: -3.665 },
		Arganzuela: { latMin: 40.39, latMax: 40.41, lngMin: -3.71, lngMax: -3.685 },
		Tetuán: { latMin: 40.455, latMax: 40.475, lngMin: -3.715, lngMax: -3.69 },
		Chamartín: { latMin: 40.46, latMax: 40.485, lngMin: -3.7, lngMax: -3.665 },
		'Moncloa-Aravaca': {
			latMin: 40.43,
			latMax: 40.47,
			lngMin: -3.75,
			lngMax: -3.715
		},
		Latina: { latMin: 40.38, latMax: 40.42, lngMin: -3.76, lngMax: -3.715 },
		Carabanchel: {
			latMin: 40.36,
			latMax: 40.395,
			lngMin: -3.735,
			lngMax: -3.695
		},
		Usera: { latMin: 40.365, latMax: 40.39, lngMin: -3.72, lngMax: -3.69 },
		'Puente de Vallecas': {
			latMin: 40.375,
			latMax: 40.405,
			lngMin: -3.675,
			lngMax: -3.64
		},
		Moratalaz: {
			latMin: 40.405,
			latMax: 40.425,
			lngMin: -3.665,
			lngMax: -3.635
		},
		'Ciudad Lineal': {
			latMin: 40.425,
			latMax: 40.455,
			lngMin: -3.665,
			lngMax: -3.63
		},
		Hortaleza: {
			latMin: 40.45,
			latMax: 40.485,
			lngMin: -3.655,
			lngMax: -3.615
		},
		Villaverde: { latMin: 40.34, latMax: 40.375, lngMin: -3.72, lngMax: -3.68 },
		'Villa de Vallecas': {
			latMin: 40.35,
			latMax: 40.39,
			lngMin: -3.65,
			lngMax: -3.6
		},
		Vicálvaro: { latMin: 40.385, latMax: 40.415, lngMin: -3.62, lngMax: -3.58 },
		'San Blas-Canillejas': {
			latMin: 40.42,
			latMax: 40.455,
			lngMin: -3.63,
			lngMax: -3.59
		},
		Barajas: { latMin: 40.46, latMax: 40.5, lngMin: -3.605, lngMax: -3.555 },
		'Fuencarral-El Pardo': {
			latMin: 40.485,
			latMax: 40.55,
			lngMin: -3.75,
			lngMax: -3.68
		}
	};

	// Buscar en qué distrito está la propiedad
	for (const [district, range] of Object.entries(districtRanges)) {
		if (
			latitude >= range.latMin &&
			latitude <= range.latMax &&
			longitude >= range.lngMin &&
			longitude <= range.lngMax
		) {
			return district;
		}
	}

	return null; // No se pudo determinar el distrito
};

// Función para obtener todas las ubicaciones organizadas jerárquicamente
export const getOrganizedLocations = (
	idealistaProperties,
	contentfulProperties
) => {
	const locations = {
		madrid: {
			name: 'Madrid',
			districts: new Set(),
			otherLocations: new Set()
		},
		outskirts: new Set(), // Alrededores de Madrid
		international: {
			'Costa Española': new Set(),
			Florida: new Set()
		}
	};

	// Procesar propiedades de Idealista
	idealistaProperties.forEach(property => {
		if (isInMadrid(property)) {
			// Es de Madrid, intentar determinar el distrito
			const district = getDistrictFromCoordinates(
				property.address?.latitude,
				property.address?.longitude
			);

			if (district) {
				locations.madrid.districts.add(district);
			} else if (property.address?.district) {
				// Si no se pudo determinar por coordenadas, usar el distrito que viene en la API
				locations.madrid.districts.add(property.address.district);
			} else {
				locations.madrid.otherLocations.add('Madrid - Otros');
			}
		} else if (property.address?.town) {
			// No es Madrid, probablemente alrededores
			locations.outskirts.add(property.address.town);
		}
	});

	// Procesar propiedades de Contentful
	contentfulProperties.forEach(property => {
		if (property.propertyZone === 'Costa') {
			locations.international['Costa Española'].add(
				property.location || 'Costa Española'
			);
		} else if (property.propertyZone === 'Florida') {
			locations.international.Florida.add(property.location || 'Florida');
		} else if (property.location) {
			// Otras ubicaciones de Contentful
			locations.outskirts.add(property.location);
		}
	});

	return {
		madrid: {
			name: 'Madrid',
			districts: Array.from(locations.madrid.districts).sort(),
			otherLocations: Array.from(locations.madrid.otherLocations)
		},
		outskirts: Array.from(locations.outskirts).sort(),
		international: {
			'Costa Española': Array.from(
				locations.international['Costa Española']
			).sort(),
			Florida: Array.from(locations.international.Florida).sort()
		}
	};
};
