# 📸 Tests Image03-Image06 - Idealista API

## 📊 Resumen
- **Fecha:** 2/7/2025
- **Tests:** Image03-Image06 (Gestión avanzada de imágenes)
- **Property ID:** 108635814
- **Total:** 4
- **Exitosos:** 4 ✅
- **Fallidos:** 0 ❌
- **Tasa éxito:** 100.00%

## 📋 Resultados

| Test ID | Descripción | Esperado | Actual | Estado |
|---------|-------------|----------|---------|---------|
| Image03 | Actualizar orden de imágenes (PUT) | 202 | 202 | ✅ PASS |
| Image04 | Actualizar etiquetas de imágenes (PUT) | 202 | 202 | ✅ PASS |
| Image05 | Eliminar imagen específica (PUT) | 202 | 202 | ✅ PASS |
| Image06 | Eliminar todas las imágenes (DELETE) | 200 | 200 | ✅ PASS |

## 📋 Detalles de los Tests

### Image03 - Update order
- **Descripción:** Call the same endpoint of test 'Image01' swapping the order of the images in the body of the request
- **Endpoint:** PUT /api/properties/108635814/images
- **Esperado:** 202 - calling the find all images endpoint will return the images with the new order

### Image04 - Update label
- **Descripción:** Call the same endpoint of test 'Image01' changing the label of the images in the body of the request
- **Endpoint:** PUT /api/properties/108635814/images
- **Esperado:** 202 - calling the find all images endpoint will return the images with the new labels

### Image05 - Delete single image
- **Descripción:** Delete a single image for the property used in the test 'Image01'. To do that, call the same endpoint but stop sending the image you want to be deleted in the body of the request
- **Endpoint:** PUT /api/properties/108635814/images
- **Esperado:** 202 - calling the find all images endpoint will not return the deleted image

### Image06 - Delete all images
- **Descripción:** Delete all the images of a property using the delete all endpoint
- **Endpoint:** DELETE /api/properties/108635814/images
- **Esperado:** 200 - calling the find all images endpoint will return an empty list


---
*Reporte generado automáticamente - 2025-07-02T12:39:46.345Z*