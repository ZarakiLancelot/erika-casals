# Componente PropertyList para Idealista

Este componente permite mostrar un listado de propiedades obtenidas desde la API de Idealista, filtradas por un contacto específico (Erika Casals).

## 🚀 Características

- **Listado de propiedades**: Muestra propiedades en venta y alquiler
- **Carrusel de imágenes**: Navegación entre múltiples fotos de cada propiedad
- **Información completa**: Título, descripción, precio, características, equipamiento
- **Filtros**: Por tipo de operación (venta/alquiler)
- **Responsive**: Adaptado para móviles y escritorio
- **Información de contacto**: Datos de Erika Casals integrados

## 📁 Estructura de archivos

```
src/components/
├── classes/
│   └── ClientPropertyFeed.jsx      # Clase para conectar con API de Idealista
├── hooks/
│   └── useIdealista.jsx           # Hook personalizado para gestionar datos
├── propertylist/
│   ├── PropertyList.jsx           # Componente principal
│   └── styles.js                  # Estilos del componente
└── examples/
    ├── PropertyListExample.jsx    # Ejemplo de uso
    └── styles.js                  # Estilos del ejemplo
```

## ⚙️ Configuración

### 1. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las credenciales de Idealista:

```env
REACT_APP_IDEALISTA_API_KEY=tu_api_key_aqui
REACT_APP_IDEALISTA_SECRET=tu_secret_aqui
```

### 2. Obtener credenciales de Idealista

1. Regístrate en [Idealista Developers](https://developers.idealista.com/)
2. Crea una nueva aplicación
3. Obtén tu API Key y Secret
4. Configúralos en el archivo `.env`

## 🎯 Uso básico

### Componente simple

```jsx
import PropertyList from './components/propertylist/PropertyList';

function App() {
	return (
		<div>
			<h1>Propiedades de Erika</h1>
			<PropertyList operation='all' />
		</div>
	);
}
```

### Con filtros

```jsx
import PropertyList from './components/propertylist/PropertyList';
import { useState } from 'react';

function App() {
	const [filter, setFilter] = useState('all');

	return (
		<div>
			<div>
				<button onClick={() => setFilter('all')}>Todas</button>
				<button onClick={() => setFilter('sale')}>En Venta</button>
				<button onClick={() => setFilter('rent')}>En Alquiler</button>
			</div>
			<PropertyList operation={filter} />
		</div>
	);
}
```

### Usando el hook directamente

```jsx
import { useIdealista } from './components/hooks/useIdealista';

function CustomPropertyComponent() {
	const { properties, loading, error, refreshProperties } =
		useIdealista('sale');

	if (loading) return <div>Cargando...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			{properties.map(property => (
				<div key={property.propertyCode}>
					<h3>{property.title}</h3>
					<p>{property.price}€</p>
				</div>
			))}
		</div>
	);
}
```

## 🎨 Props del componente PropertyList

| Prop        | Tipo     | Default | Descripción                                    |
| ----------- | -------- | ------- | ---------------------------------------------- |
| `operation` | `string` | `'all'` | Tipo de operación: `'all'`, `'sale'`, `'rent'` |

## 📊 Datos de las propiedades

Cada propiedad incluye:

- **Información básica**: título, descripción, precio, ubicación
- **Características**: m², habitaciones, baños, planta
- **Multimedia**: imágenes, carrusel
- **Equipamiento**: características y extras
- **Contacto**: información de Erika Casals
- **Enlaces**: link directo a Idealista

## 🔧 Personalización

### Modificar la configuración de búsqueda

Edita `ClientPropertyFeed.jsx`:

```javascript
this.clientConfig = {
	agencyName: 'tu_agencia',
	phone: '+34xxx xxx xxx',
	email: 'tu@email.com',
	operationAreas: [{ center: 'lat,lng', distance: 2000 }]
};
```

### Personalizar estilos

Los estilos están en `src/components/propertylist/styles.js` usando styled-components. Puedes modificar:

- Colores y tipografía
- Layout de las tarjetas
- Animaciones y transiciones
- Responsive breakpoints

## 🚨 Consideraciones importantes

### Límites de la API

- Idealista tiene límites de requests por minuto/día
- El componente incluye manejo de errores para estos casos

### Filtrado por contacto

- La búsqueda se hace por número de teléfono de contacto
- También busca por nombre de agencia en la descripción
- Ajusta los parámetros según tus necesidades

### Performance

- Las imágenes se cargan con lazy loading
- Se incluye imagen por defecto si falla la carga
- El hook gestiona cache básico del token

## 🐛 Solución de problemas

### Error de autenticación

- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo después de cambiar `.env`

### No se encuentran propiedades

- Verifica que el teléfono en `clientConfig` coincida exactamente
- Ajusta las coordenadas y distancias de búsqueda
- Comprueba que haya propiedades publicadas en Idealista

### Problemas de CORS

- La API de Idealista puede requerir configuración de CORS
- En producción, considera usar un proxy/backend

## 📝 Ejemplo completo

Mira `src/components/examples/PropertyListExample.jsx` para ver un ejemplo completo con filtros y estilos.
