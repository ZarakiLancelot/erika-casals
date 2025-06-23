# 🚀 Integración Frontend + Backend - Idealista API

## ✅ ¡Integración Completada!

He modificado exitosamente el componente `IdealistaPartnersTest.jsx` para que consuma los endpoints de tu backend Node.js en lugar de llamar directamente a la API de Idealista. Esto soluciona todos los problemas de CORS y mantiene las credenciales seguras.

## 🔄 Cambios Realizados

### 1. Modificación del Componente de Pruebas

**Archivo**: `src/components/tests/IdealistaPartnersTest.jsx`

**Antes**: Llamaba directamente a `https://partners-sandbox.idealista.com`
**Ahora**: Llama a `http://localhost:5000/api/*`

### 2. Nuevo Servicio Backend

**Clase**: `BackendIdealistaService`

- ✅ Conecta con tu backend local
- ✅ Maneja todos los endpoints disponibles
- ✅ Gestión de errores mejorada
- ✅ URLs configurables vía variables de entorno

### 3. Nuevos Botones de Prueba

- **⚙️ Estado Backend** - Verifica que el backend responda
- **🔐 Test Conexión** - Prueba OAuth2 con Idealista via backend
- **🧪 Estado Sandbox** - Verifica si Sandbox está disponible
- **🏠 Ver Propiedades** - Obtiene propiedades reales de Idealista
- **👥 Ver Contactos** - Obtiene contactos de Idealista
- **📊 Info Publicación** - Información de la cuenta

### 4. Variables de Entorno

**Frontend** (`.env`):

```env
VITE_BACKEND_URL=http://localhost:5000
```

**Backend** (`backend/.env`):

```env
IDEALISTA_CLIENT_ID=wow
IDEALISTA_CLIENT_SECRET=JhD6oblLrNlOBwU8ney2Gx1nunwsh2Qy
IDEALISTA_FEED_KEY=ilc_tu_feed_key_real
NODE_ENV=development
PORT=5000
```

## 🎯 Cómo Probar la Integración

### Opción 1: Inicio Automático (Recomendado)

**Windows**:

```bash
# Doble clic en:
start-full-stack.bat
```

**Linux/macOS**:

```bash
./start-full-stack.sh
```

### Opción 2: Inicio Manual

1. **Terminal 1 - Backend**:

```bash
cd backend
npm run dev
```

2. **Terminal 2 - Frontend**:

```bash
npm run dev
```

### Opción 3: Probar Solo el Backend

```bash
cd backend
npm run dev

# Luego visita en el navegador:
# http://localhost:5000/api/status
# http://localhost:5000/api/test
```

## 📊 Endpoints Disponibles

| Endpoint              | Método | Descripción                  |
| --------------------- | ------ | ---------------------------- |
| `/api/status`         | GET    | Estado del servicio          |
| `/api/test`           | GET    | Test de conectividad OAuth2  |
| `/api/sandbox-status` | GET    | Estado del sandbox           |
| `/api/properties`     | GET    | Obtener propiedades          |
| `/api/properties/:id` | GET    | Obtener propiedad específica |
| `/api/contacts`       | GET    | Obtener contactos            |
| `/api/publish-info`   | GET    | Información de publicación   |

## 🧪 Componente de Pruebas

**URL**: http://localhost:5173/test

El componente ahora:

- ✅ **Se conecta al backend** en lugar de directamente a Idealista
- ✅ **Evita problemas de CORS**
- ✅ **Mantiene credenciales seguras** en el servidor
- ✅ **Muestra respuestas estructuradas** del backend
- ✅ **Logs detallados** en la consola del backend

## 🎨 Ventajas de la Integración

### ✅ Seguridad

- Las credenciales están en el servidor, no en el navegador
- No hay exposición de API keys en el código frontend

### ✅ Sin CORS

- El frontend llama a tu backend (mismo dominio en desarrollo)
- El backend llama a Idealista (server-to-server)

### ✅ Manejo de Tokens

- OAuth2 automático en el backend
- Renovación automática de tokens
- Cache de tokens por seguridad

### ✅ Debugging

- Logs detallados en la consola del backend
- Respuestas estructuradas con timestamps
- Manejo de errores centralizado

## 🔧 Configuración de Producción

Para usar en producción con credenciales reales:

1. **Configura `/backend/.env`**:

```env
IDEALISTA_CLIENT_ID=tu_client_id_real
IDEALISTA_CLIENT_SECRET=tu_client_secret_real
IDEALISTA_FEED_KEY=ilc_tu_feed_key_real
NODE_ENV=production
PORT=5000
```

2. **Configura `/frontend/.env`**:

```env
VITE_BACKEND_URL=https://tu-backend-produccion.com
```

## 🚨 Solución de Problemas

### Backend no responde

```bash
# Verifica que esté corriendo:
curl http://localhost:5000/api/status
```

### Frontend no conecta con backend

- Verifica `VITE_BACKEND_URL` en `.env`
- Asegúrate de que el backend esté en puerto 5000

### Sandbox en mantenimiento

- Es normal que el sandbox de Idealista esté en mantenimiento
- El componente de pruebas te mostrará el estado claramente

### Credenciales inválidas

- Verifica las credenciales en `/backend/.env`
- Para producción necesitas el `IDEALISTA_FEED_KEY`

## 📁 Archivos Modificados

```
📁 d:\Proyectos\erika\
├── 📄 src/components/tests/IdealistaPartnersTest.jsx (MODIFICADO)
├── 📄 .env (ACTUALIZADO)
├── 📄 .env.example (ACTUALIZADO)
├── 📄 TESTING_GUIDE.md (ACTUALIZADO)
├── 📄 start-full-stack.bat (NUEVO)
├── 📄 start-full-stack.sh (NUEVO)
└── 📄 INTEGRACION_BACKEND.md (NUEVO - este archivo)
```

## 🎯 Próximos Pasos

1. **Probar la integración** - Usar los scripts de inicio automático
2. **Verificar endpoints** - Usar el componente de pruebas
3. **Obtener credenciales reales** - Registrarse en Idealista Partners
4. **Integrar con PropertyList** - Modificar el hook `useIdealista.jsx` para usar el backend
5. **Deploy en producción** - Configurar variables de entorno para producción

---

**🎉 ¡Integración completada exitosamente!**

Ahora tienes un stack completo Frontend + Backend que puede consumir la API de Idealista de forma segura y sin problemas de CORS.
