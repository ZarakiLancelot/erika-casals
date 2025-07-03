// API /api/contacts/[id] - Gestión de contacto específico (GET, PUT)
const IdealistaPartnersService = require('../_lib/idealistaService');

// Función para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Obtener el ID del contacto desde la URL
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Contact ID is required'
    });
  }

  const idealistaService = new IdealistaPartnersService();

  try {
    if (req.method === 'GET') {
      // GET /api/contacts/[id] - Obtener contacto por ID
      const result = await idealistaService.getContactById(id);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(result.statusCode || 404).json(result);
      }

    } else if (req.method === 'PUT') {
      // PUT /api/contacts/[id] - Actualizar contacto
      const contactData = req.body;

      // Validaciones opcionales (solo si se proporciona email)
      if (contactData.email && !isValidEmail(contactData.email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
          code: 'INVALID_EMAIL'
        });
      }

      const result = await idealistaService.updateContact(id, contactData);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(result.statusCode || 500).json(result);
      }

    } else {
      return res.status(405).json({ 
        success: false,
        error: 'Method not allowed',
        allowedMethods: ['GET', 'PUT']
      });
    }

  } catch (error) {
    console.error(`❌ Error en /api/contacts/${id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
