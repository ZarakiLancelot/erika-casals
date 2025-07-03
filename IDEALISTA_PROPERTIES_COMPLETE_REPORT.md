# 🏠 Reporte Completo - Tests Propiedades Idealista

## 📊 Resumen
- **Fecha:** 1/7/2025
- **Total tests:** 36
- **Exitosos:** 12 ✅
- **Fallidos:** 24 ❌
- **Tasa éxito:** 33.33%

## 📋 Resultados Detallados

| Test ID | Nombre | Esperado | Actual | Estado | Notas |
|---------|--------|----------|---------|---------|-------|
| Property01 | Crear propiedad válida | 201 | 400 | ❌ FAIL |  |
| Property03 | Propiedad para venta | 201 | 400 | ❌ FAIL |  |
| Property04 | Propiedad para alquiler | 201 | 400 | ❌ FAIL |  |
| Property05 | Scope idealista | 201 | 400 | ❌ FAIL |  |
| Property06 | Scope microsite | 201 | 400 | ❌ FAIL |  |
| Property07 | Dirección completa | 201 | 400 | ❌ FAIL |  |
| Property08 | Dirección calle | 201 | 400 | ❌ FAIL |  |
| Property09 | Dirección oculta | 201 | 400 | ❌ FAIL |  |
| Flat01 | Piso válido completo | 201 | 400 | ❌ FAIL |  |
| Flat02 | Error área < 10m² | 400 | 400 | ✅ PASS | Debería fallar por área muy pequeña |
| Flat03 | Error área vs habitaciones | 400 | 400 | ✅ PASS | Área muy pequeña para 5 habitaciones |
| Flat04 | Error conservación/baños | 400 | 400 | ✅ PASS | Conservación good no compatible con 0 baños |
| Flat05 | Error parking sin precio | 400 | 400 | ✅ PASS | Parking included pero parking=false |
| House01 | Casa válida | 201 | 400 | ❌ FAIL |  |
| CountryHouse01 | Casa de campo | 201 | 400 | ❌ FAIL |  |
| Garage01 | Garaje válido | 201 | 400 | ❌ FAIL |  |
| Office01 | Oficina válida | 201 | 400 | ❌ FAIL |  |
| Commercial01 | Local comercial | 201 | 400 | ❌ FAIL |  |
| Commercial02 | Local transferencia válida | 201 | 400 | ❌ FAIL |  |
| Commercial03 | Error transferencia sin actividad | 400 | 400 | ✅ PASS | Transferencia requiere actividad comercial |
| Land01 | Terreno urbano | 201 | 400 | ❌ FAIL |  |
| Land02 | Terreno edificable | 201 | 400 | ❌ FAIL |  |
| Land03 | Terreno no edificable | 201 | 400 | ❌ FAIL |  |
| Land04 | Error tipo incompatible | 400 | 400 | ✅ PASS | Terreno no edificable no puede tener electricidad |
| Land05 | Error acceso sin permisos | 400 | 400 | ✅ PASS | accessType solo permitido con roadAccess=true |
| StorageRoom01 | Trastero válido | 201 | 400 | ❌ FAIL |  |
| Building01 | Edificio válido | 201 | 400 | ❌ FAIL |  |
| Building02 | Error edificio sin clasificación | 400 | 400 | ✅ PASS | Edificio requiere al menos una clasificación |
| Room01 | Habitación alquiler | 201 | 400 | ❌ FAIL |  |
| Room02 | Error habitación venta | 400 | 400 | ✅ PASS | Habitaciones solo pueden ser para alquiler |
| Property10 | Búsqueda con paginación | 200 | 200 | ✅ PASS |  |
| Property11 | Propiedad inexistente | 404 | 404 | ✅ PASS |  |
| Property12 | Búsqueda completa | 200 | 200 | ✅ PASS |  |
| Property15 | Actualizar inexistente | 404 | 400 | ❌ FAIL |  |
| Property17 | Desactivar inexistente | 404 | 500 | ❌ FAIL |  |
| Property19 | Reactivar inexistente | 404 | 500 | ❌ FAIL |  |

## ❌ Tests Fallidos

### Property01 - Crear propiedad válida
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Property03 - Propiedad para venta
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Property04 - Propiedad para alquiler
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Property05 - Scope idealista
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Property06 - Scope microsite
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Property07 - Dirección completa
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Property08 - Dirección calle
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Property09 - Dirección oculta
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Flat01 - Piso válido completo
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### House01 - Casa válida
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### CountryHouse01 - Casa de campo
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Garage01 - Garaje válido
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Office01 - Oficina válida
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Commercial01 - Local comercial
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Commercial02 - Local transferencia válida
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Land01 - Terreno urbano
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Land02 - Terreno edificable
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Land03 - Terreno no edificable
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### StorageRoom01 - Trastero válido
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Building01 - Edificio válido
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Room01 - Habitación alquiler
- **Esperado:** 201
- **Obtenido:** 400
- **Notas:** 

### Property15 - Actualizar inexistente
- **Esperado:** 404
- **Obtenido:** 400
- **Notas:** 

### Property17 - Desactivar inexistente
- **Esperado:** 404
- **Obtenido:** 500
- **Notas:** 

### Property19 - Reactivar inexistente
- **Esperado:** 404
- **Obtenido:** 500
- **Notas:** 


---
*Reporte generado automáticamente - 2025-07-01T18:05:33.669Z*