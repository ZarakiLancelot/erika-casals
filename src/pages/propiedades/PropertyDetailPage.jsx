import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import PropertyDetail from '../../components/properties/PropertyDetail';

const PropertyDetailPage = () => {
	const { propertyId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [property, setProperty] = useState(location.state?.property || null);
	const [loading, setLoading] = useState(!location.state?.property);
	const [hasSearched, setHasSearched] = useState(!!location.state?.property);
	const [propertyImages, setPropertyImages] = useState([]);

	// Función para cargar una propiedad específica desde la API de Idealista
	const loadIdealistaProperty = useCallback(async propertyId => {
		try {
			console.log('🔄 loadIdealistaProperty: Loading property', propertyId);
			// En producción usar rutas relativas, en desarrollo usar BACKEND_URL
			const baseUrl = import.meta.env.PROD
				? ''
				: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
			const url = `${baseUrl}/api/properties/${propertyId}`;
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
			console.log('📦 loadIdealistaProperty: Response data', result);

			if (result.success && result.data) {
				console.log('✅ loadIdealistaProperty: Property loaded successfully');
				// result.data contiene los datos de la respuesta de Idealista
				// Los datos reales de la propiedad están en result.data.property
				if (result.data.property) {
					console.log(
						'🔧 loadIdealistaProperty: Extracting property from result.data.property'
					);
					return result.data.property;
				} else {
					console.log('🔧 loadIdealistaProperty: Using result.data directly');
					return result.data;
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

	// Función para cargar imágenes específicas de una propiedad de Idealista
	const loadPropertyImages = useCallback(async propertyId => {
		try {
			console.log('🖼️ loadPropertyImages: Loading images for', propertyId);
			// En producción usar rutas relativas, en desarrollo usar BACKEND_URL
			const baseUrl = import.meta.env.PROD
				? ''
				: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
			const url = `${baseUrl}/api/properties/${propertyId}/images`;
			console.log('🖼️ loadPropertyImages: Fetching from', url);

			const response = await fetch(url);
			console.log(
				'📡 loadPropertyImages: Response status',
				response.status,
				response.ok
			);

			if (!response.ok) {
				console.log('❌ loadPropertyImages: Response not ok');
				return [];
			}

			const result = await response.json();
			console.log('📦 loadPropertyImages: Response data', result);

			if (result.success && result.data) {
				console.log('✅ loadPropertyImages: Images loaded successfully');
				// result.data contiene directamente el array de imágenes
				setPropertyImages(result.data);
				return result.data;
			} else {
				console.log(
					'❌ loadPropertyImages: Invalid response format or no images'
				);
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

		// Si venimos de navegación con estado (click desde lista) y no hemos recargado
		if (
			location.state?.property &&
			!sessionStorage.getItem(`reloaded_${propertyId}`)
		) {
			console.log(
				'🔄 PropertyDetailPage: Forcing reload for fresh data from navigation'
			);
			// Marcar que ya recargamos para esta propiedad
			sessionStorage.setItem(`reloaded_${propertyId}`, 'true');
			// Forzar recarga completa
			window.location.reload();
		}
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
				// Cargar imágenes para la propiedad de Idealista
				console.log(
					'🔍 PropertyDetailPage: Checking propertyId:',
					idealistaProperty.propertyId
				);
				console.log(
					'🔍 PropertyDetailPage: Full property object keys:',
					Object.keys(idealistaProperty)
				);
				if (idealistaProperty.propertyId) {
					console.log(
						'🖼️ PropertyDetailPage: Loading images for',
						idealistaProperty.propertyId
					);
					loadPropertyImages(idealistaProperty.propertyId);
				} else {
					console.log(
						'❌ PropertyDetailPage: No propertyId found in property object'
					);
					// Intentar con otras posibles propiedades de ID o usar el propertyId original
					const possibleIds = [
						'id',
						'propertyCode',
						'_id',
						'identifier',
						'propertyId'
					];
					let foundId = null;

					for (const idField of possibleIds) {
						if (idealistaProperty[idField]) {
							console.log(
								`🔧 PropertyDetailPage: Found ID in ${idField}:`,
								idealistaProperty[idField]
							);
							foundId = idealistaProperty[idField];
							break;
						}
					}

					// Si no encontramos ningún ID en la propiedad, usar el propertyId original de la URL
					if (!foundId) {
						console.log(
							'🔧 PropertyDetailPage: Using original propertyId from URL:',
							propertyId
						);
						foundId = propertyId;
					}

					loadPropertyImages(foundId);
				}
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
			property.propertyId &&
			propertyImages.length === 0
		) {
			console.log(
				'🖼️ PropertyDetailPage: Loading images for existing property',
				property.propertyId
			);
			loadPropertyImages(property.propertyId);
		}
	}, [property, propertyImages.length, loadPropertyImages]);

	// Limpiar sessionStorage cuando cambie la propiedad
	useEffect(() => {
		return () => {
			// Limpiar el flag de recarga cuando se desmonte o cambie
			if (propertyId) {
				sessionStorage.removeItem(`reloaded_${propertyId}`);
			}
		};
	}, [propertyId]);

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

	return (
		<PropertyDetail
			property={property}
			onBack={handleBack}
			images={propertyImages}
		/>
	);
};

export default PropertyDetailPage;
