#!/usr/bin/env node
/**
 * Descarga todas las propiedades de Inmovilla y las guarda en
 * public/inmovilla-properties-all.json para que el frontend las
 * sirva como un archivo estático desde el CDN de Vercel.
 *
 * Uso: node --env-file=.env scripts/updateInmovillaFeed.js
 * O via npm:  npm run update:inmovilla
 */

// El servidor de api.erikacasals.com usa un certificado SSL con CA no reconocida
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');

const OUTPUT_PATH = join(__dirname, '..', 'public', 'inmovilla-properties-all.json');

const API_BASE = 'https://api.erikacasals.com/api.php';
const NUMAGENCIA = '13731';

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

function cleanDescription(text) {
	if (!text) return '';
	return text
		.replace(/~~+/g, '\n')
		.replace(/<br\s*\/?>/gi, '')
		.trim();
}

function transformItem(item, description = '') {
	if (!item?.cod_ofer) return null;
	const isRent = item.keyacci === 2;
	const price = isRent ? item.precioalq : item.precioinmo;
	const images = buildImages(item.cod_ofer, item.numfotos, item.foto);

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
		reference: item.ref ? item.ref.toLowerCase() : String(item.cod_ofer),
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

// ─── Fetch con reintentos ante rate-limit ────────────────────────────────────
async function fetchWithRetry(url, label, retries = 5) {
	for (let attempt = 1; attempt <= retries; attempt++) {
		const response = await fetch(url);
		if (response.ok) {
			const result = await response.json();
			if (result.ok) return result;
			const waitMs = attempt * 15000;
			console.log(`  ⚠ API error en ${label}: "${result.error}" — reintento ${attempt}/${retries} en ${waitMs / 1000}s`);
			await new Promise(resolve => setTimeout(resolve, waitMs));
		} else {
			const waitMs = attempt * 15000;
			console.log(`  ⚠ HTTP ${response.status} en ${label} — reintento ${attempt}/${retries} en ${waitMs / 1000}s`);
			await new Promise(resolve => setTimeout(resolve, waitMs));
		}
	}
	throw new Error(`No se pudo cargar ${label} tras ${retries} intentos`);
}

async function fetchPage(page, retries = 5) {
	const url = `${API_BASE}?accion=paginacion&pagina=${page}&por_pagina=50`;
	return fetchWithRetry(url, `página ${page}`, retries);
}

async function fetchFichaDescription(codOfer) {
	try {
		const url = `${API_BASE}?accion=ficha&cod_ofer=${codOfer}`;
		const result = await fetchWithRetry(url, `ficha ${codOfer}`, 3);
		const descripciones = result.data?.descripciones?.[codOfer];
		const raw = descripciones?.['1']?.descrip || '';
		return cleanDescription(raw);
	} catch {
		return '';
	}
}

// ─── Paginación completa con deduplicación ────────────────────────────────────
async function fetchAllProperties() {
	const seen = new Map();
	let page = 1;
	let total = null;

	console.log('Descargando propiedades de Inmovilla...');

	while (true) {
		const result = await fetchPage(page);

		const paginacion = result.data?.paginacion || [];
		const meta = paginacion.find(i => i.total !== undefined);
		if (total === null && meta?.total) {
			total = meta.total;
			console.log(`Total según API: ${total} propiedades`);
		}

		const items = paginacion.filter(i => i.cod_ofer !== undefined);
		let newFound = 0;
		for (const item of items) {
			if (!seen.has(item.cod_ofer)) {
				seen.set(item.cod_ofer, item);
				newFound++;
			}
		}

		console.log(`  Página ${page}: +${newFound} nuevas (acumulado: ${seen.size})`);

		if (items.length === 0 || newFound === 0 || (total !== null && seen.size >= total)) {
			break;
		}

		page++;
	}

	const items = Array.from(seen.values());

	console.log(`\nDescargando descripciones (${items.length} fichas)...`);
	const properties = [];
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const description = await fetchFichaDescription(item.cod_ofer);
		properties.push(transformItem(item, description));
		if ((i + 1) % 10 === 0) console.log(`  ${i + 1}/${items.length} fichas procesadas`);
		// Pequeña pausa para no saturar la API
		await new Promise(resolve => setTimeout(resolve, 300));
	}

	return properties.filter(Boolean);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
	try {
		const properties = await fetchAllProperties();

		const rent = properties.filter(p => p.operation === 'rent').length;
		const sale = properties.filter(p => p.operation === 'sale').length;

		const output = {
			generatedAt: new Date().toISOString(),
			total: properties.length,
			sale,
			rent,
			properties
		};

		mkdirSync(join(__dirname, '..', 'public'), { recursive: true });
		writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');

		console.log('\n✓ Archivo generado:', OUTPUT_PATH);
		console.log(`  Total: ${properties.length} propiedades`);
		console.log(`  Venta: ${sale} | Alquiler: ${rent}`);
	} catch (err) {
		console.error('Error:', err.message);
		process.exit(1);
	}
}

main();
