# GUÍA RÁPIDA - SUBIR TU PROYECTO A PRODUCCIÓN

## 🚀 TU PROYECTO ESTÁ CASI LISTO

Tu backend es **perfecto para subir tal como está**. Solo necesitas:

### ✅ Lo que YA funciona:

- ✅ Backend con llamadas a Idealista API
- ✅ Integración con Contentful
- ✅ Frontend que consume el backend
- ✅ Variables de entorno configuradas

### 🔧 Lo que necesitas ajustar:

---

## 📋 PASOS ESPECÍFICOS:

### **PASO 1: Crear archivo .env para PRODUCCIÓN (Backend)**

Crear: `backend/.env.production`

```env
# Credenciales Idealista (las mismas que tienes)
IDEALISTA_CLIENT_ID=wow
IDEALISTA_CLIENT_SECRET=JhD6oblLrNlOBwU8ney2Gx1nunwsh2Qy
IDEALISTA_FEED_KEY=ilc354251bc1c9d995a017e7693419be6d178b34ac0

# Configuración de producción
NODE_ENV=production
PORT=3000

# Contentful (las mismas que tienes)
CONTENTFUL_SPACE_ID=xk30tamkxmyl
CONTENTFUL_ACCESS_TOKEN=L8gcA69KN0wRCHK_dACQwTUaMzlkcTpB_i5V8gKPBLw
```

### **PASO 2: Crear archivo .env para PRODUCCIÓN (Frontend)**

Crear: `.env.production`

```env
# URL del backend EN PRODUCCIÓN (cambiar cuando sepas la URL)
VITE_BACKEND_URL=https://tu-backend-en-produccion.com

# Contentful (las mismas)
VITE_CONTENTFUL_SPACE_ID=xk30tamkxmyl
VITE_CONTENTFUL_ACCESS_TOKEN=L8gcA69KN0wRCHK_dACQwTUaMzlkcTpB_i5V8gKPBLw
VITE_CONTENTFUL_ENVIRONMENT=master
```

---

## 🎯 OPCIONES DE DEPLOY:

### **OPCIÓN A: TODO EN IONOS VPS** (Si tienes VPS)

- Frontend + Backend en el mismo servidor
- Más económico
- Configuración manual requerida

### **OPCIÓN B: IONOS + RAILWAY** (Más fácil)

- Frontend en IONOS
- Backend en Railway (gratis)
- Deploy automático

---

## 🚀 PROCESO RECOMENDADO (OPCIÓN B):

### **1. Deploy Backend en Railway:**

1. Subir tu proyecto a GitHub
2. Conectar Railway a tu repo
3. Configurar variables de entorno en Railway
4. Railway te da una URL: `https://tu-proyecto.up.railway.app`

### **2. Actualizar Frontend:**

```env
# En .env.production
VITE_BACKEND_URL=https://tu-proyecto.up.railway.app
```

### **3. Build y Subir Frontend a IONOS:**

```bash
npm run build
# Subir carpeta 'dist' a IONOS
```

---

## 💡 **RESPUESTA SIMPLE:**

### **¿Puedes subirlo tal cual?**

- ✅ **Backend**: SÍ, funciona perfecto
- ⚠️ **Frontend**: Solo cambiar `VITE_BACKEND_URL` para que apunte al backend en producción

### **¿Qué .env cambiar?**

- **Backend**: Cambiar `NODE_ENV=production` y `PORT=3000`
- **Frontend**: Cambiar `VITE_BACKEND_URL` a la URL de producción

### **¿Algo más?**

- ❌ NO necesitas cambiar el código
- ❌ NO necesitas cambiar las credenciales de Idealista
- ❌ NO necesitas cambiar Contentful
- ✅ Solo las URLs entre desarrollo/producción

---

**¿Qué opción prefieres? ¿Todo en IONOS o Backend en Railway?**
