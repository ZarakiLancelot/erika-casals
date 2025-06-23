# 🚀 Instrucciones Rápidas - PropertyListExample con Backend

## ✅ Cambios Realizados

He modificado el `PropertyListExample.jsx` para que ahora:

1. **Consume datos del backend** en lugar de usar solo el hook interno
2. **Muestra el origen de los datos** (backend real vs datos de prueba)
3. **Incluye información de estado** y posibilidad de recargar
4. **Es compatible** tanto con datos reales de Idealista como con mock data

## 🎯 Para Probar Ahora

### 1. Inicia ambos servicios:

**Opción A - Script automático:**

```bash
# Windows: doble clic en start-full-stack.bat
# Linux/macOS: ./start-full-stack.sh
```

**Opción B - Manual:**

```bash
# Terminal 1 - Backend:
cd backend
npm run dev

# Terminal 2 - Frontend:
npm run dev
```

### 2. Visita las URLs:

- **PropertyListExample**: http://localhost:5173/propiedades
- **Componente de Tests**: http://localhost:5173/test

## 🎨 Lo que verás

### Si el backend está corriendo:

- 🌐 **Banner verde**: "Datos Reales - Conectado con Idealista Partners API vía backend"
- 📊 **Estadísticas**: Número de propiedades encontradas
- 🔄 **Botón actualizar**: Para recargar datos

### Si el backend NO está corriendo:

- 📦 **Banner amarillo**: "Datos de Prueba - El backend no está disponible"
- 🏠 **Mock data**: 4 propiedades de ejemplo
- ℹ️ **Instrucción**: "Inicia el backend (puerto 5000) para ver datos reales"

## 🔧 Archivos Modificados

1. **PropertyListExample.jsx**:

   - Usa `useBackendProperties` en lugar de solo mock data
   - Muestra información del estado de conexión
   - Incluye botones de recarga y estadísticas

2. **useBackendProperties.jsx** (NUEVO):

   - Hook que conecta con el backend
   - Fallback automático a mock data si el backend no responde
   - Transformación de datos de Idealista al formato del componente

3. **PropertyList.jsx**:
   - Acepta propiedades externas via props
   - Compatible con ambos formatos de datos
   - Navegación de imágenes mejorada

## 🧪 Flujo de Datos

```
PropertyListExample
       ↓
useBackendProperties
       ↓
BackendPropertyService
       ↓
http://localhost:5000/api/properties
       ↓
Backend Node.js + Express
       ↓
Idealista Partners API
```

### Si algo falla:

```
❌ Backend no responde
       ↓
⚠️ Console warning
       ↓
📦 Fallback a mock data
       ↓
✅ Usuario ve propiedades de ejemplo
```

## 🎯 Próximos Pasos

1. **Prueba el backend**: http://localhost:5000/api/status
2. **Prueba las APIs**: http://localhost:5173/test
3. **Ve las propiedades**: http://localhost:5173/propiedades
4. **Verifica los logs**: Consola del backend muestra llamadas detalladas

## 💡 Tips de Debugging

- **Backend logs**: La consola del backend muestra cada petición
- **Frontend console**: `F12` → Console para ver warnings/errors
- **Network tab**: `F12` → Network para ver las llamadas HTTP
- **Estado del backend**: `curl http://localhost:5000/api/status`

---

**🎉 ¡Listo para probar!**

Ve a http://localhost:5173/propiedades y disfruta del nuevo sistema integrado.
