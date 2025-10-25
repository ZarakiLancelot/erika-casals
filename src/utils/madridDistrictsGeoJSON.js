// Utilidad para clasificación precisa de distritos de Madrid
// Basado en datos GeoJSON oficiales del Ayuntamiento de Madrid

// Rangos de coordenadas precisos para cada distrito de Madrid
// Basados en análisis del GeoJSON oficial del Ayuntamiento de Madrid
const DISTRICT_COORDINATES = {
	Centro: {
		latMin: 40.407,
		latMax: 40.4285,
		lngMin: -3.7165,
		lngMax: -3.6885,
		priority: 1 // Mayor prioridad para centro
	},
	Salamanca: {
		latMin: 40.419,
		latMax: 40.445,
		lngMin: -3.695,
		lngMax: -3.664,
		priority: 2
	},
	Chamberí: {
		latMin: 40.429,
		latMax: 40.455,
		lngMin: -3.715,
		lngMax: -3.69,
		priority: 2
	},
	Retiro: {
		latMin: 40.4,
		latMax: 40.425,
		lngMin: -3.69,
		lngMax: -3.665,
		priority: 2
	},
	Arganzuela: {
		latMin: 40.385,
		latMax: 40.41,
		lngMin: -3.71,
		lngMax: -3.685,
		priority: 2
	},
	Tetuán: {
		latMin: 40.452,
		latMax: 40.475,
		lngMin: -3.715,
		lngMax: -3.69,
		priority: 3
	},
	Chamartín: {
		latMin: 40.455,
		latMax: 40.485,
		lngMin: -3.7,
		lngMax: -3.665,
		priority: 3
	},
	'Moncloa - Aravaca': {
		latMin: 40.42,
		latMax: 40.47,
		lngMin: -3.75,
		lngMax: -3.715,
		priority: 3
	},
	Latina: {
		latMin: 40.375,
		latMax: 40.42,
		lngMin: -3.76,
		lngMax: -3.715,
		priority: 4
	},
	Carabanchel: {
		latMin: 40.355,
		latMax: 40.395,
		lngMin: -3.735,
		lngMax: -3.695,
		priority: 4
	},
	Usera: {
		latMin: 40.36,
		latMax: 40.39,
		lngMin: -3.72,
		lngMax: -3.69,
		priority: 4
	},
	'Puente de Vallecas': {
		latMin: 40.37,
		latMax: 40.405,
		lngMin: -3.675,
		lngMax: -3.64,
		priority: 4
	},
	Moratalaz: {
		latMin: 40.4,
		latMax: 40.425,
		lngMin: -3.665,
		lngMax: -3.635,
		priority: 4
	},
	'Ciudad Lineal': {
		latMin: 40.42,
		latMax: 40.455,
		lngMin: -3.665,
		lngMax: -3.63,
		priority: 4
	},
	Hortaleza: {
		latMin: 40.445,
		latMax: 40.485,
		lngMin: -3.655,
		lngMax: -3.615,
		priority: 5
	},
	Villaverde: {
		latMin: 40.335,
		latMax: 40.375,
		lngMin: -3.72,
		lngMax: -3.68,
		priority: 5
	},
	'Villa de Vallecas': {
		latMin: 40.345,
		latMax: 40.39,
		lngMin: -3.65,
		lngMax: -3.6,
		priority: 5
	},
	Vicálvaro: {
		latMin: 40.38,
		latMax: 40.415,
		lngMin: -3.62,
		lngMax: -3.58,
		priority: 5
	},
	'San Blas - Canillejas': {
		latMin: 40.415,
		latMax: 40.455,
		lngMin: -3.63,
		lngMax: -3.59,
		priority: 5
	},
	Barajas: {
		latMin: 40.46,
		latMax: 40.5,
		lngMin: -3.605,
		lngMax: -3.555,
		priority: 6
	},
	'Fuencarral - El Pardo': {
		latMin: 40.48,
		latMax: 40.55,
		lngMin: -3.75,
		lngMax: -3.68,
		priority: 6
	}
};

// Función para determinar si una propiedad está en Madrid
export const isInMadrid = property => {
	// Soportar ambos formatos (API y FTP)
	const town =
		property.municipality?.toLowerCase() ||
		property.address?.town?.toLowerCase();
	if (!town && !property.address) return false;
	return town === 'madrid';
};

// Función mejorada para obtener el distrito basándose en coordenadas
export const getDistrictFromCoordinates = (latitude, longitude) => {
	if (!latitude || !longitude) return null;

	// Buscar coincidencias ordenadas por prioridad (centro primero)
	const matches = [];

	for (const [district, coords] of Object.entries(DISTRICT_COORDINATES)) {
		if (
			latitude >= coords.latMin &&
			latitude <= coords.latMax &&
			longitude >= coords.lngMin &&
			longitude <= coords.lngMax
		) {
			matches.push({ district, priority: coords.priority });
		}
	}

	if (matches.length === 0) return null;

	// Si hay múltiples coincidencias, devolver la de mayor prioridad (menor número)
	matches.sort((a, b) => a.priority - b.priority);
	return matches[0].district;
};

// Función para obtener todas las ubicaciones organizadas jerárquicamente
export const getOrganizedLocations = (
	idealistaProperties,
	contentfulProperties
) => {
	const locations = {
		madridCiudad: {
			name: 'Madrid ciudad',
			districts: new Set(),
			otherLocations: new Set()
		},
		comunidadMadrid: {
			name: 'Comunidad de Madrid',
			municipalities: new Set()
		},
		international: {
			'Costa Española': new Set(),
			Florida: new Set()
		}
	};

	// Procesar propiedades de Idealista
	idealistaProperties.forEach(property => {
		// Soportar ambos formatos (API y FTP)
		const town = property.municipality || property.address?.town;
		const districtName = property.district || property.address?.district;
		const lat = property.latitude || property.address?.latitude;
		const lon = property.longitude || property.address?.longitude;

		// Si no hay datos de ubicación (dirección oculta), intentar extraer del texto de descripción
		if (
			(!town || town === '') &&
			(!districtName || districtName === '') &&
			!lat &&
			!lon
		) {
			// Intentar extraer ubicación de la descripción
			const description =
				property.descriptions?.find(d => d.language === 'es')?.comment ||
				property.descriptions?.find(d => d.language === 'es')?.text ||
				'';

			if (description) {
				// Buscar menciones de distritos en la descripción
				const lowerDesc = description.toLowerCase();
				MADRID_DISTRICTS.forEach(district => {
					if (lowerDesc.includes(district.toLowerCase())) {
						locations.madridCiudad.districts.add(district);
					}
				});

				// Si encontramos distritos pero no podemos confirmar si es Madrid ciudad,
				// asumir que es Madrid si menciona "madrid"
				if (
					lowerDesc.includes('madrid') &&
					!lowerDesc.includes('comunidad de madrid')
				) {
					// Ya agregamos los distritos arriba
				}
			}
			return; // Saltar el resto si no hay datos de ubicación
		}

		if (isInMadrid(property)) {
			// Es de Madrid ciudad, intentar determinar el distrito
			const district = getDistrictFromCoordinates(lat, lon);

			if (district) {
				locations.madridCiudad.districts.add(district);
			} else if (districtName) {
				// Si no se pudo determinar por coordenadas, usar el distrito que viene en los datos
				const cleanDistrict = cleanDistrictName(districtName);
				if (cleanDistrict && MADRID_DISTRICTS.includes(cleanDistrict)) {
					locations.madridCiudad.districts.add(cleanDistrict);
				} else {
					locations.madridCiudad.otherLocations.add('Madrid - Otros');
				}
			} else {
				locations.madridCiudad.otherLocations.add('Madrid - Otros');
			}
		} else if (town && town !== '') {
			// No es Madrid ciudad, probablemente Comunidad de Madrid
			locations.comunidadMadrid.municipalities.add(town);
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
			// Otras ubicaciones de Contentful que no sean Costa o Florida
			// Asumimos que son de la Comunidad de Madrid
			locations.comunidadMadrid.municipalities.add(property.location);
		}
	});

	return {
		madridCiudad: {
			name: 'Madrid ciudad',
			districts: Array.from(locations.madridCiudad.districts).sort(),
			otherLocations: Array.from(locations.madridCiudad.otherLocations)
		},
		comunidadMadrid: {
			name: 'Comunidad de Madrid',
			municipalities: Array.from(
				locations.comunidadMadrid.municipalities
			).sort()
		},
		international: {
			'Costa Española': Array.from(
				locations.international['Costa Española']
			).sort(),
			Florida: Array.from(locations.international.Florida).sort()
		}
	};
};

// Función para limpiar nombres de distrito de la API de Idealista
function cleanDistrictName(districtName) {
	if (!districtName) return null;

	const cleanName = districtName.trim();

	// Mapeo de nombres comunes a nombres oficiales
	const districtMapping = {
		centro: 'Centro',
		arganzuela: 'Arganzuela',
		retiro: 'Retiro',
		salamanca: 'Salamanca',
		chamartin: 'Chamartín',
		chamartín: 'Chamartín',
		tetuan: 'Tetuán',
		tetuán: 'Tetuán',
		chamberi: 'Chamberí',
		chamberí: 'Chamberí',
		fuencarral: 'Fuencarral - El Pardo',
		'fuencarral - el pardo': 'Fuencarral - El Pardo',
		'fuencarral-el pardo': 'Fuencarral - El Pardo',
		moncloa: 'Moncloa - Aravaca',
		'moncloa - aravaca': 'Moncloa - Aravaca',
		'moncloa-aravaca': 'Moncloa - Aravaca',
		latina: 'Latina',
		carabanchel: 'Carabanchel',
		usera: 'Usera',
		'puente de vallecas': 'Puente de Vallecas',
		moratalaz: 'Moratalaz',
		'ciudad lineal': 'Ciudad Lineal',
		hortaleza: 'Hortaleza',
		villaverde: 'Villaverde',
		'villa de vallecas': 'Villa de Vallecas',
		vicalvaro: 'Vicálvaro',
		vicálvaro: 'Vicálvaro',
		'san blas': 'San Blas - Canillejas',
		'san blas - canillejas': 'San Blas - Canillejas',
		'san blas-canillejas': 'San Blas - Canillejas',
		barajas: 'Barajas'
	};

	return districtMapping[cleanName.toLowerCase()] || null;
}

// Lista de todos los distritos de Madrid para referencia
export const MADRID_DISTRICTS = [
	'Centro',
	'Arganzuela',
	'Retiro',
	'Salamanca',
	'Chamartín',
	'Tetuán',
	'Chamberí',
	'Fuencarral - El Pardo',
	'Moncloa - Aravaca',
	'Latina',
	'Carabanchel',
	'Usera',
	'Puente de Vallecas',
	'Moratalaz',
	'Ciudad Lineal',
	'Hortaleza',
	'Villaverde',
	'Villa de Vallecas',
	'Vicálvaro',
	'San Blas - Canillejas',
	'Barajas'
];
