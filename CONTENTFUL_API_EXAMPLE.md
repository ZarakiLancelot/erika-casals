# Ejemplo de Respuesta de Contentful API

## Estructura del Content Type en Contentful

```json
{
  {
    "sys": {
      "space": {
        "sys": {
    "type": "Link",
    "linkType": "Space",
    "id": "your-space-id"
    }
  },
  "id": "instagramPost",
  "type": "ContentType"
  },
  "displayField": "title",
  "name": "Instagram Post",
  "description": "Posts de Instagram para mostrar en el feed",
  "fields": [
  {
    "id": "title",
    "name": "Title",
    "type": "Symbol",
    "localized": false,
    "required": true
  },
  {
    "id": "instagramUrl",
    "name": "Instagram URL",
    "type": "Symbol",
    "localized": false,
    "required": true
  },
  {
    "id": "description",
    "name": "Description",
    "type": "Text",
    "localized": false,
    "required": false
  },
  {
    "id": "isActive",
    "name": "Is Active",
    "type": "Boolean",
    "localized": false,
    "required": false,
    "defaultValue": {
    "en-US": true
    }
  },
  {
    "id": "order",
    "name": "Order",
    "type": "Integer",
    "localized": false,
    "required": false,
    "defaultValue": {
    "en-US": 0
    }
  }
  ]
}
  "sys": {
    "space": {
      "sys": {
        "type": "Link",
        "linkType": "Space",
        "id": "your-space-id"
      }
    },
    "id": "instagramPost",
    "type": "ContentType"
  },
  "displayField": "title",
  "name": "Instagram Post",
  "description": "Posts de Instagram para mostrar en el feed",
  "fields": [
    {
      "id": "title",
      "name": "Title",
      "type": "Symbol",
      "localized": false,
      "required": true
    },
    {
      "id": "instagramUrl",
      "name": "Instagram URL",
      "type": "Symbol",
      "localized": false,
      "required": true
    },
    {
      "id": "description",
      "name": "Description",
      "type": "Text",
      "localized": false,
      "required": false
    },
    {
      "id": "isActive",
      "name": "Is Active",
      "type": "Boolean",
      "localized": false,
      "required": false,
      "defaultValue": {
        "en-US": true
      }
    },
    {
      "id": "order",
      "name": "Order",
      "type": "Integer",
      "localized": false,
      "required": false,
      "defaultValue": {
        "en-US": 0
      }
    }
  ]
}
```

## Ejemplo de Respuesta de la API

```json
{
  "sys": {
    "type": "Array"
  },
  "total": 3,
  "skip": 0,
  "limit": 100,
  "items": [
    {
      "sys": {
        "space": {
          "sys": {
            "type": "Link",
            "linkType": "Space",
            "id": "your-space-id"
          }
        },
        "id": "1nUvjzJmQwumiAKqQk2ACg",
        "type": "Entry",
        "createdAt": "2025-01-01T10:00:00.000Z",
        "updatedAt": "2025-01-01T10:30:00.000Z",
        "contentType": {
          "sys": {
            "type": "Link",
            "linkType": "ContentType",
            "id": "instagramPost"
          }
        }
      },
      "fields": {
        "title": "Mi último proyecto inmobiliario",
        "instagramUrl": "https://www.instagram.com/reel/DIG2gOWt2lt/",
        "description": "Descubre mi último proyecto inmobiliario en Miami",
        "isActive": true,
        "order": 1
      }
    },
    {
      "sys": {
        "space": {
          "sys": {
            "type": "Link",
            "linkType": "Space",
            "id": "your-space-id"
          }
        },
        "id": "2xVwkAJnRxvnbBLrRl3BDh",
        "type": "Entry",
        "createdAt": "2025-01-01T11:00:00.000Z",
        "updatedAt": "2025-01-01T11:15:00.000Z",
        "contentType": {
          "sys": {
            "type": "Link",
            "linkType": "ContentType",
            "id": "instagramPost"
          }
        }
      },
      "fields": {
        "title": "Consejos inmobiliarios",
        "instagramUrl": "https://www.instagram.com/reel/DKXUPyLodQP/",
        "description": "Tips importantes para compradores de primera vez",
        "isActive": true,
        "order": 2
      }
    },
    {
      "sys": {
        "space": {
          "sys": {
            "type": "Link",
            "linkType": "Space",
            "id": "your-space-id"
          }
        },
        "id": "3yWxlBKoSywocCMsSm4CEi",
        "type": "Entry",
        "createdAt": "2025-01-01T12:00:00.000Z",
        "updatedAt": "2025-01-01T12:20:00.000Z",
        "contentType": {
          "sys": {
            "type": "Link",
            "linkType": "ContentType",
            "id": "instagramPost"
          }
        }
      },
      "fields": {
        "title": "Experiencia profesional",
        "instagramUrl": "https://www.instagram.com/reel/DKhhoIkto9G/",
        "description": "Compartiendo mi experiencia en el sector inmobiliario",
        "isActive": true,
        "order": 3
      }
    }
  ]
}
```

## Datos Transformados por el Hook

El hook `useInstagramFeed` transforma automáticamente los datos de Contentful en este formato:

```json
[
  {
    "id": "1nUvjzJmQwumiAKqQk2ACg",
    "title": "Mi último proyecto inmobiliario",
    "instagramUrl": "https://www.instagram.com/reel/DIG2gOWt2lt/",
    "embedUrl": "https://www.instagram.com/reel/DIG2gOWt2lt/embed",
    "description": "Descubre mi último proyecto inmobiliario en Miami",
    "isActive": true,
    "order": 1,
    "createdAt": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": "2xVwkAJnRxvnbBLrRl3BDh",
    "title": "Consejos inmobiliarios",
    "instagramUrl": "https://www.instagram.com/reel/DKXUPyLodQP/",
    "embedUrl": "https://www.instagram.com/reel/DKXUPyLodQP/embed",
    "description": "Tips importantes para compradores de primera vez",
    "isActive": true,
    "order": 2,
    "createdAt": "2025-01-01T11:00:00.000Z"
  },
  {
    "id": "3yWxlBKoSywocCMsSm4CEi",
    "title": "Experiencia profesional",
    "instagramUrl": "https://www.instagram.com/reel/DKhhoIkto9G/",
    "embedUrl": "https://www.instagram.com/reel/DKhhoIkto9G/embed",
    "description": "Compartiendo mi experiencia en el sector inmobiliario",
    "isActive": true,
    "order": 3,
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
]
```

## Pasos para Implementar en Contentful

1. **Crear Content Type**: Usa la estructura JSON de arriba para crear el content type
2. **Añadir Entradas**: Crea posts usando los campos definidos
3. **Configurar Variables**: Asegúrate de tener las variables de entorno configuradas
4. **Probar**: El componente cargará automáticamente los posts desde Contentful
5. **Fallback**: Si hay problemas, se mostrarán los posts por defecto

## URLs de Ejemplo para Probar

- `https://www.instagram.com/reel/DIG2gOWt2lt/`
- `https://www.instagram.com/p/ABC123DEF/`
- `https://instagram.com/reel/XYZ789GHI/`

Todos estos formatos son soportados y se convertirán automáticamente al formato embed correcto.
