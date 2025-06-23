# 🧪 Guía de Prueba - PropertyList + Backend

## ✅ ¡Sistema completo Frontend + Backend!

He configurado un sistema completo con **frontend React** y **backend Node.js** que se conecta directamente con la API de Idealista Partners.

### 🚀 Para probar el stack completo:

#### Opción 1: Inicio automático (recomendado)

**Windows:**

```bash
# Doble clic en el archivo:
start-full-stack.bat
```

**Linux/macOS:**

```bash
# En terminal:
./start-full-stack.sh
```

#### Opción 2: Inicio manual

1. **Inicia el backend:**

```bash
cd backend
npm install
npm run dev
```

2. **Inicia el frontend (en otra terminal):**

```bash
npm install
npm run dev
```

### 🎯 URLs disponibles:

- **Frontend**: http://localhost:5173/
- **Backend**: http://localhost:5000/
- **Pruebas API**: http://localhost:5173/test
- **Propiedades (mock)**: http://localhost:5173/propiedades

### 🧪 Componente de Pruebas

Visita: **http://localhost:5173/test**

Botones disponibles:

- **⚙️ Estado Backend** - Verifica que el backend responda
- **� Test Conexión** - Prueba OAuth2 con Idealista
- **🧪 Estado Sandbox** - Verifica si Sandbox está disponible
- **🏠 Ver Propiedades** - Obtiene propiedades reales de Idealista
- **👥 Ver Contactos** - Obtiene contactos de Idealista
- **📊 Info Publicación** - Información de la cuenta

### 🔧 Configuración Backend

El backend ya tiene configuradas las credenciales de **sandbox**:

- **Client ID**: wow
- **Client Secret**: JhD6oblLrNlOBwU8ney2Gx1nunwsh2Qy
- **Feed Key**: Necesario para producción (configurar en `/backend/.env`)

### 📁 Estructura de archivos:

```
├── src/components/tests/IdealistaPartnersTest.jsx  # 🧪 Componente de pruebas
├── backend/server.js                               # 🔙 Servidor Node.js + Express
├── backend/.env                                    # 🔧 Variables de entorno backend
├── .env                                           # 🔧 Variables de entorno frontend
├── start-full-stack.bat                          # 🚀 Inicio automático Windows
└── start-full-stack.sh                           # 🚀 Inicio automático Linux/macOS
```

### 🎨 Ventajas del Backend:

- ✅ **Sin problemas de CORS** - El backend maneja las llamadas a Idealista
- ✅ **Credenciales seguras** - Las credenciales están en el servidor, no en el navegador
- ✅ **Autenticación OAuth2** - Manejo automático de tokens
- ✅ **Logs detallados** - Puedes ver qué está pasando en la consola del backend
- ✅ **Manejo de errores** - Respuestas estructuradas y detalladas

### � Endpoints del Backend:

- `GET /api/status` - Estado del servicio
- `GET /api/test` - Test de conectividad con Idealista
- `GET /api/sandbox-status` - Estado del sandbox
- `GET /api/properties` - Obtener propiedades (con paginación)
- `GET /api/properties/:id` - Obtener propiedad específica
- `GET /api/contacts` - Obtener contactos
- `GET /api/publish-info` - Información de publicación

### 🔧 Configuración de Producción:

Para usar credenciales reales, edita `/backend/.env`:

```env
IDEALISTA_CLIENT_ID=tu_client_id_real
IDEALISTA_CLIENT_SECRET=tu_client_secret_real
IDEALISTA_FEED_KEY=ilc_tu_feed_key_real
NODE_ENV=production
```

### 🎯 Para obtener credenciales de Idealista:

1. Regístrate en: https://developers.idealista.com/
2. Solicita acceso a Partners API
3. Configura las credenciales en `/backend/.env`

### 💡 Tips para debugging:

1. **Verifica logs del backend** - La consola muestra detalles de cada petición
2. **Usa el componente de pruebas** - http://localhost:5173/test
3. **Revisa el estado del sandbox** - Puede estar en mantenimiento
4. **Verifica las variables de entorno** - Tanto frontend como backend

---

**🎉 ¡Stack completo listo!** Frontend + Backend + API Tests integrados.
