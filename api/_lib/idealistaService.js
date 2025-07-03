// =================================
// IDEALISTA PARTNERS API SERVICE - SERVERLESS VERSION
// =================================

const fetch = require('node-fetch');

class IdealistaPartnersService {
  constructor() {
    // Credenciales desde variables de entorno de Vercel
    this.clientId = process.env.IDEALISTA_CLIENT_ID;
    this.clientSecret = process.env.IDEALISTA_CLIENT_SECRET;
    this.feedKey = process.env.IDEALISTA_FEED_KEY;

    // URLs oficiales
    this.sandboxURL = 'https://partners-sandbox.idealista.com';
    this.productionURL = 'https://partners.idealista.com';
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? this.productionURL 
      : this.sandboxURL;

    this.token = null;
    this.tokenExpiry = null;
  }

  // OAuth2 según documentación oficial
  async getOAuth2Token() {
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      console.log('🔑 Obteniendo token OAuth2...');

      const credentials = Buffer.from(
        `${this.clientId}:${this.clientSecret}`
      ).toString('base64');

      const response = await fetch(`${this.baseURL}/oauth/token`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: 'grant_type=client_credentials&scope=read'
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.access_token;
        this.tokenExpiry = Date.now() + (data.expires_in * 1000);
        console.log('✅ Token OAuth2 obtenido');
        return this.token;
      } else {
        const errorText = await response.text();
        throw new Error(`Error OAuth2: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error OAuth2:', error.message);
      throw error;
    }
  }

  // Headers oficiales según documentación
  async getApiHeaders() {
    const token = await this.getOAuth2Token();
    return {
      feedKey: this.feedKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
  }

  // GET /v1/properties
  async getAllProperties(options = {}) {
    try {
      console.log('🔍 Obteniendo propiedades...');
      
      const headers = await this.getApiHeaders();
      const params = {
        page: options.page || 1,
        size: options.size || 100,
        state: options.state || 'active'
      };

      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/v1/properties?${queryString}`;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          pagination: {
            page: params.page,
            size: params.size,
            totalElements: data.totalElements || 0,
            totalPages: data.totalPages || 0
          },
          timestamp: new Date().toISOString()
        };
      } else {
        const errorText = await response.text();
        console.log(`❌ Error ${response.status}:`, errorText);
        
        // Fallback con datos mock
        return {
          success: true,
          data: this.getMockProperties(),
          pagination: {
            page: params.page,
            size: params.size,
            totalElements: 4,
            totalPages: 1
          },
          timestamp: new Date().toISOString(),
          fallback: true,
          originalError: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      console.error('❌ Error general:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // GET /v1/properties/{propertyId}
  async getPropertyById(propertyId) {
    try {
      console.log(`🔍 Obteniendo propiedad ${propertyId}...`);

      const headers = await this.getApiHeaders();
      const endpoint = `/v1/properties/${propertyId}`;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          timestamp: new Date().toISOString()
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: errorText
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // GET /v1/contacts
  async getAllContacts(options = {}) {
    try {
      console.log('👥 Obteniendo contactos...');

      const headers = await this.getApiHeaders();
      const params = {
        page: options.page || 1,
        size: options.size || 100
      };

      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/v1/contacts?${queryString}`;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          timestamp: new Date().toISOString()
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: errorText
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // POST /v1/contacts - Crear contacto
  async createContact(contactData) {
    try {
      console.log('👤 Creando contacto...', contactData);

      const headers = await this.getApiHeaders();
      const endpoint = `/v1/contacts`;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: responseData,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          error: responseData.message || 'Error al crear contacto',
          statusCode: response.status,
          details: responseData
        };
      }
    } catch (error) {
      console.error('❌ Error creando contacto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // GET /v1/contacts/{id} - Obtener contacto por ID
  async getContactById(contactId) {
    try {
      console.log('👤 Obteniendo contacto por ID:', contactId);

      const headers = await this.getApiHeaders();
      const endpoint = `/v1/contacts/${contactId}`;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: responseData,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          error: responseData.message || 'Error al obtener contacto',
          statusCode: response.status,
          details: responseData
        };
      }
    } catch (error) {
      console.error('❌ Error obteniendo contacto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // PUT /v1/contacts/{id} - Actualizar contacto
  async updateContact(contactId, contactData) {
    try {
      console.log('👤 Actualizando contacto:', contactId, contactData);

      const headers = await this.getApiHeaders();
      const endpoint = `/v1/contacts/${contactId}`;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: responseData,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          error: responseData.message || 'Error al actualizar contacto',
          statusCode: response.status,
          details: responseData
        };
      }
    } catch (error) {
      console.error('❌ Error actualizando contacto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // GET /v1/customer/publishinfo
  async getPublishInfo() {
    try {
      console.log('📊 Obteniendo información de publicación...');

      const headers = await this.getApiHeaders();
      const endpoint = '/v1/customer/publishinfo';

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          timestamp: new Date().toISOString()
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: errorText
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // GET /v1/properties/{propertyId}/images
  async getPropertyImages(propertyId) {
    try {
      console.log(`🖼️ Obteniendo imágenes de propiedad ${propertyId}...`);

      const headers = await this.getApiHeaders();
      const endpoint = `/v1/properties/${propertyId}/images`;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data
        };
      } else {
        const errorText = await response.text();
        console.error(`❌ Error obteniendo imágenes: ${response.status} - ${errorText}`);
        
        // Fallback con imágenes mock
        return {
          success: true,
          data: this.getMockImages(),
          fallback: true,
          originalError: `HTTP ${response.status}: ${errorText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Test de conectividad
  async testConnection() {
    try {
      console.log('🧪 Probando conectividad...');

      const tokenTest = await this.getOAuth2Token();

      const tests = [
        {
          name: 'OAuth2 Token',
          success: !!tokenTest,
          details: tokenTest ? 'Token obtenido correctamente' : 'Error obteniendo token'
        }
      ];

      try {
        const publishInfo = await this.getPublishInfo();
        tests.push({
          name: 'Customer Publish Info',
          success: publishInfo.success,
          details: publishInfo.success ? 'Endpoint responde' : publishInfo.error,
          data: publishInfo.data
        });
      } catch (error) {
        tests.push({
          name: 'Customer Publish Info',
          success: false,
          details: error.message
        });
      }

      return {
        success: true,
        baseURL: this.baseURL,
        feedKey: this.feedKey ? this.feedKey.substring(0, 10) + '...' : 'not configured',
        clientId: this.clientId,
        tests,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // =========================
  // MÉTODOS PARA PROPIEDADES
  // =========================

  // POST /v1/properties - Crear propiedad
  async createProperty(propertyData) {
    try {
      console.log('🏠 Creando propiedad...', propertyData);

      const headers = await this.getApiHeaders();
      const endpoint = `/v1/properties`;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyData)
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: responseData,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          error: responseData.message || 'Error al crear propiedad',
          statusCode: response.status,
          details: responseData
        };
      }
    } catch (error) {
      console.error('❌ Error creando propiedad:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // GET /v1/properties/{id} - Obtener propiedad por ID (ya existía)
  
  // PUT /v1/properties/{id} - Actualizar propiedad
  async updateProperty(propertyId, propertyData) {
    try {
      console.log('🏠 Actualizando propiedad:', propertyId, propertyData);

      const headers = await this.getApiHeaders();
      const endpoint = `/v1/properties/${propertyId}`;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyData)
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: responseData,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          error: responseData.message || 'Error al actualizar propiedad',
          statusCode: response.status,
          details: responseData
        };
      }
    } catch (error) {
      console.error('❌ Error actualizando propiedad:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // PUT /v1/properties/{id}/deactivate - Desactivar propiedad
  async deactivateProperty(propertyId) {
    try {
      console.log('🏠 Desactivando propiedad:', propertyId);

      const headers = await this.getApiHeaders();
      const endpoint = `/v1/properties/${propertyId}/deactivate`;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST', // Cambiar a POST según documentación
        headers
      });

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const textResponse = await response.text();
        responseData = { message: textResponse, rawResponse: true };
      }

      if (response.ok) {
        return {
          success: true,
          data: responseData,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          error: responseData.message || 'Error al desactivar propiedad',
          statusCode: response.status,
          details: responseData
        };
      }
    } catch (error) {
      console.error('❌ Error desactivando propiedad:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // PUT /v1/properties/{id}/reactivate - Reactivar propiedad
  async reactivateProperty(propertyId) {
    try {
      console.log('🏠 Reactivando propiedad:', propertyId);

      const headers = await this.getApiHeaders();
      const endpoint = `/v1/properties/${propertyId}/reactivate`;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST', // Cambiar a POST según documentación
        headers
      });

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const textResponse = await response.text();
        responseData = { message: textResponse, rawResponse: true };
      }

      if (response.ok) {
        return {
          success: true,
          data: responseData,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          error: responseData.message || 'Error al reactivar propiedad',
          statusCode: response.status,
          details: responseData
        };
      }
    } catch (error) {
      console.error('❌ Error reactivando propiedad:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Datos mock para fallback
  getMockProperties() {
    return {
      properties: [
        {
          propertyId: 'mock-001',
          operation: { type: 'sale', price: 450000 },
          address: {
            streetName: 'Calle de Alcalá',
            district: 'Centro',
            city: 'Madrid'
          },
          propertyType: 'flat',
          size: 120,
          rooms: 3,
          bathrooms: 2,
          description: 'Piso moderno en el centro de Madrid con todas las comodidades',
          features: ['terraza', 'ascensor', 'calefacción'],
          state: 'active'
        },
        {
          propertyId: 'mock-002',
          operation: { type: 'rent', price: 1800 },
          address: { streetName: 'Gran Vía', district: 'Centro', city: 'Madrid' },
          propertyType: 'flat',
          size: 85,
          rooms: 2,
          bathrooms: 1,
          description: 'Apartamento céntrico ideal para alquiler',
          features: ['aire acondicionado', 'amueblado'],
          state: 'active'
        },
        {
          propertyId: 'mock-003',
          operation: { type: 'sale', price: 320000 },
          address: {
            streetName: 'Calle Serrano',
            district: 'Salamanca',
            city: 'Madrid'
          },
          propertyType: 'flat',
          size: 95,
          rooms: 2,
          bathrooms: 2,
          description: 'Piso reformado en zona premium',
          features: ['parking', 'trastero', 'portero'],
          state: 'active'
        },
        {
          propertyId: 'mock-004',
          operation: { type: 'rent', price: 2200 },
          address: {
            streetName: 'Paseo de la Castellana',
            district: 'Chamberí',
            city: 'Madrid'
          },
          propertyType: 'flat',
          size: 140,
          rooms: 4,
          bathrooms: 3,
          description: 'Amplio piso familiar en zona residencial',
          features: ['terraza', 'garaje', 'jardín comunitario'],
          state: 'active'
        }
      ],
      totalElements: 4,
      totalPages: 1
    };
  }

  getMockImages() {
    return {
      images: [
        { url: '/images/home-image-1.png', description: 'Salón principal' },
        { url: '/images/home-image-2.png', description: 'Cocina moderna' },
        { url: '/images/home-image-3.png', description: 'Dormitorio principal' }
      ]
    };
  }
}

module.exports = IdealistaPartnersService;
