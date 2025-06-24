# 🚀 CONFIGURACIÓN DEL BACKEND PARA PRODUCCIÓN

## 🎯 BACKEND INDEPENDIENTE - Cómo Funciona

Tu backend es un **servidor API independiente** que:

1. **Recibe peticiones HTTP** del frontend
2. **Se autentica con Idealista** usando OAuth2
3. **Obtiene datos de propiedades** de Idealista API
4. **Se conecta a Contentful** para propiedades exclusivas
5. **Devuelve datos unificados** al frontend

## 🏗️ ARQUITECTURA DE PRODUCCIÓN

```
┌─────────────────┐    HTTPS     ┌─────────────────┐
│   FRONTEND      │ ──────────► │     BACKEND     │
│   (IONOS)       │              │   (Railway)     │
│   React Build   │              │   Node.js API   │
└─────────────────┘              └─────────────────┘
                                          │
                                   ┌──────┴──────┐
                                   │             │
                            ┌─────────────┐ ┌─────────────┐
                            │  IDEALISTA  │ │ CONTENTFUL  │
                            │     API     │ │     CMS     │
                            └─────────────┘ └─────────────┘
```

## ⚙️ PREPARACIÓN DEL BACKEND

### 1. Variables de Entorno Necesarias

```env
# Puerto (Railway lo asigna automáticamente)
PORT=3000

# Entorno
NODE_ENV=production

# Idealista API
IDEALISTA_CLIENT_ID=tu_client_id
IDEALISTA_CLIENT_SECRET=tu_client_secret  
IDEALISTA_FEED_KEY=ilc_tu_feed_key

# Contentful
CONTENTFUL_SPACE_ID=tu_space_id
CONTENTFUL_ACCESS_TOKEN=tu_access_token

# CORS (dominios permitidos)
CORS_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com
```

### 2. Modificar server.js para CORS Dinámico

```javascript
// En tu server.js, línea del CORS:
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

## 🚂 DEPLOY EN RAILWAY (RECOMENDADO)

### ¿Por qué Railway?

- ✅ **Gratis hasta 500h/mes** (suficiente para tu web)
- ✅ **Deploy automático** desde GitHub
- ✅ **HTTPS incluido** automáticamente
- ✅ **Variables de entorno** fáciles de configurar
- ✅ **Logs en tiempo real**
- ✅ **Escalado automático**

### Pasos en Railway:

1. **Crear cuenta en [railway.app](https://railway.app)**
2. **"New Project" → "Deploy from GitHub"**
3. **Conectar tu repositorio**
4. **Configurar Build Path**: `backend/`
5. **Configurar Start Command**: `node server.js`
6. **Añadir variables de entorno** (una por una)
7. **Deploy automático**

### URL Resultante:
```
https://tu-proyecto-production.up.railway.app
```

## 🌐 ALTERNATIVAS A RAILWAY

### 1. Render.com
- Similar a Railway
- Plan gratuito disponible
- Auto-deploy desde Git

### 2. Heroku
- Clásico pero de pago
- Muy estable
- Muchos addons

### 3. DigitalOcean App Platform
- $5/mes mínimo
- Muy buena performance
- Escalado automático

## 🔧 ENDPOINTS DE TU BACKEND

Tu backend expone estos endpoints:

```
GET /api/properties          # Lista de propiedades
GET /api/properties/:id      # Detalle de propiedad
GET /api/properties/:id/images # Imágenes de propiedad
GET /api/status             # Estado del servidor
```

## 🧪 TESTING EN PRODUCCIÓN

### 1. Verificar Backend

```bash
# Test básico
curl https://tu-backend.railway.app/api/status

# Test propiedades
curl https://tu-backend.railway.app/api/properties?operation=sale&maxResults=5
```

### 2. Verificar CORS

```javascript
// En consola del navegador (en tu frontend)
fetch('https://tu-backend.railway.app/api/status')
  .then(r => r.json())
  .then(console.log)
```

## 📊 MONITOREO

### Logs en Railway:
- Panel de Railway → Tu proyecto → "View Logs"
- Logs en tiempo real
- Filtros por fecha/nivel

### Métricas importantes:
- **Response time** < 2 segundos
- **Error rate** < 5%
- **Uptime** > 99%

## 🔐 SEGURIDAD

### Headers de Seguridad (añadir a server.js):

```javascript
// Helmet para headers de seguridad
const helmet = require('helmet');
app.use(helmet());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
app.use('/api', limiter);
```

## 💡 OPTIMIZACIONES

### 1. Cache de Tokens
```javascript
// Tu backend ya implementa cache de tokens OAuth2
// No hacer llamadas innecesarias a Idealista
```

### 2. Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Logs Estructurados
```javascript
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});
```

## 🚨 TROUBLESHOOTING

### Error CORS:
- Verificar `CORS_ORIGINS` en variables de entorno
- Incluir `https://` en las URLs

### Error 500:
- Revisar logs en Railway
- Verificar variables de entorno de Idealista

### Error de Contentful:
- Verificar `CONTENTFUL_SPACE_ID` y `CONTENTFUL_ACCESS_TOKEN`

### Backend no responde:
- Verificar que Railway está "deployed"
- Check health endpoint: `/api/status`

---

¿Necesitas ayuda con algún paso específico del deploy?
