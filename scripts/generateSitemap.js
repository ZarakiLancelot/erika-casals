/**
 * Script para generar sitemap.xml dinámicamente
 * Incluye todas las páginas estáticas y dinámicas (propiedades)
 */

const fs = require('fs');
const path = require('path');

// Configuración
const BASE_URL = 'https://erikacasals.com';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Páginas estáticas
const staticPages = [
	{ url: '/', priority: '1.0', changefreq: 'weekly' },
	{ url: '/servicios', priority: '0.8', changefreq: 'monthly' },
	{ url: '/aboutme', priority: '0.8', changefreq: 'monthly' },
	{ url: '/sales', priority: '0.9', changefreq: 'daily' },
	{ url: '/rent', priority: '0.9', changefreq: 'daily' }
];

/**
 * Genera el sitemap XML
 */
async function generateSitemap() {
	console.log('🗺️  Generando sitemap.xml...');

	try {
		// Leer propiedades del JSON
		const propertiesPath = path.join(
			__dirname,
			'../public/idealista-properties.json'
		);
		let properties = [];

		if (fs.existsSync(propertiesPath)) {
			const jsonData = fs.readFileSync(propertiesPath, 'utf-8');
			const data = JSON.parse(jsonData);
			if (data.success && data.data && data.data.properties) {
				properties = data.data.properties;
				console.log(`✅ Encontradas ${properties.length} propiedades`);
			}
		} else {
			console.log(
				'⚠️  No se encontró idealista-properties.json, solo se incluirán páginas estáticas'
			);
		}

		// Fecha actual en formato ISO
		const currentDate = new Date().toISOString().split('T')[0];

		// Generar XML
		let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
		xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

		// Añadir páginas estáticas
		staticPages.forEach(page => {
			xml += '  <url>\n';
			xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
			xml += `    <lastmod>${currentDate}</lastmod>\n`;
			xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
			xml += `    <priority>${page.priority}</priority>\n`;
			xml += '  </url>\n';
		});

		// Añadir páginas dinámicas de propiedades
		properties.forEach(property => {
			xml += '  <url>\n';
			xml += `    <loc>${BASE_URL}/property/${property.propertyId}</loc>\n`;
			xml += `    <lastmod>${currentDate}</lastmod>\n`;
			xml += `    <changefreq>weekly</changefreq>\n`;
			xml += `    <priority>0.7</priority>\n`;
			xml += '  </url>\n';
		});

		xml += '</urlset>';

		// Guardar archivo
		fs.writeFileSync(OUTPUT_PATH, xml, 'utf-8');
		console.log(`✅ Sitemap generado exitosamente: ${OUTPUT_PATH}`);
		console.log(`📊 Total de URLs: ${staticPages.length + properties.length}`);
		console.log(`   - Páginas estáticas: ${staticPages.length}`);
		console.log(`   - Propiedades: ${properties.length}`);
	} catch (error) {
		console.error('❌ Error generando sitemap:', error);
		process.exit(1);
	}
}

// Ejecutar
generateSitemap();
