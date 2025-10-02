import ScrollAnimation from '../common/ScrollAnimation';
import {
	PropertyCard as StyledPropertyCard,
	PropertyImage,
	PropertyContent,
	PropertyTitle,
	PropertyPrice,
	PropertyDescription,
	PropertyBottom,
	PropertyFeatures,
	PropertyFeature,
	PropertyIcon
} from './styles';

const NewDevelopmentCard = ({ property, index, onClick }) => {
	// Determinar la imagen a mostrar para newDevelopments
	let imageSrc = '/images/home-image-1.png'; // fallback
	if (property?.images && property?.images?.length > 0) {
		const imageUrl = property?.images?.length > 4 ? property.images[0]?.url  : property.images[0]?.url;
		imageSrc = imageUrl?.startsWith('//')
			? `https:${imageUrl}`
			: imageUrl;
	} else {
		imageSrc = '/images/home-image-1.png';
	}

	// Función para obtener el título
	const getTitle = () => {
		return property.title || 'Nuevo Desarrollo';
	};

	// Función para obtener el precio formateado
	const getPrice = () => {
		return property.price ? `${property.minPrice.toLocaleString('es-ES')} € - ${property.maxPrice.toLocaleString('es-ES')} €` : 'Consultar precio';
	};

	// Función para obtener la referencia
	const getReference = () => {
		return 'ex-' + (property.id ? property.id.slice(-4) : 'ND01');
	};

	// Función para obtener la descripción
	const getDescription = () => {
		const description = property.description || property?.descriptions.length > 0 && property.descriptions.map(description => {
			return `${description.text}`
		}) || 'Nuevo desarrollo exclusivo con características únicas y acabados de primera calidad.'
		return description.length > 300
			? description.substring(0, 300) + '...'
			: description;
	};

	// Función para obtener el tamaño
	const getSize = () => {
		return `${property.minSize}ft² - ${property.maxSize}ft²`;
	};

	// Función para obtener habitaciones
	const getUnits = () => {
		return property.numberOfUnits;
	};

	// Función para obtener baños
	const getFloors = () => {
		return property.numberOfFloors;
	};

	return (
		<ScrollAnimation
			key={property.id || index}
			delay={index * 0.1}
			type='scaleIn'
		>
			<StyledPropertyCard
				key={property.id || index}
				onClick={() => onClick(property)}
				style={{
					boxShadow: '0 4px 12px rgba(255, 107, 53, 0.15)',
					position: 'relative'
				}}
			>

				<PropertyImage
					src={imageSrc}
					alt={getTitle()}
					style={{
						filter: 'brightness(1.05) saturate(1.1)'
					}}
				/>

				<PropertyContent>
					<PropertyIcon />
					<PropertyTitle>
						{getTitle()}
					</PropertyTitle>
					<PropertyPrice>
						{getPrice()}
						<span>
							{' '}Ref. {getReference()}
						</span>
					</PropertyPrice>
					<PropertyDescription>
						{getDescription()}
					</PropertyDescription>
					<PropertyBottom>
						<PropertyFeatures>
							<img src='/icons/house.png' alt='' />
							{getSize() && (
								<PropertyFeature>
									{getSize()}
								</PropertyFeature>
							)}
							{getUnits() && (
								<PropertyFeature>
									{getUnits()} unit.
								</PropertyFeature>
							)}
							{getFloors() && (
								<PropertyFeature>
									{getFloors()} pisos
								</PropertyFeature>
							)}
							<PropertyFeature
								style={{
									color: '#ff6b35',
									fontWeight: 'bold',
									fontSize: '10px',
									background: 'rgba(255, 107, 53, 0.1)',
									padding: '2px 6px',
									borderRadius: '8px'
								}}
							>
								🏗️ Nuevo Desarrollo
							</PropertyFeature>
						</PropertyFeatures>
					</PropertyBottom>
				</PropertyContent>
			</StyledPropertyCard>
		</ScrollAnimation>
	);
};

export default NewDevelopmentCard;