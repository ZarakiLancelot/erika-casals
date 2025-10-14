// GET /api/properties/[id]/images - Obtener imágenes de una propiedad
const IdealistaPartnersService = require('../../_lib/idealistaService');

// Cache en memoria por propertyId
const cache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos (las imágenes no cambian)

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, If-None-Match');

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

    const now = Date.now();
    const cacheKey = id;
    
    // Verificar ETag del cliente
    const clientETag = req.headers['if-none-match'];
    const cached = cache.get(cacheKey);
    
    if (clientETag && cached && clientETag === cached.etag) {
      console.log(`✅ Cliente tiene cache válido para imagen ${id} (304)`);
      res.setHeader('Cache-Control', 'public, max-age=1800');
      res.setHeader('ETag', cached.etag);
      return res.status(304).end();
    }
    
    // Verificar cache del servidor
    if (cached) {
      const cacheAge = now - cached.timestamp;
      if (cacheAge < CACHE_DURATION) {
        console.log(`✅ Usando cache para imagen ${id} (${Math.round(cacheAge/1000)}s)`);
        
        res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=600');
        res.setHeader('ETag', cached.etag);
        res.setHeader('X-Cache', 'HIT');
        
        return res.json(cached.data);
      }
    }

    // Obtener imágenes nuevas
    console.log(`🖼️ Obteniendo imágenes nuevas para ${id}...`);
    const idealistaService = new IdealistaPartnersService();
    const result = await idealistaService.getPropertyImages(id);
    
    // Guardar en cache
    const etag = `"images-${id}-${now}"`;
    cache.set(cacheKey, {
      data: result,
      timestamp: now,
      etag
    });
    
    res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=600');
    res.setHeader('ETag', etag);
    res.setHeader('X-Cache', 'MISS');
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

