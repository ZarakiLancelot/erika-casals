// GET /api/sandbox-status - Verificar si sandbox está disponible
const IdealistaPartnersService = require('../_lib/idealistaService');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const idealistaService = new IdealistaPartnersService();
    const headers = await idealistaService.getApiHeaders();

    const response = await fetch(
      `${idealistaService.baseURL}/v1/customer/publishinfo`,
      {
        method: 'GET',
        headers
      }
    );

    const status = {
      available: response.status !== 503,
      status: response.status,
      statusText: response.statusText,
      timestamp: new Date().toISOString(),
      message: response.status === 503
        ? 'Sandbox en mantenimiento. Intenta más tarde.'
        : response.ok
        ? 'Sandbox disponible'
        : 'Sandbox responde pero con errores'
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({
      available: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
