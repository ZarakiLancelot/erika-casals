# 🏠 Tests Property01-09 - Idealista API

## 📊 Resumen
- **Fecha:** 1/7/2025
- **Tests:** Property01 a Property09
- **Total:** 9
- **Exitosos:** 8 ✅
- **Fallidos:** 1 ❌
- **Tasa éxito:** 88.89%

## 📋 Resultados

| Test ID | Descripción | Esperado | Actual | Estado |
|---------|-------------|----------|---------|---------|
| Property01 | Crear propiedad básica válida | 201 | 201 | ✅ PASS |
| Property02 | Error token inválido | 401 | 201 | ❌ FAIL |
| Property03 | Propiedad para venta | 201 | 201 | ✅ PASS |
| Property04 | Propiedad para alquiler | 201 | 201 | ✅ PASS |
| Property05 | Scope idealista | 201 | 201 | ✅ PASS |
| Property06 | Scope microsite | 201 | 201 | ✅ PASS |
| Property07 | Dirección completa visible | 201 | 201 | ✅ PASS |
| Property08 | Solo calle visible | 201 | 201 | ✅ PASS |
| Property09 | Dirección oculta | 201 | 201 | ✅ PASS |

## ❌ Tests Fallidos

### Property02 - Error token inválido
- **Esperado:** 401
- **Obtenido:** 201
- **Notas:** En sandbox local podría devolver 201 en lugar de 401


---
*Reporte generado automáticamente - 2025-07-01T18:24:56.069Z*