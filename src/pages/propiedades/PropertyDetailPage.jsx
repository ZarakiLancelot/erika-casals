import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import PropertyDetail from '../../components/properties/PropertyDetail';
import NewDevelopmentDetail from '../../components/properties/NewDevelopmentDetail';

const PropertyDetailPage = () => {
	const { propertyId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [property, setProperty] = useState(location.state?.property || null);
	const [loading, setLoading] = useState(!location.state?.property);
	const [hasSearched, setHasSearched] = useState(!!location.state?.property);
	const [propertyImages, setPropertyImages] = useState([]);

	// Función para cargar una propiedad específica desde el archivo JSON local
	const loadIdealistaProperty = useCallback(async propertyId => {
		try {
			console.log('🔄 loadIdealistaProperty: Loading property', propertyId);

			// Cargar desde el archivo JSON estático local
			const url = '/idealista-properties.json';
			console.log('🔄 loadIdealistaProperty: Fetching from', url);

			const response = await fetch(url);
			console.log(
				'📡 loadIdealistaProperty: Response status',
				response.status,
				response.ok
			);

			if (!response.ok) {
				console.log('❌ loadIdealistaProperty: Response not ok');
				return null;
			}

			const result = await response.json();
			console.log('📦 loadIdealistaProperty: Response data received');

			if (result.success && result.data && result.data.properties) {
				console.log(
					'✅ loadIdealistaProperty: Searching for property in array'
				);
				// Buscar la propiedad por propertyId en el array
				const foundProperty = result.data.properties.find(
					prop =>
						prop.propertyId === propertyId ||
						prop.propertyId === String(propertyId)
				);

				if (foundProperty) {
					console.log(
						'✅ loadIdealistaProperty: Property found',
						foundProperty.propertyId
					);
					return foundProperty;
				} else {
					console.log('❌ loadIdealistaProperty: Property not found in array');
					return null;
				}
			} else {
				console.log('❌ loadIdealistaProperty: Invalid response format');
				return null;
			}
		} catch (err) {
			console.error('❌ loadIdealistaProperty: Error', err);
			return null;
		}
	}, []);

	// Función para cargar una propiedad específica desde Contentful
	const loadContentfulProperty = useCallback(async propertyId => {
		try {
			console.log('🔄 loadContentfulProperty: Loading property', propertyId);

			// Importar dinámicamente el servicio de Contentful
			const { getProperty } = await import('../../services/contentful');
			const contentfulProperty = await getProperty(propertyId);

			if (contentfulProperty) {
				console.log('✅ loadContentfulProperty: Property loaded successfully');
				return contentfulProperty;
			} else {
				console.log('❌ loadContentfulProperty: Property not found');
				return null;
			}
		} catch (err) {
			console.error('❌ loadContentfulProperty: Error', err);
			return null;
		}
	}, []);

	// Función para cargar imágenes desde la propiedad (ya vienen en el JSON)
	const loadPropertyImages = useCallback(async property => {
		try {
			console.log('🖼️ loadPropertyImages: Extracting images from property');

			// Las imágenes ya vienen en el objeto property desde el JSON
			if (property && property.images && Array.isArray(property.images)) {
				console.log(
					'✅ loadPropertyImages: Found',
					property.images.length,
					'images'
				);
				setPropertyImages(property.images);
				return property.images;
			} else {
				console.log('❌ loadPropertyImages: No images found in property');
				return [];
			}
		} catch (err) {
			console.error('❌ loadPropertyImages: Error', err);
			return [];
		}
	}, []);

	// Resetear estado cuando cambia el propertyId
	useEffect(() => {
		setProperty(location.state?.property || null);
		setLoading(!location.state?.property);
		setHasSearched(!!location.state?.property);
		setPropertyImages([]);
	}, [propertyId, location.state?.property]);

	// Cargar la propiedad si no la tenemos
	useEffect(() => {
		const findProperty = async () => {
			if (!propertyId || hasSearched || property) return;

			console.log('🔍 PropertyDetailPage: propertyId =', propertyId);
			console.log('🔄 PropertyDetailPage: Fetching property from API');
			setLoading(true);

			// Detectar si es propiedad de Contentful o Idealista
			// Las propiedades de Contentful típicamente tienen IDs alfanuméricos como 'mock-1'
			// Las de Idealista son números puros
			const isContentfulId =
				isNaN(propertyId) ||
				propertyId.includes('-') ||
				propertyId.includes('mock');

			let foundProperty = null;

			if (isContentfulId) {
				// Intentar cargar desde Contentful primero
				foundProperty = await loadContentfulProperty(propertyId);
				console.log(
					'📦 PropertyDetailPage: contentfulProperty =',
					foundProperty
				);

				if (foundProperty) {
					setProperty(foundProperty);
					setHasSearched(true);
					setLoading(false);
					return;
				}
			}

			// Si no se encontró en Contentful o es un ID numérico, intentar Idealista
			const idealistaProperty = await loadIdealistaProperty(propertyId);
			console.log(
				'📦 PropertyDetailPage: idealistaProperty =',
				idealistaProperty
			);

			if (idealistaProperty) {
				console.log('🔧 PropertyDetailPage: Setting property in state');
				setProperty(idealistaProperty);
				console.log('🔧 PropertyDetailPage: Setting hasSearched to true');
				setHasSearched(true);
				console.log('🔧 PropertyDetailPage: Setting loading to false');
				setLoading(false);
				// Cargar imágenes desde la propiedad misma
				loadPropertyImages(idealistaProperty);
				return;
			}

			// Si no se encuentra en ningún lado, intentar Contentful como último recurso (si no se hizo antes)
			if (!isContentfulId) {
				const contentfulProperty = await loadContentfulProperty(propertyId);
				console.log(
					'📦 PropertyDetailPage: contentfulProperty (fallback) =',
					contentfulProperty
				);
				if (contentfulProperty) {
					setProperty(contentfulProperty);
					setHasSearched(true);
					setLoading(false);
					return;
				}
			}

			// Si no se encuentra en ningún lado
			console.log('❌ PropertyDetailPage: Property not found');
			setProperty(null);
			setHasSearched(true);
			setLoading(false);
		};

		findProperty();
	}, [
		propertyId,
		hasSearched,
		property,
		loadIdealistaProperty,
		loadContentfulProperty,
		loadPropertyImages
	]);

	// Cargar imágenes cuando tenemos una propiedad
	useEffect(() => {
		if (
			property &&
			property.source !== 'contentful' &&
			propertyImages.length === 0
		) {
			console.log(
				'🖼️ PropertyDetailPage: Loading images for existing property'
			);
			loadPropertyImages(property);
		}
	}, [property, propertyImages.length, loadPropertyImages]);

	const handleBack = () => {
		navigate(-1); // Navegar hacia atrás en el historial
	};

	if (loading || !hasSearched) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					fontSize: '18px'
				}}
			>
				Cargando propiedad...
			</div>
		);
	}

	if (!property && hasSearched) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					fontSize: '18px',
					gap: '20px'
				}}
			>
				<h2>Propiedad no encontrada</h2>
				<button
					onClick={handleBack}
					style={{
						padding: '12px 24px',
						backgroundColor: '#2c5aa0',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer'
					}}
				>
					Volver atrás
				</button>
			</div>
		);
	}

	return property.source === 'newDevelopments' ? (
		<NewDevelopmentDetail
			property={property}
			onBack={handleBack}
			images={propertyImages}
		/>
	) : (
		<PropertyDetail
			property={property}
			onBack={handleBack}
			images={propertyImages}
		/>
	);
};

export default PropertyDetailPage;
