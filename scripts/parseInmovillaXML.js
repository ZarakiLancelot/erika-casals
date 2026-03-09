const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

/**
 * Parser para convertir el XML de Inmovilla al formato interno de la aplicación.
 * El formato de salida es idéntico al de parseIdealistaXML.js para que el resto
 * de la app (hooks, componentes) funcione sin cambios.
 *
 * Estructura XML de Inmovilla:
 *   <propiedades>
 *     <propiedad>
 *       <id>, <numagencia>, <accion> (Vender/Alquilar), <precioinmo>, <precioalq>
 *       <tipo_ofer>, <ciudad>, <zona>, <cp>, <latitud>, <altitud>
 *       <habitaciones>, <habdobles>, <banyos>, <aseos>
 *       <m_uties>, <m_cons>, <descrip1>, <titulo1>
 *       <numfotos>, <foto1>...<fotoN>
 *       <ref>, <ascensor>, <aire_con>, <terraza>, <piscina_com>, etc.
 *     </propiedad>
 *   </propiedades>
 */
class InmovillaXMLParser {
	constructor() {
		this.parser = new xml2js.Parser({ explicitArray: true });
	}

	/**
	 * Lee y parsea el archivo XML de Inmovilla
	 */
	async parseXMLFile(filePath) {
		try {
			const xmlContent = fs.readFileSync(filePath, 'utf8');
			const result = await this.parser.parseStringPromise(xmlContent);

			if (!result.propiedades || !result.propiedades.propiedad) {
				throw new Error('Formato XML de Inmovilla inválido: falta <propiedades> o <propiedad>');
			}

			return this.transformProperties(result.propiedades.propiedad);
		} catch (error) {
			console.error('Error parseando XML de Inmovilla:', error);
			throw error;
		}
	}

	/**
	 * Parsea desde string (útil cuando el XML se descarga en memoria)
	 */
	async parseXMLString(xmlContent) {
		try {
			const result = await this.parser.parseStringPromise(xmlContent);

			if (!result.propiedades || !result.propiedades.propiedad) {
				throw new Error('Formato XML de Inmovilla inválido');
			}

			return this.transformProperties(result.propiedades.propiedad);
		} catch (error) {
			console.error('Error parseando XML de Inmovilla:', error);
			throw error;
		}
	}

	/**
	 * Transforma el array de propiedades del XML
	 */
	transformProperties(propiedades) {
		return propiedades
			.map(p => this.transformProperty(p))
			.filter(p => p !== null);
	}

	/**
	 * Transforma una propiedad individual al formato interno
	 */
	transformProperty(p) {
		try {
			const get = (field) => { const v = p[field]?.[0]; return (v === null || v === undefined) ? '' : String(v).trim(); };
			const getNum = (field) => parseFloat(get(field)) || 0;
			const getBool = (field) => get(field) === '1';

			// --- Operación y precio ---
			const accion = get('accion'); // "Vender" | "Alquilar"
			let operation = 'sale';
			let price = 0;

			if (accion === 'Alquilar') {
				operation = 'rent';
				price = Math.round(getNum('precioalq'));
			} else {
				operation = 'sale';
				price = Math.round(getNum('precioinmo'));
			}

			// Precio 0 es inválido — omitir propiedad
			if (price === 0) return null;

			// --- Imágenes ---
			const numFotos = parseInt(get('numfotos')) || 0;
			const images = [];
			for (let i = 1; i <= numFotos; i++) {
				const url = get(`foto${i}`);
				if (url) {
					images.push({
						url,
						tag: i === 1 ? 'MAIN' : 'OTHER',
						isPrimary: i === 1
					});
				}
			}

			// --- Descripción: limpiar separadores ~ de Inmovilla ---
			const rawDescription = get('descrip1').replace(/~/g, '\n').trim();
			const titulo = get('titulo1').replace(/~/g, ' ').trim();

			// --- Dirección ---
			const ciudad = get('ciudad');
			const zona = get('zona');
			const cp = get('cp');
			const displayAddress = [zona, ciudad, cp].filter(Boolean).join(', ');

			return {
				// Identificadores
				propertyId: get('id'),
				reference: get('ref') || get('id'),
				numagencia: get('numagencia'),

				// Operación
				operation,
				price,
				currency: 'EUR',

				// Tipo de propiedad
				propertyType: this.mapTipoOfer(get('tipo_ofer')),
				size: Math.round(getNum('m_uties')) || Math.round(getNum('m_cons')),
				rooms: parseInt(get('habdobles')) + parseInt(get('habitaciones') || 0),
				bathrooms: parseInt(get('banyos')) + parseInt(get('aseos') || 0),
				floor: get('numplanta') || '',

				// Ubicación
				address: displayAddress,
				addressVisibility: zona ? 'show_address' : 'hidden_address',
				municipality: ciudad,
				district: zona,
				neighborhood: zona,
				latitude: getNum('latitud'),
				longitude: getNum('altitud'), // En el XML de Inmovilla <altitud> es la longitud

				// Descripción
				title: titulo,
				descriptions: [
					{
						language: 'es',
						comment: rawDescription
					}
				],

				// Características
				features: {
					hasLift: getBool('ascensor'),
					hasAirConditioning: getBool('aire_con'),
					hasWardrobe: getBool('arma_empo'),
					hasTerrace: getBool('terraza'),
					hasGarden: getBool('patio'),
					hasSwimmingPool: getBool('piscina_com') || getBool('piscina_prop'),
					parkingAvailable: getBool('parking') || getBool('plaza_gara'),
					hasBalcony: getBool('balcon'),
					furnished: getBool('muebles'),
					hasHeating: getBool('calefaccion'),
					energyRating: get('energialetra')
				},

				// Multimedia
				images,
				thumbnail: images[0]?.url || null,

				// Metadata
				constructionYear: get('antiguedad') || '',
				conservacion: get('conservacion'),
				communityCosts: Math.round(getNum('gastos_com')),
				highlighted: get('destacado') === '1',
				state: 'active',

				// Fuente — para distinguir de Idealista si es necesario
				source: 'inmovilla'
			};
		} catch (err) {
			console.error(`Error transformando propiedad id=${p?.id?.[0]}:`, err.message);
			return null;
		}
	}

	/**
	 * Mapea tipo_ofer de Inmovilla al tipo interno
	 */
	mapTipoOfer(tipo) {
		const map = {
			'Piso': 'home',
			'Casa': 'chalet',
			'Chalet': 'chalet',
			'Adosado': 'chalet',
			'Apartamento': 'home',
			'Ático': 'home',
			'Atico': 'home',
			'Local': 'office',
			'Oficina': 'office',
			'Garaje': 'garage',
			'Solar': 'land',
			'Nave': 'warehouse',
			'Finca': 'countryhouse',
			'Villa': 'chalet',
			'Estudio': 'home',
			'Dúplex': 'home',
			'Duplex': 'home',
			'Loft': 'home'
		};
		return map[tipo] || 'home';
	}

	/**
	 * Guarda propiedades al formato JSON que espera el frontend
	 */
	saveToJSON(properties, outputPath) {
		const output = {
			success: true,
			source: 'inmovilla',
			generatedAt: new Date().toISOString(),
			data: {
				total: properties.length,
				properties
			}
		};

		fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
		console.log(`  💾 Guardado: ${outputPath} (${properties.length} propiedades)`);
	}
}

module.exports = InmovillaXMLParser;
