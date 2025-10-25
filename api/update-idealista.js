const { spawn } = require('child_process');
const path = require('path');

/**
 * Endpoint para actualizar el feed de Idealista
 * Se ejecuta automáticamente mediante Vercel Cron
 */
module.exports = async (req, res) => {
	// Verificar que solo se ejecute mediante cron o con token de autorización
	const authToken = req.headers['x-vercel-cron-auth'];
	const manualToken = req.query.token;

	if (!authToken && manualToken !== process.env.CRON_SECRET) {
		return res.status(401).json({
			error: 'Unauthorized',
			message: 'Este endpoint solo puede ser ejecutado por Vercel Cron'
		});
	}

	try {
		// Ejecutar el script de actualización
		const scriptPath = path.join(
			process.cwd(),
			'scripts',
			'updateIdealistaFeed.js'
		);

		return new Promise((resolve, reject) => {
			const process = spawn('node', [scriptPath], {
				env: {
					...process.env,
					IDEALISTA_FTP_HOST: process.env.IDEALISTA_FTP_HOST,
					IDEALISTA_FTP_USER: process.env.IDEALISTA_FTP_USER,
					IDEALISTA_FTP_PASSWORD: process.env.IDEALISTA_FTP_PASSWORD
				}
			});

			let output = '';
			let errorOutput = '';

			process.stdout.on('data', data => {
				output += data.toString();
			});

			process.stderr.on('data', data => {
				errorOutput += data.toString();
			});

			process.on('close', code => {
				if (code === 0) {
					res.status(200).json({
						success: true,
						message: 'Feed actualizado correctamente',
						timestamp: new Date().toISOString(),
						output: output
					});
					resolve();
				} else {
					res.status(500).json({
						success: false,
						error: 'Error actualizando feed',
						code: code,
						output: errorOutput
					});
					reject(new Error(errorOutput));
				}
			});
		});
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({
			success: false,
			error: error.message
		});
	}
};
