# 🚀 Guía de Despliegue - Sistema FTP de Idealista

## ⚠️ IMPORTANTE: Plan Gratuito de Vercel

Este sistema usa **GitHub Actions (gratis)** para las actualizaciones automáticas.
NO requiere Vercel Pro - funciona perfectamente con el plan gratuito.

---

## 1️⃣ Configurar GitHub Secrets

Ve a: `https://github.com/adrian-lafuerza/erika/settings/secrets/actions`

Crea estos 3 secrets:

### IDEALISTA_FTP_HOST
```
ftp.habitania.com
```

### IDEALISTA_FTP_USER
```
es117868528
```

### IDEALISTA_FTP_PASSWORD
```
J7Mau=$X*N+@&7RI
```

---

## 2️⃣ Commit y Push

```bash
git add .
git commit -m "✨ Implementar sistema FTP de Idealista con filtros actualizados"
git push origin main
```

---

## 3️⃣ Ejecutar Workflow Manualmente (Primera vez)

1. Ve a: `https://github.com/adrian-lafuerza/erika/actions`
2. Selecciona el workflow: **"Update Idealista Feed"**
3. Click en **"Run workflow"** > **"Run workflow"**
4. Espera 1-2 minutos a que termine

Esto descargará el XML del FTP, generará el JSON y hará un commit automático.

---

## 4️⃣ Vercel se Redeploya Automáticamente

Una vez que GitHub Actions hace el commit con el JSON actualizado:
- Vercel detecta el push automáticamente
- Redeploya la aplicación con las 80 propiedades actualizadas
- ✅ Tu sitio estará actualizado en 1-2 minutos

**Nota**: No se requiere configuración adicional en Vercel ni plan Pro.
El sistema funciona completamente con GitHub Actions + Vercel Free.

---

## ⏰ Actualizaciones Automáticas

El sistema se ejecutará automáticamente cada 8 horas:
- **00:30 UTC** (01:30 AM España)
- **08:30 UTC** (09:30 AM España)
- **16:30 UTC** (17:30 PM España)

Cada vez que Idealista actualice el FTP, GitHub Actions:
1. Descarga el nuevo XML
2. Genera el JSON actualizado
3. Hace commit
4. Vercel redeploya automáticamente

---

## �� Probar en Local

```bash
# Descargar y actualizar propiedades manualmente
npm run update:idealista

# Verificar el JSON generado
npm run parse:idealista
```

---

## ��� Verificar Estado

### Ver propiedades actuales:
```bash
node -e "const j=require('./public/idealista-properties.json');console.log('Total:',j.data.properties.length,'propiedades')"
```

### Ver último workflow ejecutado:
`https://github.com/adrian-lafuerza/erika/actions`

---

## ��� Troubleshooting

### Si el workflow falla:

1. **Verifica los secrets** estén configurados correctamente
2. **Revisa los logs** en GitHub Actions
3. **Ejecuta localmente** para debugging:
   ```bash
   npm run download:idealista
   npm run parse:idealista
   ```

### Si Vercel no se redeploya:

1. Ve a Vercel Dashboard
2. Verifica que esté conectado al repositorio correcto
3. Revisa la configuración de Git Integration

---

## ✅ Checklist Final

- [ ] Secrets configurados en GitHub
- [ ] Commit y push realizado
- [ ] Workflow ejecutado manualmente (primera vez)
- [ ] JSON actualizado con 80 propiedades
- [ ] Vercel redeployado correctamente
- [ ] Filtros funcionando en producción
- [ ] Actualizaciones automáticas programadas

---

## �� Resultado Final

✨ **Sistema completamente automatizado**:
- ❌ Sin rate limits de API
- ✅ Actualizaciones cada 8 horas
- ✅ Deploy automático en Vercel
- ✅ 80 propiedades sincronizadas con Idealista
- ✅ Filtros funcionando correctamente

