# 🏞️ Tests Land01-Land03 - Idealista API

## 📊 Resumen
- **Fecha:** 2/7/2025
- **Tests:** Land01 a Land03 (Tipos de terreno)
- **Total:** 3
- **Exitosos:** 3 ✅
- **Fallidos:** 0 ❌
- **Tasa éxito:** 100.00%

## 📋 Resultados

| Test ID | Descripción | Esperado | Actual | Estado |
|---------|-------------|----------|---------|---------|
| Land01 | Crear nueva propiedad tipo land urban con clasificación | 201 | 201 | ✅ PASS |
| Land02 | Crear nueva propiedad tipo land countrybuildable con clasificación | 201 | 201 | ✅ PASS |
| Land03 | Crear nueva propiedad tipo land countrynonbuildable | 201 | 201 | ✅ PASS |

## 📋 Payloads y Responses

### Land01 - Urban
**Payload enviado:**
```json
"No disponible"
```

**Response recibido:**
```json
{
  "success": true,
  "data": {
    "message": "Successful operation",
    "success": true,
    "propertyId": 108635814,
    "state": "pending",
    "scope": "microsite",
    "publishInfo": {
      "publishedAds": 15,
      "maxPublishedAds": 15
    }
  },
  "timestamp": "2025-07-02T12:14:07.339Z"
}
```

### Land02 - Countrybuildable
**Payload enviado:**
```json
"No disponible"
```

**Response recibido:**
```json
{
  "success": true,
  "data": {
    "message": "Successful operation",
    "success": true,
    "propertyId": 108635816,
    "state": "pending",
    "scope": "microsite",
    "publishInfo": {
      "publishedAds": 15,
      "maxPublishedAds": 15
    }
  },
  "timestamp": "2025-07-02T12:14:12.840Z"
}
```

### Land03 - Countrynonbuildable
**Payload enviado:**
```json
"No disponible"
```

**Response recibido:**
```json
{
  "success": true,
  "data": {
    "message": "Successful operation",
    "success": true,
    "propertyId": 108635818,
    "state": "pending",
    "scope": "microsite",
    "publishInfo": {
      "publishedAds": 15,
      "maxPublishedAds": 15
    }
  },
  "timestamp": "2025-07-02T12:14:18.064Z"
}
```

---
*Reporte generado automáticamente - 2025-07-02T12:14:18.096Z*