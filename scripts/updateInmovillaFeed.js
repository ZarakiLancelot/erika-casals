const InmovillaXMLDownloader = require('./downloadInmovillaXML');
const InmovillaXMLParser = require('./parseInmovillaXML');
const path = require('path');
const fs = require('fs');

/**
 * Script principal para actualizar el feed de propiedades de Inmovilla.
 *
 * Flujo:
 *   1. Descarga el XML diario desde los servidores de Inmovilla
 *   2. Parsea y transforma los datos al formato interno
 *   3. Genera los archivos JSON en /public para el frontend
 *
 * Uso:
 *   node scripts/updateInmovillaFeed.js
 *
 * Variables de entorno necesarias (en .env o en Vercel):
 *   INMOVILLA_XML_URL     — URL completa del XML (la da Inmovilla)
 *   INMOVILLA_NUMAGENCIA  — número de agencia (alternativa si no hay URL)
 */
async function updateInmovillaFeed() {
	console.log('\n🏠 Iniciando actualización del feed de Inmovilla...\n');
	console.log('═══════════════════════════════════════');

	const downloader = new InmovillaXMLDownloader();
	const parser = new InmovillaXMLParser();

	try {
		// Paso 1: Descargar XML
		console.log('\n📥 PASO 1: Descargando XML de Inmovilla...');
		const xmlPath = await downloader.download();

		// Paso 2: Parsear
		console.log('\n🔄 PASO 2: Parseando propiedades...');
		const properties = await parser.parseXMLFile(xmlPath);
		console.log(`  ✅ ${properties.length} propiedades parseadas`);

		// Paso 3: Clasificar
		console.log('\n🔍 PASO 3: Clasificando por operación...');
		const saleProperties = properties.filter(p => p.operation === 'sale');
		const rentProperties = properties.filter(p => p.operation === 'rent');
		console.log(`  📊 Venta:    ${saleProperties.length} propiedades`);
		console.log(`  📊 Alquiler: ${rentProperties.length} propiedades`);

		// Paso 4: Guardar JSON
		console.log('\n💾 PASO 4: Guardando archivos JSON...');
		const outputDir = path.join(__dirname, '../public');
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Archivo principal (el que usa useIdealistaProperties / el hook del frontend)
		parser.saveToJSON(properties, path.join(outputDir, 'idealista-properties.json'));

		// Archivos separados por operación
		parser.saveToJSON(saleProperties, path.join(outputDir, 'idealista-properties-sale.json'));
		parser.saveToJSON(rentProperties, path.join(outputDir, 'idealista-properties-rent.json'));

		// Backup completo
		parser.saveToJSON(properties, path.join(outputDir, 'inmovilla-properties-all.json'));

		console.log('\n✅ ACTUALIZACIÓN COMPLETADA');
		console.log('═══════════════════════════════════════');
		console.log(`📦 Total:    ${properties.length} propiedades`);
		console.log(`🏠 Venta:    ${saleProperties.length}`);
		console.log(`🔑 Alquiler: ${rentProperties.length}`);
		console.log(`📁 Archivos en: ${outputDir}`);
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
		console.error(error.message);
		console.error('═══════════════════════════════════════\n');
		throw error;
	}
}

// Ejecutar si se llama directamente
if (require.main === module) {
	updateInmovillaFeed()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
}

module.exports = updateInmovillaFeed;
