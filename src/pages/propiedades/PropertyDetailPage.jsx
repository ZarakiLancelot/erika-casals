import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import PropertyDetail from '../../components/properties/PropertyDetail';
import NewDevelopmentDetail from '../../components/properties/NewDevelopmentDetail';
import { useIdealistaProperties } from '../../hooks/useIdealistaProperties';

const PropertyDetailPage = () => {
	const { propertyId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [property, setProperty] = useState(location.state?.property || null);
	const [loading, setLoading] = useState(!location.state?.property);
	const pendingDescriptionRef = useRef(null);

	const { fetchProperty, fetchPropertyDescription, loading: hookLoading } = useIdealistaProperties();

	const loadContentfulProperty = useCallback(async id => {
		try {
			const { getProperty } = await import('../../services/contentful');
			return await getProperty(id);
		} catch {
			return null;
		}
	}, []);

	useEffect(() => {
		setProperty(location.state?.property || null);
		setLoading(!location.state?.property);
	}, [propertyId, location.state?.property]);

	useEffect(() => {
		if (!propertyId) return;

		const isContentfulId =
			isNaN(propertyId) ||
			propertyId.includes('-') ||
			propertyId.includes('mock');

		if (isContentfulId) {
			loadContentfulProperty(propertyId).then(p => {
				if (p) setProperty(p);
				setLoading(false);
			});
			return;
		}

		// Si las propiedades todavía están cargando, esperar.
		// Cuando hookLoading pase a false, este efecto se re-ejecuta con el array lleno.
		if (hookLoading) return;

		fetchProperty(propertyId).then(fresh => {
			if (fresh) {
				const desc = pendingDescriptionRef.current;
				pendingDescriptionRef.current = null;
				setProperty(prev => {
					const description = desc || prev?.description || '';
					return description ? { ...fresh, description } : fresh;
				});
			}
			setLoading(false);
		});
	}, [propertyId, hookLoading, fetchProperty, loadContentfulProperty]);

	// Fetch real-time description from ficha API (independent of properties list loading)
	useEffect(() => {
		const isContentfulId = !propertyId || isNaN(propertyId) || propertyId.includes('-') || propertyId.includes('mock');
		if (isContentfulId) return;
		fetchPropertyDescription(propertyId).then(description => {
			if (description) {
				setProperty(prev => {
					if (prev) return { ...prev, description };
					// La propiedad todavía no cargó — guardar para aplicar cuando llegue
					pendingDescriptionRef.current = description;
					return prev;
				});
			}
		});
	}, [propertyId, fetchPropertyDescription]);

	const handleBack = () => navigate(-1);

	if (loading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' }}>
				Cargando propiedad...
			</div>
		);
	}

	if (!property) {
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
