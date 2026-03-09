const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Descargador del feed XML de Inmovilla.
 *
 * Variables de entorno:
 *   INMOVILLA_XML_URL     — URL https:// del XML (producción) O ruta local (desarrollo)
 *   INMOVILLA_NUMAGENCIA  — número de agencia (alternativa a la URL)
 */
class InmovillaXMLDownloader {
	constructor() {
		this.xmlUrl = process.env.INMOVILLA_XML_URL || this.buildUrl();
		this.outputDir = path.join(__dirname, '../xml-inmovilla');
	}

	buildUrl() {
		const numagencia = process.env.INMOVILLA_NUMAGENCIA;
		if (!numagencia) {
			throw new Error(
				'Falta INMOVILLA_XML_URL o INMOVILLA_NUMAGENCIA en las variables de entorno.\n' +
				'Para desarrollo local, agrega en .env:\n' +
				'  INMOVILLA_XML_URL=./xml-inmovilla/inmovilla-latest.xml'
			);
		}
		const numericPart = numagencia.split('_')[0];
		return `https://procesos.inmovilla.com/xml/xml2${numericPart}/${numericPart}-web.xml`;
	}

	/**
	 * Descarga (o copia desde ruta local) el XML y retorna la ruta del archivo.
	 */
	async download() {
		if (!fs.existsSync(this.outputDir)) {
			fs.mkdirSync(this.outputDir, { recursive: true });
		}

		const latestPath = path.join(this.outputDir, 'inmovilla-latest.xml');

		// ── MODO LOCAL ─────────────────────────────────────────────────────────
		// Si la URL no empieza con http, asumimos que es una ruta de archivo local
		if (!this.xmlUrl.startsWith('http')) {
			const localPath = path.resolve(process.cwd(), this.xmlUrl);

			if (!fs.existsSync(localPath)) {
				throw new Error(
					`No se encontró el XML local en: ${localPath}\n` +
					`Asegúrate de tener el archivo en esa ruta.`
				);
			}

			// Si la ruta local ya ES el archivo latest, no hace falta copiar
			if (path.resolve(localPath) !== path.resolve(latestPath)) {
				fs.copyFileSync(localPath, latestPath);
			}

			console.log(`  📂 Usando XML local: ${localPath}`);
			return latestPath;
		}

		// ── MODO PRODUCCIÓN (descarga HTTPS) ───────────────────────────────────
		const fileName = `inmovilla-${new Date().toISOString().split('T')[0]}.xml`;
		const outputPath = path.join(this.outputDir, fileName);

		console.log(`  📡 Descargando: ${this.xmlUrl}`);

		return new Promise((resolve, reject) => {
			const file = fs.createWriteStream(outputPath);

			const fetchUrl = (url) => {
				https.get(url, (response) => {
					if (response.statusCode === 301 || response.statusCode === 302) {
						fetchUrl(response.headers.location);
						return;
					}
					if (response.statusCode !== 200) {
						reject(new Error(`HTTP ${response.statusCode} al descargar XML de Inmovilla`));
						return;
					}
					response.pipe(file);
					file.on('finish', () => {
						file.close();
						fs.copyFileSync(outputPath, latestPath);
						console.log(`  ✅ Descargado: ${outputPath}`);
						resolve(latestPath);
					});
				}).on('error', (err) => {
					fs.unlink(outputPath, () => {});
					reject(err);
				});
			};

			fetchUrl(this.xmlUrl);
			file.on('error', (err) => {
				fs.unlink(outputPath, () => {});
				reject(err);
			});
		});
	}

	getLatestPath() {
		return path.join(this.outputDir, 'inmovilla-latest.xml');
	}
}

module.exports = InmovillaXMLDownloader;
