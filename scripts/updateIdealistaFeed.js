const IdealistaFTPClient = require('./downloadIdealistaFTP');
const IdealistaXMLParser = require('./parseIdealistaXML');
const path = require('path');
const fs = require('fs');

/**
 * Script completo para actualizar las propiedades de Idealista
 * 1. Descarga el XML/JSON del FTP
 * 2. Parsea y transforma los datos
 * 3. Guarda en formato JSON listo para la aplicación
 */
async function updateIdealistaProperties() {
	console.log('🚀 Iniciando actualización de propiedades de Idealista...\n');

	const downloader = new IdealistaFTPClient();
	const parser = new IdealistaXMLParser();

	try {
		// Paso 1: Descargar archivo del FTP
		console.log('📥 PASO 1: Descargando archivo del FTP...');
		const { format, path: downloadedPath } = await downloader.downloadLatest();
		console.log(
			`✅ Descargado: ${format.toUpperCase()} en ${downloadedPath}\n`
		);

		// Paso 2: Parsear el archivo
		console.log('🔄 PASO 2: Parseando propiedades...');
		let properties;

		if (format === 'xml') {
			properties = await parser.parseXMLFile(downloadedPath);
		} else {
			// Si es JSON, leerlo directamente
			const jsonContent = fs.readFileSync(downloadedPath, 'utf8');
			const data = JSON.parse(jsonContent);
			properties = data.ads || data.properties || [];
		}

		console.log(`✅ ${properties.length} propiedades parseadas\n`);

		// Paso 3: Separar por operación (venta/alquiler)
		console.log('🔍 PASO 3: Clasificando propiedades...');
		const saleProperties = properties.filter(p => p.operation === 'sale');
		const rentProperties = properties.filter(p => p.operation === 'rent');

		console.log(`  📊 Venta: ${saleProperties.length} propiedades`);
		console.log(`  📊 Alquiler: ${rentProperties.length} propiedades\n`);

		// Paso 4: Guardar en archivos JSON
		console.log('💾 PASO 4: Guardando archivos...');
		const outputDir = path.join(__dirname, '../public');

		// Crear directorio public si no existe
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Guardar propiedades de venta
		const saleOutputPath = path.join(
			outputDir,
			'idealista-properties-sale.json'
		);
		parser.saveToJSON(saleProperties, saleOutputPath);

		// Guardar propiedades de alquiler
		const rentOutputPath = path.join(
			outputDir,
			'idealista-properties-rent.json'
		);
		parser.saveToJSON(rentProperties, rentOutputPath);

		// Guardar todas juntas
		const allOutputPath = path.join(outputDir, 'idealista-properties-all.json');
		parser.saveToJSON(properties, allOutputPath);

		console.log('\n✅ ACTUALIZACIÓN COMPLETADA EXITOSAMENTE');
		console.log('═══════════════════════════════════════');
		console.log(`📦 Total: ${properties.length} propiedades`);
		console.log(`🏠 Venta: ${saleProperties.length}`);
		console.log(`🔑 Alquiler: ${rentProperties.length}`);
		console.log(`📁 Archivos generados en: ${outputDir}`);
		console.log('═══════════════════════════════════════\n');

		return {
			success: true,
			total: properties.length,
			sale: saleProperties.length,
			rent: rentProperties.length
		};
	} catch (error) {
		console.error('\n❌ ERROR EN LA ACTUALIZACIÓN');
		console.error('═══════════════════════════════════════');
		console.error(error);
		console.error('═══════════════════════════════════════\n');
		throw error;
	}
}

// Ejecutar si se llama directamente
if (require.main === module) {
	updateIdealistaProperties()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
}

module.exports = updateIdealistaProperties;
