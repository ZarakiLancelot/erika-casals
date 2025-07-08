// Test endpoint para verificar qué variables de entorno está leyendo Vercel
export default function handler(req, res) {
	const envInfo = {
		NODE_ENV: process.env.NODE_ENV,
		IDEALISTA_CLIENT_ID: process.env.IDEALISTA_CLIENT_ID,
		// Solo mostramos las primeras 10 letras del secret por seguridad
		IDEALISTA_CLIENT_SECRET: process.env.IDEALISTA_CLIENT_SECRET
			? process.env.IDEALISTA_CLIENT_SECRET.substring(0, 10) + '...'
			: 'undefined',
		IDEALISTA_FEED_KEY: process.env.IDEALISTA_FEED_KEY
			? process.env.IDEALISTA_FEED_KEY.substring(0, 20) + '...'
			: 'undefined',
		// Variables del frontend (VITE_)
		VITE_BACKEND_URL: process.env.VITE_BACKEND_URL,
		VITE_API_URL: process.env.VITE_API_URL,
		VITE_CONTENTFUL_SPACE_ID: process.env.VITE_CONTENTFUL_SPACE_ID,
		// Port si está definido
		PORT: process.env.PORT,
		// Información adicional
		vercelEnv: process.env.VERCEL_ENV,
		vercelUrl: process.env.VERCEL_URL,
		timestamp: new Date().toISOString()
	};

	res.status(200).json({
		message: 'Environment variables check',
		environment: envInfo,
		source: 'Vercel serverless function'
	});
}
