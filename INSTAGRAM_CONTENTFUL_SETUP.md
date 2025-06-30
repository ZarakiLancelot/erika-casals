# Configuración de Instagram Feed en Contentful

## Configuración del Content Type

Para gestionar los posts de Instagram desde Contentful, necesitas crear un nuevo **Content Type** llamado `instagramPost` con los siguientes campos:

### Campos Requeridos:

1. **Title** (Título)

   - Field ID: `title`
   - Type: `Text`
   - Description: Título del post de Instagram

2. **Instagram URL** (URL de Instagram)

   - Field ID: `instagramUrl`
   - Type: `Text`
   - Description: URL completa del post/reel de Instagram
   - Ejemplo: `https://www.instagram.com/reel/DIG2gOWt2lt/`

3. **Description** (Descripción)

   - Field ID: `description`
   - Type: `Text`
   - Description: Descripción opcional del post

4. **Is Active** (Activo)

   - Field ID: `isActive`
   - Type: `Boolean`
   - Description: Determina si el post se muestra en el sitio web
   - Default: `true`

5. **Order** (Orden)
   - Field ID: `order`
   - Type: `Integer`
   - Description: Orden de aparición en el slider (números más bajos aparecen primero)
   - Default: `0`

## Cómo Usar

### 1. Crear un Nuevo Post de Instagram

1. Ve a Contentful → Content → Add Entry → Instagram Post
2. Completa los campos:
   - **Title**: Título descriptivo del post
   - **Instagram URL**: Copia la URL completa del post desde Instagram
   - **Description**: Descripción opcional
   - **Is Active**: Marca como `true` para que aparezca en el sitio
   - **Order**: Número para ordenar los posts (0, 1, 2, etc.)

### 2. Obtener la URL de Instagram

Para obtener la URL correcta:

1. Ve al post/reel en Instagram
2. Haz clic en los tres puntos (`...`)
3. Selecciona "Copiar enlace"
4. Pega la URL en el campo `Instagram URL`

### 3. Formatos de URL Soportados

El sistema acepta varios formatos de URL de Instagram:

- `https://www.instagram.com/reel/ABC123DEF/`
- `https://www.instagram.com/p/ABC123DEF/`
- `https://instagram.com/reel/ABC123DEF/`

### 4. Orden de Aparición

- Los posts se ordenan por el campo `Order` (de menor a mayor)
- Posts con el mismo orden se ordenan por fecha de creación

### 5. Activar/Desactivar Posts

- Para ocultar un post temporalmente: cambia `Is Active` a `false`
- Para mostrar un post: cambia `Is Active` a `true`

## Funcionalidades Técnicas

### Datos de Fallback

Si Contentful no está disponible o no hay posts configurados, el sistema usa datos de fallback predefinidos para mantener la funcionalidad del sitio web.

### Conversión Automática de URLs

El sistema convierte automáticamente las URLs de Instagram al formato embed necesario para mostrar los posts en el sitio web.

### Límites y Consideraciones

- Se recomienda mantener entre 3-6 posts activos para un mejor rendimiento
- Los posts inactivos no se cargan en el frontend
- Las URLs deben ser válidas y accesibles públicamente

## Variables de Entorno Requeridas

Asegúrate de que estas variables estén configuradas en tu archivo `.env`:

```
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token
```

## Ejemplo de Uso Práctico

1. **Post Nuevo**: Crea un post con Order=0 para que aparezca primero
2. **Post Destacado**: Usa Order=1, 2, 3... para posts importantes
3. **Post Temporal**: Usa `Is Active=false` para posts estacionales
4. **Reorganizar**: Cambia los números de Order para reordenar sin eliminar posts

## Solución de Problemas

### Los posts no aparecen:

- Verifica que `Is Active` esté en `true`
- Confirma que la URL de Instagram sea válida
- Revisa que las variables de entorno estén configuradas

### Error de carga:

- El sistema mostrará posts de fallback automáticamente
- Verifica la conexión a internet y la configuración de Contentful

### Posts en orden incorrecto:

- Revisa los valores del campo `Order`
- Números más bajos aparecen primero (0, 1, 2, 3...)
