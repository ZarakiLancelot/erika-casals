// GET /api/properties - Obtener todas las propiedades
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
    
    const options = {
      page: parseInt(req.query.page) || 1,
      size: parseInt(req.query.size) || 100,
      state: req.query.state || 'active'
    };

    const result = await idealistaService.getAllProperties(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
