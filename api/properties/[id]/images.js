// GET /api/properties/[id]/images - Obtener imágenes de una propiedad
const IdealistaPartnersService = require('../../_lib/idealistaService');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Property ID is required'
      });
    }

    const idealistaService = new IdealistaPartnersService();
    const result = await idealistaService.getPropertyImages(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
