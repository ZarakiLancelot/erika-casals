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

const { writeFileSync, mkdirSync, existsSync, readFileSync } = require('fs');
const { join } = require('path');

const OUTPUT_PATH = join(__dirname, '..', 'public', 'inmovilla-properties-all.json');

const API_BASE = 'https://api.erikacasals.com/api.php';
const NUMAGENCIA = '13731';

// ─── Construir URLs de imágenes ───────────────────────────────────────────────
function buildImages(codOfer, numFotos, fotoBase, fotoletra = 1) {
	if (numFotos && numFotos > 0) {
		return Array.from({ length: numFotos }, (_, i) => ({
			url: `https://fotos15.apinmo.com/${NUMAGENCIA}/${codOfer}/${fotoletra}-${i + 1}.jpg`,
			id: `${codOfer}-${fotoletra}-${i + 1}`,
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

function formatRef(ref) {
	const s = ref.toLowerCase();
	const last = s[s.length - 1];
	return /[a-z]/.test(last) ? s.slice(0, -1) + last.toUpperCase() : s;
}

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
	const images = buildImages(item.cod_ofer, item.numfotos, item.foto, item.fotoletra || 1);

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
		reference: item.ref ? formatRef(item.ref) : String(item.cod_ofer),
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

		page += 50;
	}

	const items = Array.from(seen.values());

	// ─── Cargar descripciones del JSON anterior para reutilizar las no modificadas
	const prevDescriptions = new Map();
	if (existsSync(OUTPUT_PATH)) {
		try {
			const prev = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'));
			for (const p of prev.properties || []) {
				prevDescriptions.set(Number(p.propertyId), {
					description: p.description || '',
					fechacambio: p._fechacambio || ''
				});
			}
		} catch { /* si el JSON está corrupto, ignorar */ }
	}

	const toFetch = items.filter(item => {
		const prev = prevDescriptions.get(item.cod_ofer);
		return !prev || prev.fechacambio !== item.fechacambio;
	});

	const removedCount = prevDescriptions.size > 0 ? prevDescriptions.size - items.length : 0;
	const hasChanges = toFetch.length > 0 || removedCount !== 0;

	if (!hasChanges) {
		console.log('\n✓ Sin cambios desde la última actualización — JSON no modificado.');
		return null;
	}

	console.log(`\nDescripciones: ${toFetch.length} fichas nuevas/modificadas (${items.length - toFetch.length} reutilizadas del JSON anterior)`);

	const fetchedDescriptions = new Map();
	for (let i = 0; i < toFetch.length; i++) {
		const item = toFetch[i];
		const description = await fetchFichaDescription(item.cod_ofer);
		fetchedDescriptions.set(item.cod_ofer, description);
		if ((i + 1) % 10 === 0) console.log(`  ${i + 1}/${toFetch.length} fichas procesadas`);
		await new Promise(resolve => setTimeout(resolve, 300));
	}

	const properties = items.map(item => {
		const description = fetchedDescriptions.has(item.cod_ofer)
			? fetchedDescriptions.get(item.cod_ofer)
			: (prevDescriptions.get(item.cod_ofer)?.description || '');
		const transformed = transformItem(item, description);
		if (transformed) transformed._fechacambio = item.fechacambio || '';
		return transformed;
	});

	return properties.filter(Boolean);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
	try {
		const properties = await fetchAllProperties();

		if (properties === null) return; // sin cambios

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
