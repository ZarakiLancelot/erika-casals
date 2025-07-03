// API /api/properties - Gestión de propiedades (GET, POST)
const IdealistaPartnersService = require('./_lib/idealistaService');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const idealistaService = new IdealistaPartnersService();

  try {
    if (req.method === 'GET') {
      // GET /api/properties - Obtener todas las propiedades
      const options = {
        page: parseInt(req.query.page) || 1,
        size: parseInt(req.query.size) || 100,
        state: req.query.state || 'active'
      };

      const result = await idealistaService.getAllProperties(options);
      res.json(result);

    } else if (req.method === 'POST') {
      // POST /api/properties - Crear nueva propiedad
      const propertyData = req.body;

      // Validaciones básicas
      if (!propertyData.type) {
        return res.status(400).json({
          success: false,
          error: 'Property type is required',
          code: 'TYPE_REQUIRED'
        });
      }

      if (!propertyData.operation) {
        return res.status(400).json({
          success: false,
          error: 'Operation type is required',
          code: 'OPERATION_REQUIRED'
        });
      }

      const result = await idealistaService.createProperty(propertyData);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(result.statusCode || 500).json(result);
      }

    } else {
      return res.status(405).json({ 
        success: false,
        error: 'Method not allowed',
        allowedMethods: ['GET', 'POST']
      });
    }

  } catch (error) {
    console.error('❌ Error en /api/properties:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
