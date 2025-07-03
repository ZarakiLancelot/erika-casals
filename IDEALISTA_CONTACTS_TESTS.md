# TESTS API CONTACTOS - IDEALISTA

Este documento contiene todos los tests solicitados por Idealista para validar la API de contactos.

## Endpoints implementados:

- `GET /api/contacts` - Obtener todos los contactos (paginado)
- `POST /api/contacts` - Crear nuevo contacto
- `GET /api/contacts/{id}` - Obtener contacto específico por ID
- `PUT /api/contacts/{id}` - Actualizar contacto específico

## Tests a ejecutar:

### Contact01 - Crear contacto válido
**Método:** POST  
**URL:** `/api/contacts`  
**Body:**
```json
{
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "primaryPhonePrefix": "34",
  "primaryPhoneNumber": "123456789"
}
```
**Resultado esperado:** Status 201, contacto creado correctamente

### Contact02 - Crear contacto sin email (Error)
**Método:** POST  
**URL:** `/api/contacts`  
**Body:**
```json
{
  "name": "María",
  "lastName": "García",
  "primaryPhonePrefix": "34",
  "primaryPhoneNumber": "987654321"
}
```
**Resultado esperado:** Status 400, error "Email is required"

### Contact03 - Crear contacto con email inválido (Error)
**Método:** POST  
**URL:** `/api/contacts`  
**Body:**
```json
{
  "name": "Pedro",
  "lastName": "López",
  "email": "email-invalido",
  "primaryPhonePrefix": "34",
  "primaryPhoneNumber": "111222333"
}
```
**Resultado esperado:** Status 400, error "Invalid email format"

### Contact04 - Obtener contacto por ID
**Método:** GET  
**URL:** `/api/contacts/{id}` (usar ID del Contact01)  
**Resultado esperado:** Status 200, datos del contacto

### Contact05 - Actualizar contacto existente
**Método:** PUT  
**URL:** `/api/contacts/{id}` (usar ID del Contact01)  
**Body:**
```json
{
  "name": "Juan Actualizado",
  "lastName": "Pérez Actualizado",
  "email": "juan.perez.updated@example.com",
  "primaryPhonePrefix": "34",
  "primaryPhoneNumber": "123456789"
}
```
**Resultado esperado:** Status 200, contacto actualizado

### Contact06 - Obtener todos los contactos
**Método:** GET  
**URL:** `/api/contacts?page=1&size=10`  
**Resultado esperado:** Status 200, lista paginada de contactos

## Instrucciones para ejecutar los tests:

1. Asegurar que el entorno local esté funcionando:
   ```bash
   vercel dev --port 3001
   ```

2. Usar un cliente HTTP (Postman, Insomnia, curl) para ejecutar cada test en orden.

3. Documentar el request y response de cada test para enviar a Idealista.

## Ejemplo de uso con curl:

```bash
# Contact01 - Crear contacto
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phone": "+34123456789",
    "message": "Interesado en propiedades en Madrid"
  }'

# Contact06 - Obtener contactos
curl -X GET http://localhost:3001/api/contacts?page=1&size=10

# Contact04 - Obtener contacto por ID (reemplazar {id})
curl -X GET http://localhost:3001/api/contacts/{id}

# Contact05 - Actualizar contacto (reemplazar {id})
curl -X PUT http://localhost:3001/api/contacts/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez Actualizado",
    "email": "juan.perez.updated@example.com"
  }'
```

## Notas importantes:

- Los endpoints están preparados para manejar los errores de validación según los requisitos.
- Se incluye validación de formato de email.
- Los métodos CORS están configurados correctamente.
- Todos los responses incluyen el formato estándar con `success`, `data`, `error`, etc.
