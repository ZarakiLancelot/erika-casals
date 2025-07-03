# 🏗️ Tests Building01-Property19 - Idealista API

## 📊 Resumen
- **Fecha:** 2/7/2025
- **Tests:** Building01 a Property19 (Building, Room y operaciones CRUD)
- **Total:** 14
- **Exitosos:** 7 ✅
- **Fallidos:** 7 ❌
- **Tasa éxito:** 50.00%

## 📋 Resultados

| Test ID | Descripción | Esperado | Actual | Estado |
|---------|-------------|----------|---------|---------|
| Building01 | Crear nueva propiedad tipo building | 201 | 400 | ❌ FAIL |
| Building02 | Error validación - building sin classification | 400 | 400 | ✅ PASS |
| Room01 | Crear nueva propiedad tipo room para rent | 201 | 400 | ❌ FAIL |
| Room02 | Error validación - room solo puede ser rent | 400 | 400 | ✅ PASS |
| Property10 | Buscar propiedad existente | 200 | 404 | ❌ FAIL |
| Property11 | Buscar propiedad inexistente | 404 | 404 | ✅ PASS |
| Property12 | Buscar todas las propiedades | 200 | 200 | ✅ PASS |
| Property13 | Actualizar propiedad existente | 200 | 404 | ❌ FAIL |
| Property14 | Error negocio - no se puede cambiar tipo | 400 | 400 | ✅ PASS |
| Property15 | Actualizar propiedad inexistente | 404 | 404 | ✅ PASS |
| Property16 | Desactivar propiedad existente | 200 | 404 | ❌ FAIL |
| Property17 | Desactivar propiedad inexistente | 404 | 404 | ✅ PASS |
| Property18 | Reactivar propiedad existente | 200 | 500 | ❌ FAIL |
| Property19 | Reactivar propiedad inexistente | 404 | 500 | ❌ FAIL |

## ❌ Tests Fallidos

### Building01 - Crear nueva propiedad tipo building
- **Esperado:** 201
- **Obtenido:** 400

### Room01 - Crear nueva propiedad tipo room para rent
- **Esperado:** 201
- **Obtenido:** 400

### Property10 - Buscar propiedad existente
- **Esperado:** 200
- **Obtenido:** 404

### Property13 - Actualizar propiedad existente
- **Esperado:** 200
- **Obtenido:** 404

### Property16 - Desactivar propiedad existente
- **Esperado:** 200
- **Obtenido:** 404

### Property18 - Reactivar propiedad existente
- **Esperado:** 200
- **Obtenido:** 500

### Property19 - Reactivar propiedad inexistente
- **Esperado:** 404
- **Obtenido:** 500


---
*Reporte generado automáticamente - 2025-07-02T11:23:08.948Z*