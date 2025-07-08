# 🚀 GUÍA COMPLETA: DEPLOY EN VERCEL (FRONTEND + BACKEND SERVERLESS)

## 📋 PRERREQUISITOS

✅ Proyecto React + API de Idealista  
✅ Cuenta en [Vercel](https://vercel.com)  
✅ Vercel CLI instalado: `npm i -g vercel`  
✅ Variables de entorno de Idealista configuradas  

---

## 🏗️ PASO 1: PREPARAR LA ESTRUCTURA SERVERLESS

### 1.1 Crear estructura de API serverless
```bash
mkdir api
```

### 1.2 Mover el backend a funciones serverless
Crea estos archivos en la carpeta `api/`:

**`api/properties.js`** (Lista de propiedades)
```javascript
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Tu lógica de API de Idealista aquí
    const response = await fetch('https://api.idealista.com/3.5/es/search', {
      headers: {
        'Authorization': `Bearer ${process.env.IDEALISTA_ACCESS_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching properties' });
  }
}
```

**`api/properties/[id].js`** (Propiedad específica)
```javascript
export default async function handler(req, res) {
  const { id } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Lógica para obtener propiedad por ID
    const response = await fetch(`https://api.idealista.com/3.5/es/search?propertyCode=${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.IDEALISTA_ACCESS_TOKEN}`
      }
    });
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching property' });
  }
}
```

**`api/properties/[id]/images.js`** (Imágenes de propiedad)
```javascript
export default async function handler(req, res) {
  const { id } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Lógica para obtener imágenes
    const images = await getPropertyImages(id);
    res.status(200).json({ success: true, data: { images } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching images' });
  }
}
```

---

## 🛠️ PASO 2: CONFIGURAR VERCEL

### 2.1 Crear `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

### 2.2 Actualizar `package.json`
Asegúrate de que tengas estos scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "node-fetch": "^3.3.2"
  }
}
```

---

## 🔐 PASO 3: CONFIGURAR VARIABLES DE ENTORNO

### 3.1 Crear `.env.example`
```bash
# Variables para el backend (seguras)
IDEALISTA_CLIENT_ID=tu_client_id
IDEALISTA_CLIENT_SECRET=tu_client_secret
IDEALISTA_ACCESS_TOKEN=tu_access_token
IDEALISTA_FEED_KEY=tu_feed_key

# Variables para el frontend (públicas)
VITE_API_URL=https://tu-dominio.vercel.app
```

### 3.2 Crear `.env.local` para desarrollo
```bash
# Copia el contenido de .env.example y rellena con tus valores reales
IDEALISTA_CLIENT_ID=abc123...
IDEALISTA_CLIENT_SECRET=def456...
# etc...
```

---

## 🚀 PASO 4: HACER DEPLOY

### 4.1 Deploy inicial
```bash
# Instalar dependencias
npm install

# Login en Vercel (si no lo has hecho)
vercel login

# Primer deploy
vercel

# Seguir las instrucciones:
# - Set up and deploy "~/erika"? [Y/n] Y
# - Which scope? (tu cuenta)
# - Link to existing project? [y/N] N
# - Project name: erika
# - In which directory is your code located? ./
```

### 4.2 Deploy de producción
```bash
vercel --prod
```

---

## ⚙️ PASO 5: CONFIGURAR VARIABLES EN VERCEL

1. Ve a [vercel.com](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings > Environment Variables**
4. Agrega estas variables:

| Variable | Valor | Environment |
|----------|-------|------------|
| `IDEALISTA_CLIENT_ID` | tu_client_id | Production |
| `IDEALISTA_CLIENT_SECRET` | tu_client_secret | Production |
| `IDEALISTA_ACCESS_TOKEN` | tu_access_token | Production |
| `IDEALISTA_FEED_KEY` | tu_feed_key | Production |
| `VITE_API_URL` | https://tu-proyecto.vercel.app | Production |

**⚠️ IMPORTANTE:**
- Variables **SIN** `VITE_` = Solo para backend (seguras)
- Variables **CON** `VITE_` = Accesibles desde frontend (públicas)

---

## 🌐 PASO 6: CONFIGURAR DOMINIO PERSONALIZADO (OPCIONAL)

### 6.1 En Vercel
1. Ve a **Settings > Domains**
2. Agrega tu dominio: `tudominio.com`
3. Copia los registros DNS que te muestra

### 6.2 En tu proveedor de DNS (GoDaddy, etc.)
```
Tipo: A
Nombre: @
Valor: 76.76.19.61
TTL: 600

Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
TTL: 600
```

---

## 🧪 PASO 7: PROBAR EL DEPLOY

### 7.1 Endpoints disponibles
```bash
# Estado general
curl https://tu-proyecto.vercel.app/api/status

# Lista de propiedades
curl https://tu-proyecto.vercel.app/api/properties

# Propiedad específica
curl https://tu-proyecto.vercel.app/api/properties/123

# Imágenes de propiedad
curl https://tu-proyecto.vercel.app/api/properties/123/images
```

### 7.2 Verificar frontend
Visita: `https://tu-proyecto.vercel.app`

---

## 🔧 PASO 8: ACTUALIZAR CÓDIGO FRONTEND

### 8.1 Actualizar URLs de API
En tu código React, actualiza las llamadas a la API:

**Antes:**
```javascript
const response = await fetch('http://localhost:5000/api/properties');
```

**Después (opción 1 - URL absoluta):**
```javascript
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/properties`);
```

**Después (opción 2 - URL relativa, recomendado):**
```javascript
const response = await fetch('/api/properties');
```

### 8.2 Ejemplo de hook actualizado
```javascript
// hooks/useIdealistaProperties.js
const useIdealistaProperties = () => {
  const fetchProperties = async () => {
    try {
      // URL relativa funciona porque frontend y backend están en el mismo dominio
      const response = await fetch('/api/properties');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return null;
    }
  };

  const fetchPropertyById = async (id) => {
    try {
      const response = await fetch(`/api/properties/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching property:', error);
      return null;
    }
  };

  const fetchPropertyImages = async (id) => {
    try {
      const response = await fetch(`/api/properties/${id}/images`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching images:', error);
      return null;
    }
  };

  return {
    fetchProperties,
    fetchPropertyById,
    fetchPropertyImages
  };
};
```

---

## 🎯 VENTAJAS DE ESTA CONFIGURACIÓN

✅ **Completamente GRATIS** hasta 100GB bandwidth/mes  
✅ **Escalabilidad automática** infinita  
✅ **Cero mantenimiento** de servidor  
✅ **Frontend + Backend** en el mismo dominio  
✅ **Edge functions** super rápidas  
✅ **Deploy automático** con Git  
✅ **HTTPS gratis** con SSL automático  

---

## 🚨 TROUBLESHOOTING

### Error: "Function not found"
- Verifica que los archivos estén en `/api/`
- Verifica que tengan `export default function handler`

### Error: CORS
- Asegúrate de tener los headers CORS en cada función
- Verifica `vercel.json` headers configuration

### Error: Variables de entorno
- Verifica que estén configuradas en Vercel Dashboard
- Re-deploy después de agregar variables: `vercel --prod`

### Error: Build failed
- Verifica `package.json` scripts
- Verifica que `dist` folder se genere correctamente

---

## 📞 COMANDOS ÚTILES

```bash
# Deploy development
vercel

# Deploy production
vercel --prod

# Ver logs
vercel logs

# Ver dominios
vercel domains

# Ver proyectos
vercel ls

# Eliminar proyecto
vercel remove tu-proyecto
```

---

## 🎉 ¡LISTO!

Tu aplicación ahora está:
- ✅ **100% Serverless**
- ✅ **Frontend React optimizado**
- ✅ **API backend escalable**
- ✅ **Dominio personalizado**
- ✅ **HTTPS automático**
- ✅ **Deploy continuo con Git**

**URL final:** `https://tu-proyecto.vercel.app` o `https://tudominio.com`

¿Alguna duda sobre algún paso? 🤔
