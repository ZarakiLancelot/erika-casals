# Backend - API Inmobiliaria

## 🚀 Servidor Express con APIs de Idealista y Contentful

### Variables de Entorno Requeridas:

```env
IDEALISTA_CLIENT_ID=your_client_id
IDEALISTA_CLIENT_SECRET=your_client_secret
IDEALISTA_FEED_KEY=your_feed_key
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Scripts disponibles:

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en desarrollo con nodemon

### Endpoints:

- `GET /api/properties` - Obtiene propiedades de Idealista
- `GET /api/properties/:id` - Obtiene propiedad específica de Idealista
- `GET /api/contacts` - Obtiene contactos de Idealista
- `GET /api/newDevelopments` - Obtiene nuevos desarrollos desde Contentful (propertiesPandaIdx)
- `GET /api/status` - Estado del servicio
- `GET /api/test` - Test de conectividad con Idealista
- `GET /api/sandbox-status` - Estado del sandbox de Idealista
- `GET /api/publish-info` - Información de publicación

### Deploy:

Este backend está listo para deploy en:

- Railway
- Heroku
- Render
- DigitalOcean
- Cualquier VPS con Node.js
