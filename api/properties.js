// API /api/properties - Gestión de propiedades (GET, POST)
const IdealistaPartnersService = require('./_lib/idealistaService');

// Cache en memoria (persiste mientras la función serverless esté "caliente")
let cache = {
  data: null,
  timestamp: null,
  etag: null
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, If-None-Match');

  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const idealistaService = new IdealistaPartnersService();

  try {
    if (req.method === 'GET') {
      const now = Date.now();
      
      // Verificar si el cliente tiene cache válido (ETag)
      const clientETag = req.headers['if-none-match'];
      if (clientETag && cache.etag && clientETag === cache.etag) {
        console.log('✅ Cliente tiene cache válido (304 Not Modified)');
        res.setHeader('Cache-Control', 'public, max-age=600');
        res.setHeader('ETag', cache.etag);
        return res.status(304).end();
      }
      
      // Verificar cache del servidor
      if (cache.data && cache.timestamp) {
        const cacheAge = now - cache.timestamp;
        if (cacheAge < CACHE_DURATION) {
          console.log(`✅ Usando cache del servidor (${Math.round(cacheAge/1000)}s antiguo)`);
          
          // Headers de cache AGRESIVOS para el navegador
          res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=300');
          res.setHeader('ETag', cache.etag);
          res.setHeader('X-Cache', 'HIT');
          res.setHeader('X-Cache-Age', Math.round(cacheAge/1000));
          
          return res.json(cache.data);
        }
      }
      
      // Hacer nueva petición a Idealista
      console.log('🔍 Obteniendo datos nuevos de Idealista...');
      const options = {
        page: parseInt(req.query.page) || 1,
        size: parseInt(req.query.size) || 100,
        state: req.query.state || 'active'
      };

      const result = await idealistaService.getAllProperties(options);
      
      // Guardar en cache
      cache.data = result;
      cache.timestamp = now;
      cache.etag = `"properties-${now}"`;
      
      // Headers de cache AGRESIVOS
      res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=300');
      res.setHeader('ETag', cache.etag);
      res.setHeader('X-Cache', 'MISS');
      
      console.log('✅ Datos obtenidos y guardados en cache');
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
