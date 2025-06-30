// GET /api/status - Estado del servicio
const IdealistaPartnersService = require('../_lib/idealistaService');

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
    
    res.json({
      status: 'ok',
      environment: process.env.NODE_ENV || 'development',
      idealista_env: idealistaService.baseURL.includes('sandbox') ? 'sandbox' : 'production',
      feedKey: idealistaService.feedKey 
        ? idealistaService.feedKey.substring(0, 10) + '...' 
        : 'not configured',
      endpoints: {
        properties: '/api/properties',
        contacts: '/api/contacts',
        publishInfo: '/api/publish-info',
        test: '/api/test'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
