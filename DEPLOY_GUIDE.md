# 🚀 Guía de Despliegue - Web Inmobiliaria Erika Casals

## 📋 Opciones de Hosting Recomendadas

### 🌟 **OPCIÓN 1: Vercel (Frontend) + Railway/Render (Backend)**
**✅ Recomendada para principiantes**

**Frontend en Vercel:**
- Deploy automático desde GitHub
- CDN global gratuito
- HTTPS automático
- Dominio personalizado incluido

**Backend en Railway:**
- Deploy automático desde GitHub
- Base de datos incluida si necesitas
- Variables de entorno seguras
- $5/mes aproximadamente

### 🌟 **OPCIÓN 2: Netlify (Frontend) + Heroku (Backend)**
**✅ Opción intermedia**

### 🌟 **OPCIÓN 3: VPS (DigitalOcean/Linode)**
**⚡ Para máximo control**

---

## 🛠️ Preparación para el Deploy

### 1. **Configurar Variables de Entorno**

#### Backend (.env):
```env
# Idealista API
IDEALISTA_CLIENT_ID=your_client_id
IDEALISTA_CLIENT_SECRET=your_client_secret
IDEALISTA_FEED_KEY=your_feed_key

# Contentful
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token

# Server
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

#### Frontend (.env):
```env
VITE_API_URL=https://your-backend.railway.app
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token
```

### 2. **Actualizar URLs del Frontend**

Necesitas cambiar las URLs hardcodeadas por variables de entorno.

---

## 🚢 Deploy Paso a Paso - OPCIÓN 1 (Vercel + Railway)

### 📱 **PASO 1: Deploy del Backend en Railway**

1. **Crear cuenta en Railway**: https://railway.app
2. **Conectar GitHub** y seleccionar tu repositorio
3. **Configurar variables de entorno** en Railway dashboard
4. **Railway detectará automáticamente** que es un proyecto Node.js
5. **Tu backend estará en**: `https://tu-proyecto.railway.app`

### 🌐 **PASO 2: Deploy del Frontend en Vercel**

1. **Crear cuenta en Vercel**: https://vercel.com
2. **Conectar GitHub** y seleccionar tu repositorio
3. **Configurar variables de entorno** en Vercel dashboard
4. **Build settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Tu frontend estará en**: `https://tu-proyecto.vercel.app`

### 🌍 **PASO 3: Configurar Dominio Personalizado**

1. **Comprar dominio** (Namecheap, GoDaddy, etc.)
2. **En Vercel**: Agregar dominio personalizado
3. **Configurar DNS** según instrucciones de Vercel
4. **Tu web estará en**: `https://tudominio.com`

---

## 📝 Archivos de Configuración Necesarios

### Para Railway (Backend):
- `railway.json` (opcional)
- Asegurar que `package.json` tenga `"start": "node server.js"`

### Para Vercel (Frontend):
- `vercel.json` para configuraciones especiales
- Variables de entorno configuradas

---

## 🔧 Modificaciones Necesarias en el Código

### 1. **Backend - Configuración CORS**
```javascript
// En server.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));
```

### 2. **Frontend - URLs Dinámicas**
```javascript
// En lugar de 'http://localhost:3001'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

---

## 💰 Costos Estimados

### Opción Gratuita:
- **Vercel**: Gratis (100GB bandwidth/mes)
- **Railway**: $5/mes después de trial
- **Dominio**: $10-15/año
- **Total**: ~$65/año

### Opción VPS:
- **DigitalOcean Droplet**: $6/mes
- **Dominio**: $10-15/año
- **Total**: ~$87/año

---

## 🚀 Deploy Automático con GitHub Actions

¿Quieres que también configure CI/CD automático para que cada push a main haga deploy automáticamente?

---

## ⚠️ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] URLs hardcodeadas reemplazadas
- [ ] CORS configurado correctamente
- [ ] Build del frontend funciona (`npm run build`)
- [ ] Backend funciona en producción
- [ ] Credenciales de Idealista y Contentful válidas
- [ ] Dominio comprado (opcional)

---

¿Quieres que empecemos con alguna opción específica o necesitas que configure alguno de estos archivos?
