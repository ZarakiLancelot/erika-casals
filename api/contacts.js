// API /api/contacts - Gestión de contactos (GET, POST)
const IdealistaPartnersService = require('./_lib/idealistaService');

// Función para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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
      // GET /api/contacts - Obtener todos los contactos
      const options = {
        page: parseInt(req.query.page) || 1,
        size: parseInt(req.query.size) || 100
      };

      const result = await idealistaService.getAllContacts(options);
      res.json(result);

    } else if (req.method === 'POST') {
      // POST /api/contacts - Crear nuevo contacto
      const contactData = req.body;

      // Validaciones según los tests de Idealista
      if (!contactData.email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required',
          code: 'EMAIL_REQUIRED'
        });
      }

      if (!isValidEmail(contactData.email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
          code: 'INVALID_EMAIL'
        });
      }

      const result = await idealistaService.createContact(contactData);
      
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
    console.error('❌ Error en /api/contacts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
