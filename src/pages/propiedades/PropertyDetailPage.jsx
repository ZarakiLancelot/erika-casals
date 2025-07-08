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
			const BACKEND_URL =
				import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
			const response = await fetch(
				`${BACKEND_URL}/api/properties/${propertyId}`
			);

			if (!response.ok) {
				return null;
			}

			const result = await response.json();

			if (result.success && result.data) {
				return result.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}, []);

	// Función para cargar una propiedad específica desde Contentful
	const loadContentfulProperty = useCallback(async propertyId => {
		try {
			// Aquí podrías hacer una llamada específica a Contentful si tienes un endpoint
			// Por ahora retornamos null para que use el flujo normal
			return null;
		} catch (err) {
			return null;
		}
	}, []);

	// Función para cargar imágenes específicas de una propiedad de Idealista
	const loadPropertyImages = useCallback(async propertyId => {
		try {
			const BACKEND_URL =
				import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
			const response = await fetch(
				`${BACKEND_URL}/api/properties/${propertyId}/images`
			);

			if (!response.ok) {
				return [];
			}

			const result = await response.json();

			if (result.success && result.data && result.data.images) {
				setPropertyImages(result.data.images);
				return result.data.images;
			} else {
				return [];
			}
		} catch (err) {
			return [];
		}
	}, []);

	// useEffect para forzar recarga si venimos de navegación con estado
	useEffect(() => {
		// Si tenemos una propiedad del estado de navegación y no hemos recargado aún
		const hasReloadedBefore = sessionStorage.getItem(`reloaded-${propertyId}`);

		if (property && !hasReloadedBefore) {
			sessionStorage.setItem(`reloaded-${propertyId}`, 'true');
			window.location.reload();
		}

		// Cleanup: limpiar el flag cuando cambie la propiedad
		return () => {
			sessionStorage.removeItem(`reloaded-${propertyId}`);
		};
	}, [property, propertyId]);

	useEffect(() => {
		const findProperty = async () => {
			if (!propertyId) return;

			// Si ya tenemos la propiedad del estado de navegación, no necesitamos buscarla
			if (property) {
				setHasSearched(true);
				setLoading(false);
				return;
			}

			setLoading(true);

			// Intentar cargar como propiedad de Idealista primero
			const idealistaProperty = await loadIdealistaProperty(propertyId);
			if (idealistaProperty) {
				setProperty(idealistaProperty);
				setHasSearched(true);
				setLoading(false);
				return;
			}

			// Si no es de Idealista, intentar Contentful
			const contentfulProperty = await loadContentfulProperty(propertyId);
			if (contentfulProperty) {
				setProperty(contentfulProperty);
				setHasSearched(true);
				setLoading(false);
				return;
			}

			// Si no se encuentra en ningún lado
			setProperty(null);
			setHasSearched(true);
			setLoading(false);
		};

		findProperty();
	}, [propertyId, property, loadIdealistaProperty, loadContentfulProperty]);

	// useEffect separado para manejar la carga de imágenes cuando cambia la propiedad
	useEffect(() => {
		if (
			property &&
			property.source !== 'contentful' &&
			property.propertyId &&
			propertyImages.length === 0
		) {
			loadPropertyImages(property.propertyId);
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

	return (
		<PropertyDetail
			property={property}
			onBack={handleBack}
			images={propertyImages}
		/>
	);
};

export default PropertyDetailPage;
