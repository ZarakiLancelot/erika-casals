import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		proxy: {
			'/api': 'http://localhost:3001'
		}
	},
	plugins: [
		react(),
		{
			name: 'spa-php-fallback',
			configureServer(server) {
				server.middlewares.use((req, _res, next) => {
					// Si la URL contiene .php, reescribirla a / para que React Router la maneje
					if (req.url && req.url.includes('.php')) {
						// Preservar el query string (ej: ?codigo=13731_350914)
						const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
						req.url = '/' + qs;
					}
					next();
				});
			}
		}
	]
});
