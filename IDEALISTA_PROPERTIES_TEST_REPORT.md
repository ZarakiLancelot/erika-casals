# 🏠 Reporte de Tests - API de Propiedades Idealista

## 📊 Resumen Ejecutivo

- **Fecha de ejecución:** 1/7/2025
- **Total de tests:** 28
- **Tests exitosos:** 0 ✅
- **Tests fallidos:** 28 ❌
- **Tasa de éxito:** 0.00%
- **Propiedades creadas:** 0

## 🎯 Propiedades Creadas Durante los Tests

```json
{}
```

## 📋 Detalle de Tests Ejecutados

| Test ID | Nombre | Esperado | Actual | Estado | Notas |
|---------|--------|----------|---------|---------|-------|
| Property02 | 401 | 400 | [object Object] | ❌ FAIL |  |
| Property01 | 201 | 400 | [object Object] | ❌ FAIL |  |
| Property03 | 201 | 400 | [object Object] | ❌ FAIL |  |
| Property04 | 201 | 400 | [object Object] | ❌ FAIL |  |
| Flat01 | 201 | 400 | [object Object] | ❌ FAIL |  |
| Flat02 | 400 | 400 | [object Object] | ❌ FAIL |  |
| Flat03 | 400 | 400 | [object Object] | ❌ FAIL |  |
| Flat04 | 400 | 400 | [object Object] | ❌ FAIL |  |
| House01 | 201 | 400 | [object Object] | ❌ FAIL |  |
| Premises01 | 201 | 400 | [object Object] | ❌ FAIL |  |
| Office01 | 201 | 400 | [object Object] | ❌ FAIL |  |
| Garage01 | 201 | 400 | [object Object] | ❌ FAIL |  |
| Location01 | 400 | 400 | [object Object] | ❌ FAIL |  |
| Location02 | 400 | 400 | [object Object] | ❌ FAIL |  |
| Price01 | 400 | 400 | [object Object] | ❌ FAIL |  |
| Price02 | 400 | 400 | [object Object] | ❌ FAIL |  |
| Price03 | 201 | 400 | [object Object] | ❌ FAIL |  |
| Required01 | 400 | 400 | [object Object] | ❌ FAIL |  |
| Required02 | 400 | 400 | [object Object] | ❌ FAIL |  |
| Required03 | 400 | 400 | [object Object] | ❌ FAIL |  |
| Property10 | 200 | 200 | [object Object] | ❌ FAIL |  |
| Property11 | 404 | 404 | [object Object] | ❌ FAIL |  |
| Property12 | 200 | 200 | [object Object] | ❌ FAIL |  |
| Search01 | 200 | 200 | [object Object] | ❌ FAIL |  |
| Search02 | 200 | 200 | [object Object] | ❌ FAIL |  |
| Search03 | 200 | 200 | [object Object] | ❌ FAIL |  |
| State01 | 404 | 500 | [object Object] | ❌ FAIL |  |
| State02 | 404 | 500 | [object Object] | ❌ FAIL |  |

## 🔍 Tests Fallidos

### Property02 - 401

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Test token inválido - esperamos 401 pero API local puede devolver 201"
```

### Property01 - 201

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Crear propiedad válida básica"
```

### Property03 - 201

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Propiedad para venta"
```

### Property04 - 201

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Propiedad para alquiler"
```

### Flat01 - 201

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Piso válido con características completas"
```

### Flat02 - 400

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Error área muy pequeña (< 10m²)"
```

### Flat03 - 400

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Error número de habitaciones inválido"
```

### Flat04 - 400

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Error número de baños inválido"
```

### House01 - 201

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Casa válida con jardín y garaje"
```

### Premises01 - 201

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Local comercial válido"
```

### Office01 - 201

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Oficina válida"
```

### Garage01 - 201

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Garaje válido"
```

### Location01 - 400

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Error código postal inválido"
```

### Location02 - 400

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Error coordenadas geográficas inválidas"
```

### Price01 - 400

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Error precio negativo"
```

### Price02 - 400

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Error precio cero"
```

### Price03 - 201

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Precio muy alto dentro del límite"
```

### Required01 - 400

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Error falta título"
```

### Required02 - 400

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Error falta descripción"
```

### Required03 - 400

- **Esperado:** 400
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Error falta contactId"
```

### Property10 - 200

- **Esperado:** 200
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Búsqueda con paginación"
```

### Property11 - 404

- **Esperado:** 404
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Propiedad inexistente"
```

### Property12 - 200

- **Esperado:** 200
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Búsqueda completa"
```

### Search01 - 200

- **Esperado:** 200
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Búsqueda por tipo (flat)"
```

### Search02 - 200

- **Esperado:** 200
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Búsqueda por operación (sale)"
```

### Search03 - 200

- **Esperado:** 200
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Búsqueda por rango de precio"
```

### State01 - 404

- **Esperado:** 500
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Error desactivar propiedad inexistente"
```

### State02 - 404

- **Esperado:** 500
- **Actual:** [object Object]
- **Notas:** 
- **Respuesta:**
```json
"Error reactivar propiedad inexistente"
```

## 🛠️ Recomendaciones

1. **Para tests fallidos:** Revisar la implementación de los endpoints correspondientes
2. **Para validaciones:** Asegurar que la validación de esquemas coincida con los requerimientos de Idealista
3. **Para errores de autenticación:** Verificar la configuración de tokens y credenciales
4. **Para errores de negocio:** Validar que las reglas de negocio estén correctamente implementadas

## 📧 Próximos Pasos

1. Corregir cualquier test fallido
2. Re-ejecutar los tests hasta obtener 100% de éxito
3. Enviar este reporte junto con los logs a Idealista para validación
4. Programar tests de regresión automáticos

---

*Reporte generado automáticamente por el script de validación de Idealista API*
*Timestamp: 2025-07-01T17:58:31.516Z*
