// API /api/properties/[id]/reactivate - Reactivar propiedad específica
const IdealistaPartnersService = require('../../_lib/idealistaService');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      allowedMethods: ['PUT']
    });
  }

  // Obtener el ID de la propiedad desde la URL
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Property ID is required'
    });
  }

  const idealistaService = new IdealistaPartnersService();

  try {
    const result = await idealistaService.reactivateProperty(id);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.statusCode || 500).json(result);
    }

  } catch (error) {
    console.error(`❌ Error reactivando propiedad ${id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
