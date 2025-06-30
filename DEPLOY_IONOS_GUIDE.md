# GUÍA DE DESPLIEGUE PARA IONOS - WEB INMOBILIARIA ERIKA

## 📋 RESUMEN DEL PROCESO

Para subir tu web inmobiliaria a IONOS necesitas:

1. **Frontend**: Build estático (HTML, CSS, JS)
2. **Backend**: Servidor Node.js con tu proveedor de hosting
3. **Base de datos**: No necesaria (usas APIs externas)

## 🎯 OPCIÓN 1: IONOS SHARED HOSTING (Más Simple)

### Frontend en IONOS + Backend en Railway/Render

**Frontend (IONOS Shared Hosting):**

- Solo archivos estáticos (HTML, CSS, JS)
- No puede ejecutar Node.js
- Ideal para el frontend React buildado

**Backend (Servicio externo):**

- Railway.app (recomendado)
- Render.com
- Heroku
- DigitalOcean App Platform

## 🎯 OPCIÓN 2: IONOS VPS (Más Control)

### Frontend + Backend en el mismo servidor VPS

**Requisitos:**

- IONOS VPS Cloud Server
- Ubuntu/CentOS
- Node.js 18+
- Nginx como proxy reverso
- PM2 para gestión de procesos
- SSL/TLS con Let's Encrypt

---

## 🚀 PROCESO DETALLADO - OPCIÓN 1 (RECOMENDADO)

### PASO 1: Preparar el Frontend para Producción

```bash
# En tu directorio del proyecto
npm run build

# Esto genera una carpeta 'dist' con archivos estáticos
```

### PASO 2: Configurar Variables de Entorno

Crea archivo `.env.production` en la raíz del proyecto:

```env
VITE_API_URL=https://tu-backend.railway.app
VITE_CONTENTFUL_SPACE_ID=tu_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=tu_token
```

### PASO 3: Deploy del Backend (Railway.app)

1. Crear cuenta en railway.app
2. Conectar tu repositorio GitHub
3. Configurar variables de entorno en Railway
4. Deploy automático

### PASO 4: Subir Frontend a IONOS

1. Panel de control IONOS
2. Subir contenido de la carpeta `dist` al directorio raíz
3. Configurar dominio

---

## 🛠️ PROCESO DETALLADO - OPCIÓN 2 (VPS)

### Configuración Completa del Servidor

```bash
# Conectar al VPS por SSH
ssh root@tu-servidor-ionos.com

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Instalar PM2 globalmente
npm install -g pm2

# Instalar Nginx
apt install nginx -y

# Instalar Certbot para SSL
apt install certbot python3-certbot-nginx -y
```

---

## 📁 ESTRUCTURA DE ARCHIVOS PARA DEPLOY

### Para IONOS Shared Hosting (Opción 1):

```
tu-dominio.com/
├── index.html          (del build)
├── assets/             (CSS, JS compilados)
├── images/             (tus imágenes)
└── icons/              (tus iconos)
```

### Para IONOS VPS (Opción 2):

```
/var/www/erika-inmobiliaria/
├── frontend/           (build del React)
├── backend/            (tu servidor Node.js)
├── nginx.conf          (configuración proxy)
└── ecosystem.config.js (configuración PM2)
```

---

## 🔐 CONFIGURACIÓN DE SEGURIDAD

### Variables de Entorno Sensibles

- API Keys de Idealista
- Tokens de Contentful
- Configuración de CORS
- Configuración SSL

### CORS para Producción

```javascript
app.use(
	cors({
		origin: ['https://tu-dominio.com', 'https://www.tu-dominio.com'],
		credentials: true
	})
);
```

---

## 💰 COSTOS ESTIMADOS

### Opción 1 (Shared + Railway):

- IONOS Shared: ~5-15€/mes
- Railway Backend: $5-20/mes
- **Total: ~15-35€/mes**

### Opción 2 (VPS):

- IONOS VPS: ~10-30€/mes
- **Total: ~10-30€/mes**

---

## 📞 PASOS INMEDIATOS

1. **Decidir opción** (Shared + Railway vs VPS)
2. **Configurar variables de entorno**
3. **Hacer build del frontend**
4. **Deploy del backend**
5. **Subir frontend a IONOS**
6. **Configurar dominio y SSL**

¿Qué opción prefieres? Te ayudo con el proceso específico.
