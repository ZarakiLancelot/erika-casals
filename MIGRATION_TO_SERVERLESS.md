# 🚀 GUÍA COMPLETA: MIGRACIÓN A SERVERLESS CON VERCEL

## ✅ ¿Qué hemos hecho?

### 1. **Estructura Serverless Creada**
```
/api/
├── _lib/
│   └── idealistaService.js    # Servicio compartido de Idealista
├── status.js                  # GET /api/status
├── test.js                    # GET /api/test  
├── properties.js              # GET /api/properties
├── properties/
│   ├── [id].js               # GET /api/properties/123
│   └── [id]/
│       └── images.js         # GET /api/properties/123/images
├── contacts.js               # GET /api/contacts
├── publish-info.js           # GET /api/publish-info
└── sandbox-status.js         # GET /api/sandbox-status
```

### 2. **Configuración Actualizada**
- ✅ `vercel.json` configurado para funciones serverless
- ✅ `package.json` actualizado con `node-fetch`
- ✅ `.env.example` con todas las variables necesarias
- ✅ CORS configurado en todas las funciones

---

## 🚀 PASOS PARA DEPLOY EN VERCEL

### **Paso 1: Instalar dependencias**
```bash
npm install
```

### **Paso 2: Probar en local (opcional)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Probar funciones serverless localmente
vercel dev
```

### **Paso 3: Deploy a Vercel**
```bash
# Primer deploy
vercel

# Deployments posteriores
vercel --prod
```

### **Paso 4: Configurar Variables de Entorno en Vercel**

1. Ve a [vercel.com](https://vercel.com) y entra a tu proyecto
2. Ve a **Settings > Environment Variables**
3. Agrega estas variables:

```
IDEALISTA_CLIENT_ID = tu_client_id
IDEALISTA_CLIENT_SECRET = tu_client_secret  
IDEALISTA_FEED_KEY = tu_feed_key
NODE_ENV = production
VITE_API_URL = https://tu-dominio.vercel.app
```

**⚠️ IMPORTANTE:** 
- Variables sin `VITE_` = Solo backend (seguras)
- Variables con `VITE_` = Frontend (públicas)

### **Paso 5: Conectar Dominio de GoDaddy**

1. **En Vercel:**
   - Ve a Settings > Domains
   - Agrega tu dominio: `tudominio.com`
   - Copia los registros DNS que te muestra

2. **En GoDaddy:**
   - Ve a DNS Management
   - Agrega/modifica estos registros:
   ```
   Tipo: A
   Nombre: @
   Valor: 76.76.19.61
   
   Tipo: CNAME  
   Nombre: www
   Valor: cname.vercel-dns.com
   ```

3. **Espera 24-48 horas** para propagación DNS

---

## 🧪 TESTING

### **Endpoints Disponibles:**
```
GET https://tu-dominio.com/api/status
GET https://tu-dominio.com/api/test
GET https://tu-dominio.com/api/properties
GET https://tu-dominio.com/api/properties/123
GET https://tu-dominio.com/api/properties/123/images
GET https://tu-dominio.com/api/contacts
GET https://tu-dominio.com/api/publish-info
GET https://tu-dominio.com/api/sandbox-status
```

### **Test Rápido:**
```bash
# Test de estado
curl https://tu-dominio.com/api/status

# Test de conectividad con Idealista
curl https://tu-dominio.com/api/test
```

---

## 🔧 COMPARACIÓN: ANTES vs DESPUÉS

### **ANTES (Express Server)**
- ❌ Servidor 24/7 en Railway ($$$)
- ❌ Escalabilidad limitada
- ❌ Mantenimiento de servidor
- ❌ Cold starts en Railway gratis

### **DESPUÉS (Vercel Serverless)**
- ✅ Completamente GRATIS hasta 100GB bandwidth
- ✅ Escalabilidad automática infinita
- ✅ Cero mantenimiento
- ✅ Edge functions (más rápido)
- ✅ Frontend + Backend en el mismo dominio

---

## 📱 ACTUALIZAR FRONTEND

Tu frontend ya debería funcionar sin cambios, pero puedes actualizar `VITE_API_URL`:

**Desarrollo Local:**
```bash
VITE_API_URL=http://localhost:3000
```

**Producción:**
```bash
VITE_API_URL=https://tu-dominio.com
```

**⭐ VENTAJA:** Como frontend y backend están en el mismo dominio, puedes usar rutas relativas:

```javascript
// En lugar de:
const response = await fetch(`${process.env.VITE_API_URL}/api/properties`);

// Puedes usar:
const response = await fetch('/api/properties');
```

---

## 🛡️ SEGURIDAD

- ✅ Variables de entorno **NUNCA** se exponen al cliente
- ✅ CORS configurado correctamente
- ✅ Headers de seguridad en `vercel.json`
- ✅ Solo las variables `VITE_*` son públicas

---

## 📞 PRÓXIMOS PASOS

1. **Deploy inmediato:** `vercel --prod`
2. **Configurar variables de entorno**
3. **Probar todos los endpoints**
4. **Conectar dominio de GoDaddy**
5. **¡Tu app estará 100% serverless y GRATIS!**

¿Alguna duda sobre algún paso?
