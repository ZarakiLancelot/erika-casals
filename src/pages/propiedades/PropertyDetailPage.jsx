import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import PropertyDetail from '../../components/properties/PropertyDetail';
import NewDevelopmentDetail from '../../components/properties/NewDevelopmentDetail';
import { useIdealistaProperties } from '../../hooks/useIdealistaProperties';

const PropertyDetailPage = () => {
	const { propertyId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [property, setProperty] = useState(location.state?.property || null);
	const [loading, setLoading] = useState(!location.state?.property);
	const [hasSearched, setHasSearched] = useState(!!location.state?.property);

	const { fetchProperty } = useIdealistaProperties();

	const loadContentfulProperty = useCallback(async propertyId => {
		try {
			const { getProperty } = await import('../../services/contentful');
			return await getProperty(propertyId);
		} catch {
			return null;
		}
	}, []);

	// Resetear estado cuando cambia el propertyId
	useEffect(() => {
		setProperty(location.state?.property || null);
		setLoading(!location.state?.property);
		setHasSearched(!!location.state?.property);
	}, [propertyId, location.state?.property]);

	// Cargar la propiedad si no la tenemos en el state
	useEffect(() => {
		const findProperty = async () => {
			if (!propertyId || hasSearched || property) return;

			setLoading(true);

			const isContentfulId =
				isNaN(propertyId) ||
				propertyId.includes('-') ||
				propertyId.includes('mock');

			if (isContentfulId) {
				const contentfulProperty = await loadContentfulProperty(propertyId);
				if (contentfulProperty) {
					setProperty(contentfulProperty);
					setHasSearched(true);
					setLoading(false);
					return;
				}
			}

			// Buscar en el JSON estático (cache local)
			const found = await fetchProperty(propertyId);
			if (found) {
				setProperty(found);
				setHasSearched(true);
				setLoading(false);
				return;
			}

			// Último recurso: Contentful por ID numérico
			if (!isContentfulId) {
				const contentfulProperty = await loadContentfulProperty(propertyId);
				if (contentfulProperty) {
					setProperty(contentfulProperty);
					setHasSearched(true);
					setLoading(false);
					return;
				}
			}

			setProperty(null);
			setHasSearched(true);
			setLoading(false);
		};

		findProperty();
	}, [propertyId, hasSearched, property, fetchProperty, loadContentfulProperty]);

	const handleBack = () => navigate(-1);

	if (loading || !hasSearched) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' }}>
				Cargando propiedad...
			</div>
		);
	}

	if (!property && hasSearched) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', gap: '20px' }}>
				<h2>Propiedad no encontrada</h2>
				<button onClick={handleBack} style={{ padding: '12px 24px', backgroundColor: '#2c5aa0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
					Volver atrás
				</button>
			</div>
		);
	}

	return property.source === 'newDevelopments' ? (
		<NewDevelopmentDetail property={property} onBack={handleBack} images={property.images || []} />
	) : (
		<PropertyDetail property={property} onBack={handleBack} images={property.images || []} />
	);
};

export default PropertyDetailPage;
