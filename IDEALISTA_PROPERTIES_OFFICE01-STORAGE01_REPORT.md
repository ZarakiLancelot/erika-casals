# 🏢 Tests Office01-StorageRoom01 - Idealista API

## 📊 Resumen
- **Fecha:** 7/7/2025
- **Tests:** Office01 a StorageRoom01 (Tipos comerciales y terrenos)
- **Total:** 10
- **Exitosos:** 10 ✅
- **Fallidos:** 0 ❌
- **Tasa éxito:** 100.00%

## 📋 Resultados

| Test ID | Descripción | Esperado | Actual | Estado |
|---------|-------------|----------|---------|---------|
| Office01 | Crear nueva propiedad tipo office | 201 | 201 | ✅ PASS |
| Commercial01 | Crear nueva propiedad tipo commercial | 201 | 201 | ✅ PASS |
| Commercial02 | Crear propiedad commercial con transferencia válida | 201 | 201 | ✅ PASS |
| Commercial03 | Error negocio - transfer sin commercialMainActivity | 400 | 400 | ✅ PASS |
| Land01 | ERROR API - land urban requiere classification no implementada | 400 | 400 | ✅ PASS |
| Land02 | ERROR API - land countrybuildable requiere classification no implementada | 400 | 400 | ✅ PASS |
| Land03 | Crear nueva propiedad tipo land countrynonbuildable | 201 | 201 | ✅ PASS |
| Land04 | Error negocio - electricidad no compatible con countrynonbuildable | 400 | 400 | ✅ PASS |
| Land05 | Error negocio - accessType solo permitido con roadAccess true | 400 | 400 | ✅ PASS |
| StorageRoom01 | Crear nueva propiedad tipo storage | 201 | 201 | ✅ PASS |

---
*Reporte generado automáticamente - 2025-07-07T11:57:46.341Z*