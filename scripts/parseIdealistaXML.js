const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

/**
 * Parser para convertir el XML de Idealista al formato que usa la aplicación
 * Basado en la documentación oficial de Idealista (XML-JSON de idealista/tools)
 *
 * IMPORTANTE:
 * - El fichero se actualiza cada 8 horas en el FTP
 * - Todos los enumerados empiezan en 0
 * - Usa myAddress (tus anuncios) o listingAddress (otros anuncios)
 */
class IdealistaXMLParser {
	constructor() {
		this.parser = new xml2js.Parser();

		// Enums según documentación oficial (todos empiezan en 0)
		this.enums = {
			Operation: ['sale', 'rent', 'rent_to_own'],
			TypologyType: [
				'home',
				'chalet',
				'countryhouse',
				'garage',
				'office',
				'warehouse',
				'room',
				'land',
				'vacational',
				'new_development',
				'custom_ad',
				'storageroom',
				'building'
			],
			AddressVisibility: ['show_address', 'only_street_name', 'hidden_address'],
			State: ['new', 'pending', 'active', 'inactive', 'error'],
			BuiltType: [
				'new_development',
				'new_development_in_construction',
				'new_development_finished',
				'second_hand_to_be_restored',
				'second_hand_good_condition'
			]
		};
	}

	/**
	 * Lee y parsea el archivo XML
	 */
	async parseXMLFile(filePath) {
		try {
			const xmlContent = fs.readFileSync(filePath, 'utf8');
			const result = await this.parser.parseStringPromise(xmlContent);

			if (!result.ads || !result.ads.ad) {
				throw new Error('Formato XML inválido');
			}

			return this.transformProperties(result.ads.ad);
		} catch (error) {
			console.error('Error parseando XML:', error);
			throw error;
		}
	}

	/**
	 * Transforma las propiedades del XML al formato de la aplicación
	 */
	transformProperties(ads) {
		return ads.map(ad => this.transformProperty(ad));
	}

	/**
	 * Transforma una propiedad individual
	 */
	transformProperty(ad) {
		const property = ad.property?.[0];
		const housing = property?.housing?.[0];
		const prices = ad.prices?.[0]?.byOperation?.[0];
		const multimedias = ad.multimedias?.[0];

		// Determinar operación usando enum (0=SALE, 1=RENT, 2=RENT_TO_OWN)
		let operation = 'sale';
		let price = 0;

		if (prices?.SALE?.[0]?.price?.[0]) {
			operation = this.enums.Operation[0]; // 'sale'
			price = parseInt(prices.SALE[0].price[0]);
		} else if (prices?.RENT?.[0]?.price?.[0]) {
			operation = this.enums.Operation[1]; // 'rent'
			price = parseInt(prices.RENT[0].price[0]);
		}

		// Extraer descripción en español (Language enum: 0=SPANISH, 1=ENGLISH, etc)
		const comments = ad.comments?.[0]?.adComments || [];
		const esComment = comments.find(c => c.language?.[0] === '0');
		const description = esComment?.propertyComment?.[0] || '';

		// Imágenes con multimediaTag (enum MultimediaTag)
		const images = this.extractImages(multimedias);

		// Tours 3D (añadido 29 mayo 2023)
		const tours3D = this.extract3DTours(multimedias);

		// Dirección: usar myAddress (anuncios propios) o listingAddress (otros)
		const myAddress = ad.myAddress?.[0];
		const listingAddress = ad.listingAddress?.[0];
		const location = ad.location?.[0]; // Sacado de address según actualización 5 ago 2024

		const addressInfo = this.extractAddress(myAddress, listingAddress);
		const coordinates = addressInfo.coordinates;

		// Zona geográfica (LEVEL7=distrito, LEVEL8=barrio)
		const zones = location?.zones?.[0]?.zones?.[0];
		const district = zones?.LEVEL7?.[0]?.name?.[0] || '';
		const neighborhood = zones?.LEVEL8?.[0]?.name?.[0] || '';

		// Timestamps en milisegundos UTC (añadido en actualización)
		const modificationDate = ad.modification?.[0]
			? new Date(parseInt(ad.modification[0]))
			: null;
		const creationDate = ad.creation?.[0]
			? new Date(parseInt(ad.creation[0]))
			: null;

		return {
			propertyId: ad.id?.[0],
			reference: ad.externalReference?.[0] || ad.id?.[0],
			operation,
			price,
			currency: 'EUR',

			// Tipo de propiedad (TypologyType enum)
			propertyType: this.getPropertyType(property?.propertyType?.[0]),
			size: parseInt(housing?.propertyArea?.[0] || 0),
			rooms: parseInt(
				housing?.roomNumber?.[0] || housing?.bedroomNumber?.[0] || 0
			),
			bathrooms: parseInt(housing?.bathNumber?.[0] || 0),

			// Ubicación
			address: addressInfo.displayAddress,
			addressVisibility: addressInfo.visibility,
			municipality: zones?.LEVEL4?.[0]?.name?.[0] || '',
			district,
			neighborhood,
			latitude: coordinates.latitude,
			longitude: coordinates.longitude,

			// Descripción
			descriptions: [
				{
					language: 'es',
					comment: description
				}
			],

			// Características adicionales
			features: {
				hasLift: housing?.hasLift?.[0] === 'true',
				hasAirConditioning: housing?.hasAirConditioning?.[0] === 'true',
				hasWardrobe: housing?.hasWardrobe?.[0] === 'true',
				hasTerrace: housing?.hasTerrace?.[0] === 'true',
				hasGarden: housing?.hasGarden?.[0] === 'true',
				hasSwimmingPool: housing?.hasSwimmingPool?.[0] === 'true',
				parkingAvailable:
					housing?.parkingSpace?.[0]?.hasParkingSpace?.[0] === 'true'
			},

			// Multimedia
			images,
			tours3D,

			// Metadata
			floor: addressInfo.floorNumber,
			constructionYear: housing?.constructionYear?.[0] || '',
			energyCertification: property?.energy?.[0]?.certification?.[0] || '',
			communityCosts: parseInt(property?.communityCosts?.[0] || 0),
			builtType: this.enums.BuiltType[parseInt(housing?.builtType?.[0] || 0)],
			state: this.enums.State[parseInt(ad.state?.[0] || 2)], // 2=ACTIVE por defecto

			// Timestamps
			modificationDate: modificationDate?.toISOString(),
			creationDate: creationDate?.toISOString(),

			// Fuente
			source: 'idealista-ftp',
			status: 'active'
		};
	}

	/**
	 * Extrae las imágenes del XML con sus tags
	 */
	extractImages(multimedias) {
		if (!multimedias?.pictures) return [];

		return multimedias.pictures
			.filter(pic => pic.multimediaPath)
			.map(pic => ({
				id: pic.id?.[0],
				url: pic.multimediaPath?.[0],
				position: parseInt(pic.position?.[0] || 0),
				tag: this.getMultimediaTag(pic.multimediaTag?.[0])
			}))
			.sort((a, b) => a.position - b.position);
	}

	/**
	 * Extrae tours 3D/360 (añadido 29 mayo 2023)
	 */
	extract3DTours(multimedias) {
		if (!multimedias?.ad3DTours) return [];

		const tourTypes = ['3d', 'virtual_tour', 'nd_top_tour'];

		return multimedias.ad3DTours.map(tour => ({
			id: tour.id?.[0],
			url: tour.url?.[0],
			type: tourTypes[parseInt(tour.group?.[0] || 0)]
		}));
	}

	/**
	 * Extrae la dirección según el tipo (myAddress o listingAddress)
	 * Según actualización 5 agosto 2024
	 */
	extractAddress(myAddress, listingAddress) {
		let displayAddress = '';
		let visibility = 'hidden_address';
		let floorNumber = '';
		let coordinates = { latitude: null, longitude: null };

		if (myAddress) {
			// Anuncios propios - dirección exacta disponible
			const street = myAddress.street?.[0];
			const streetTypeId = street?.typeId?.[0];
			const streetName = street?.name?.[0] || '';
			const streetNumber = street?.number?.[0] || '';

			displayAddress = this.formatStreet(
				streetTypeId,
				streetName,
				streetNumber
			);

			if (myAddress.postalCode?.[0]) {
				displayAddress += `, ${myAddress.postalCode[0]}`;
			}

			visibility = 'show_address';
			floorNumber = myAddress.floorNumber?.[0] || '';

			const coords = myAddress.coordinates?.[0];
			coordinates = {
				latitude: coords?.latitude?.[0] ? parseFloat(coords.latitude[0]) : null,
				longitude: coords?.longitude?.[0]
					? parseFloat(coords.longitude[0])
					: null
			};
		} else if (listingAddress) {
			// Anuncios de otros - dirección pública con posibles campos ocultos
			const visibilityCode = parseInt(listingAddress.visibility?.[0] || 2);
			visibility = this.enums.AddressVisibility[visibilityCode];

			const street = listingAddress.street?.[0]?.value?.[0];
			if (street && !listingAddress.street[0].reason) {
				const streetTypeId = street.typeId?.[0];
				const streetName = street.name?.[0] || '';
				const streetNumber = street.number?.[0]?.value?.[0] || '';

				displayAddress = this.formatStreet(
					streetTypeId,
					streetName,
					visibility === 'show_address' ? streetNumber : ''
				);
			}

			const postalCode = listingAddress.postalCode?.[0]?.value?.[0];
			if (postalCode && !listingAddress.postalCode[0].reason) {
				displayAddress += `, ${postalCode}`;
			}

			floorNumber = listingAddress.floorNumber?.[0] || '';

			const coords = listingAddress.coordinates?.[0];
			coordinates = {
				latitude: coords?.latitude?.[0] ? parseFloat(coords.latitude[0]) : null,
				longitude: coords?.longitude?.[0]
					? parseFloat(coords.longitude[0])
					: null
			};
		}

		return { displayAddress, visibility, floorNumber, coordinates };
	}

	/**
	 * Formatea el nombre de la calle con su tipo
	 */
	formatStreet(typeId, name, number) {
		const streetTypes = {
			1: 'Acceso',
			2: 'Alameda',
			3: 'Alto',
			4: 'Arco',
			6: 'Autopista',
			7: 'Avenida',
			12: 'Calle',
			15: 'Callejón',
			18: 'Camino',
			24: 'Carretera',
			31: 'Paseo',
			34: 'Puente',
			36: 'Plaza',
			40: 'Rotonda',
			42: 'Travesía',
			45: 'Vía',
			47: 'Desconocida',
			51: 'Galería',
			59: 'Bulevar',
			60: 'Costanilla',
			61: 'Carril',
			62: 'Cuesta',
			63: 'Glorieta',
			64: 'Pozo',
			65: 'Prolongación',
			66: 'Puerta',
			67: 'Pasaje',
			68: 'Rambla',
			69: 'Ronda',
			70: 'Senda',
			71: 'Vereda',
			72: 'Autovía',
			73: 'Circunvalación',
			74: 'Riera',
			75: 'Impasse'
		};

		const type = streetTypes[parseInt(typeId)] || '';
		const parts = [type, name, number].filter(p => p);
		return parts.join(' ');
	}

	/**
	 * Obtiene el nombre del tag multimedia
	 */
	getMultimediaTag(tagCode) {
		const tags = [
			'unknown',
			'kitchen',
			'bathroom',
			'living_room',
			'bedroom',
			'hall',
			'corridor',
			'terrace',
			'yard',
			'facade',
			'garden',
			'views',
			'plan',
			'details',
			'flat_mates',
			'empty_parking_space',
			'used_parking_space',
			'input_output',
			'store',
			'rooms',
			'reception',
			'waiting_room',
			'office',
			'archive',
			'parking_space',
			'attic',
			'swimming_pool',
			'dining_room',
			'entrance',
			'land',
			'urban_plot',
			'surrounding_area',
			'junk_room',
			'penthouse',
			'balcony',
			'building_work',
			'press_photo',
			'studio'
		];

		return tags[parseInt(tagCode || 0)];
	}

	/**
	 * Convierte el tipo de propiedad usando TypologyType enum
	 */
	getPropertyType(typeCode) {
		const code = parseInt(typeCode || 0);
		// TypologyType enum: HOME=0, CHALET=1, COUNTRYHOUSE=2, GARAGE=3, etc.
		const typeMap = {
			0: 'flat', // HOME
			1: 'chalet', // CHALET
			2: 'country_house', // COUNTRYHOUSE
			3: 'garage', // GARAGE
			4: 'office', // OFFICE
			5: 'warehouse', // WAREHOUSE
			6: 'room', // ROOM (habitación compartida)
			7: 'land', // LAND
			8: 'vacational', // VACATIONAL
			9: 'new_development', // NEW_DEVELOPMENT
			10: 'custom_ad', // CUSTOM_AD
			11: 'storage', // STORAGEROOM
			12: 'building' // BUILDING
		};
		return typeMap[code] || 'flat';
	}

	/**
	 * Guarda las propiedades en un archivo JSON
	 */
	saveToJSON(properties, outputPath) {
		const data = {
			success: true,
			data: {
				properties,
				total: properties.length,
				lastUpdate: new Date().toISOString()
			},
			pagination: {
				page: 1,
				size: properties.length,
				total: properties.length
			}
		};

		fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
		console.log(
			`✅ ${properties.length} propiedades guardadas en ${outputPath}`
		);
	}
}

// Uso del script
if (require.main === module) {
	const parser = new IdealistaXMLParser();

	// Buscar el archivo XML en la carpeta xml-ftp (el que viene del FTP)
	const xmlDir = path.join(__dirname, '../xml-ftp');
	const xmlFiles = fs
		.readdirSync(xmlDir)
		.filter(f => f.endsWith('.xml') && !f.includes('_Agents'));

	if (xmlFiles.length === 0) {
		console.error('❌ No se encontró ningún archivo XML en xml-ftp/');
		console.log('💡 Ejecuta primero: npm run download:idealista');
		process.exit(1);
	}

	// Usar el primer XML encontrado (debería ser el principal de Idealista)
	const xmlPath = path.join(xmlDir, xmlFiles[0]);
	const outputPath = path.join(
		__dirname,
		'../public/idealista-properties.json'
	);

	console.log(`📄 Parseando: ${xmlFiles[0]}`);

	parser
		.parseXMLFile(xmlPath)
		.then(properties => {
			console.log(`📦 Parseadas ${properties.length} propiedades`);
			parser.saveToJSON(properties, outputPath);
		})
		.catch(error => {
			console.error('❌ Error:', error);
			process.exit(1);
		});
}

module.exports = IdealistaXMLParser;
