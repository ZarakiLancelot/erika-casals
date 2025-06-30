# 🚂 GUÍA RAILWAY - DEPLOY GRATUITO DEL BACKEND

## ✅ **¿POR QUÉ RAILWAY ES PERFECTO PARA TI?**

- ✅ **500 horas gratis/mes** (equivale a ~20 días 24/7)
- ✅ **Deploy automático** desde GitHub
- ✅ **HTTPS incluido** automáticamente
- ✅ **Variables de entorno** fáciles de configurar
- ✅ **Logs en tiempo real**
- ✅ **No necesita tarjeta de crédito** para empezar

---

## 🚀 **PROCESO PASO A PASO:**

### **PASO 1: Preparar el Proyecto**

Tu proyecto ya está listo! Railway detectará automáticamente:

- ✅ `backend/package.json` con `"start": "node server.js"`
- ✅ `backend/server.js` funcionando
- ✅ **Node.js** automáticamente (sin necesidad de Dockerfile)
- ✅ Variables de entorno desde Railway Dashboard

**🎯 Dockerfile renombrado a `.optional`** para usar detección automática.

### **PASO 2: Subir a GitHub**

```bash
# Si no lo has hecho aún
git add .
git commit -m "Preparado para deploy en Railway"
git push origin main
```

### **PASO 3: Deploy en Railway**

1. **Ir a [railway.app](https://railway.app)**
2. **"Login with GitHub"**
3. **"New Project"**
4. **"Deploy from GitHub repo"**
5. **Seleccionar tu repositorio**

### **PASO 4: Configurar el Proyecto**

#### **4.1 Configuración Básica:**

- **Root Directory**: `backend`
- **Start Command**: `node server.js`
- **Build Command**: `npm install`

#### **4.2 Variables de Entorno:**

En Railway → Settings → Variables, añadir:

```
IDEALISTA_CLIENT_ID=wow
IDEALISTA_CLIENT_SECRET=JhD6oblLrNlOBwU8ney2Gx1nunwsh2Qy
IDEALISTA_FEED_KEY=ilc354251bc1c9d995a017e7693419be6d178b34ac0
NODE_ENV=production
CONTENTFUL_SPACE_ID=xk30tamkxmyl
CONTENTFUL_ACCESS_TOKEN=L8gcA69KN0wRCHK_dACQwTUaMzlkcTpB_i5V8gKPBLw
```

**⚠️ NO pongas PORT, Railway lo asigna automáticamente**

### **PASO 5: Deploy Automático**

Railway hará el deploy automáticamente y te dará una URL como:

```
https://tu-proyecto-production-abc123.up.railway.app
```

---

## 🔍 **ENCONTRAR LA URL DEL DEPLOY:**

### **¿Dónde está la URL?**

1. **Railway Dashboard** → Tu proyecto
2. **En la parte superior** → URL automática generada
3. **O en "Settings" → "Domains"**

### **Formato de la URL:**

```
https://tu-proyecto-production-abc123.up.railway.app
```

### **Probar que funciona:**

```bash
curl https://tu-url-de-railway.up.railway.app/api/status
```

### **Debería devolver:**

```json
{ "status": "OK", "timestamp": "2024-12-06T..." }
```

---

## 🔧 **CONFIGURAR EL FRONTEND**

Una vez que tengas la URL de Railway:

1. **Actualizar `.env.production`:**

```env
VITE_BACKEND_URL=https://tu-proyecto-production-abc123.up.railway.app
```

2. **Hacer build del frontend:**

```bash
npm run build
```

3. **Subir carpeta `dist` a IONOS**

---

## 📊 **MONITOREO Y LOGS**

### **Ver logs en tiempo real:**

- Railway Dashboard → Tu proyecto → "View Logs"

### **Verificar que funciona:**

```bash
# Test desde terminal
curl https://tu-proyecto.up.railway.app/api/status

# Debería devolver algo como:
# {"status":"OK","timestamp":"2024-12-06T..."}
```

---

## 💡 **TIPS IMPORTANTES:**

### **Variables de Entorno:**

- ❌ **NO** subas archivos `.env` a GitHub
- ✅ **SÍ** configura las variables en Railway Dashboard
- ✅ Railway lee las variables automáticamente

### **Puerto:**

- ❌ **NO** configures `PORT` en Railway
- ✅ Railway asigna el puerto automáticamente
- ✅ Tu código ya usa `process.env.PORT || 5000`

### **Redeploy Automático:**

- Cada `git push` → Redeploy automático
- Cambios en variables → Reinicio automático

---

## 🎯 **CHECKLIST FINAL:**

- [ ] Proyecto subido a GitHub
- [ ] Cuenta creada en Railway
- [ ] Proyecto conectado en Railway
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso (URL generada)
- [ ] Backend responde en `/api/status`
- [ ] Frontend actualizado con nueva URL
- [ ] Build del frontend hecho
- [ ] Frontend subido a IONOS

---

## 🚨 **TROUBLESHOOTING:**

### **Error: "Application failed to respond"**

- Verificar que `server.js` usa `process.env.PORT`
- Revisar logs en Railway

### **Error: "Module not found"**

- Verificar que `package.json` tiene todas las dependencias
- Railway ejecuta `npm install` automáticamente

### **Error CORS:**

- Tu backend ya tiene CORS configurado
- Debería funcionar automáticamente

---

**¿Listo para empezar con Railway? ¿Tienes alguna pregunta específica?**
