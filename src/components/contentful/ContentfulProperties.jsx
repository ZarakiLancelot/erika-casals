import { useContentfulProperties } from '../../hooks/useContentfulProperties';
import {
	PropertiesGrid,
	PropertyCard,
	PropertyImage,
	PropertyContent,
	PropertyTitle,
	PropertyPrice,
	LoadingSpinner
} from '../properties/styles';

const ContentfulProperties = () => {
	const { properties, loading, error } = useContentfulProperties();

	if (loading) {
		return (
			<LoadingSpinner>Cargando propiedades de Contentful...</LoadingSpinner>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (properties.length === 0) {
		return <div>No hay propiedades disponibles en Contentful</div>;
	}

	return (
		<div style={{ padding: '2rem' }}>
			<h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
				Propiedades Exclusivas ({properties.length})
			</h2>
			<PropertiesGrid>
				{properties.map(property => (
					<PropertyCard key={property.id}>
						{property.images && property.images.length > 0 ? (
							<PropertyImage src={`https:${property.images[0].url}`} />
						) : (
							<PropertyImage src='/images/property-placeholder.jpg' />
						)}
						<PropertyContent>
							<PropertyTitle>{property.title}</PropertyTitle>
							<PropertyPrice>
								{property.price?.toLocaleString('es-ES')} €
								{property.type && <span> • {property.type}</span>}
							</PropertyPrice>
							<p
								style={{ color: '#6b6b6b', fontSize: '14px', margin: '8px 0' }}
							>
								📍 {property.location}
							</p>
							{property.rooms && property.size && (
								<p
									style={{
										color: '#6b6b6b',
										fontSize: '12px',
										margin: '4px 0'
									}}
								>
									🏠 {property.rooms} hab. • 📐 {property.size}m²
									{property.bathrooms && ` • 🚿 ${property.bathrooms} baños`}
								</p>
							)}
							{property.features && property.features.length > 0 && (
								<p
									style={{
										color: '#2c5aa0',
										fontSize: '11px',
										fontWeight: '500'
									}}
								>
									✨ {property.features.slice(0, 3).join(' • ')}
								</p>
							)}
							<p
								style={{
									color: '#666',
									fontSize: '10px',
									marginTop: '8px',
									padding: '4px 8px',
									backgroundColor: '#f0f0f0',
									borderRadius: '4px',
									display: 'inline-block'
								}}
							>
								📱 Exclusiva de Erika Casals
							</p>
						</PropertyContent>
					</PropertyCard>
				))}
			</PropertiesGrid>
		</div>
	);
};

export default ContentfulProperties;
