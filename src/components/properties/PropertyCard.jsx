import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Card = styled.div`
	background: white;
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
	transition: all 0.3s ease;
	cursor: pointer;
	position: relative;

	&:hover {
		transform: translateY(-8px);
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
	}
`;

const ImageContainer = styled.div`
	position: relative;
	height: 280px;
	overflow: hidden;
	background: #f0f0f0;
`;

const Image = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.4s ease;

	${Card}:hover & {
		transform: scale(1.08);
	}
`;

const ImageOverlay = styled.div`
	position: absolute;
	top: 16px;
	right: 16px;
	display: flex;
	gap: 8px;
	z-index: 2;
`;

const StatusBadge = styled.div`
	background: ${props => {
		if (props.type === 'sale')
			return 'linear-gradient(135deg, #ff6b35, #f7931e)';
		if (props.type === 'rent')
			return 'linear-gradient(135deg, #4ecdc4, #44a08d)';
		return 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
	}};
	color: white;
	padding: 8px 16px;
	border-radius: 20px;
	font-size: 13px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(10px);
`;

const Content = styled.div`
	padding: 28px 24px 24px 24px;
`;

const Price = styled.div`
	font-size: 26px;
	font-weight: 800;
	color: #2c3e50;
	margin-bottom: 10px;
	letter-spacing: -0.5px;
`;

const Location = styled.div`
	font-size: 16px;
	color: #7f8c8d;
	margin-bottom: 16px;
	display: flex;
	align-items: center;
	font-weight: 500;

	&:before {
		content: '📍';
		margin-right: 8px;
		font-size: 16px;
	}
`;

const Features = styled.div`
	display: flex;
	gap: 24px;
	margin-bottom: 18px;
	font-size: 14px;
	color: #34495e;
	flex-wrap: wrap;
`;

const Feature = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	font-weight: 600;
	color: #495057;

	span {
		font-size: 16px;
	}
`;

const Description = styled.p`
	color: #6c757d;
	font-size: 14px;
	line-height: 1.6;
	margin: 0;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	font-weight: 400;
`;

const PropertyCard = ({
	property,
	onClick,
	formatPrice,
	fetchPropertyImages,
	getPropertyMainImage
}) => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [currentImage, setCurrentImage] = useState(
		'/images/costa-espanola.png'
	);

	useEffect(() => {
		const loadPropertyImage = async () => {
			if (property.propertyId && !imageLoaded) {
				try {
					const images = await fetchPropertyImages(property.propertyId);
					if (images && images.length > 0) {
						setCurrentImage(images[0].url);
					}
					setImageLoaded(true);
				} catch (error) {
					console.error(
						'Error loading image for property',
						property.propertyId,
						error
					);
					setImageLoaded(true);
				}
			}
		};

		loadPropertyImage();
	}, [property.propertyId, fetchPropertyImages, imageLoaded]);

	const getOperationType = property => {
		if (!property.operation) return 'unknown';
		return property.operation.type;
	};

	const getPropertyFeatures = property => {
		const features = [];

		if (property.features?.areaConstructed) {
			features.push({
				icon: '📐',
				text: `${property.features.areaConstructed} m²`
			});
		}

		if (property.features?.rooms) {
			features.push({ icon: '🛏️', text: `${property.features.rooms} hab.` });
		}

		if (property.features?.bathroomNumber) {
			features.push({
				icon: '🚿',
				text: `${property.features.bathroomNumber} baños`
			});
		}

		return features;
	};

	const getLocationText = property => {
		if (property.address) {
			const { streetName, streetNumber, town } = property.address;
			const parts = [streetName, streetNumber, town].filter(Boolean);
			return parts.join(', ');
		}
		return 'Ubicación no especificada';
	};

	const getDescription = property => {
		if (property.descriptions && property.descriptions.length > 0) {
			// Buscar descripción en español primero
			const esDesc = property.descriptions.find(desc => desc.language === 'es');
			if (esDesc) return esDesc.text;

			// Si no hay en español, tomar la primera disponible
			return property.descriptions[0].text;
		}
		return 'Venta de locales en excelente zona. Las posibilidades son muchas dependiendo de las necesidades finales del cliente.';
	};

	return (
		<Card onClick={() => onClick(property)}>
			<ImageContainer>
				<Image
					src={currentImage}
					alt={`Propiedad en ${getLocationText(property)}`}
					onError={e => {
						e.target.src = '/images/costa-espanola.png';
					}}
				/>
				<ImageOverlay>
					<StatusBadge type={getOperationType(property)}>
						{getOperationType(property) === 'sale'
							? 'Venta'
							: getOperationType(property) === 'rent'
							? 'Alquiler'
							: 'N/A'}
					</StatusBadge>
				</ImageOverlay>
			</ImageContainer>

			<Content>
				<Price>
					{formatPrice(property)}
					<span style={{ fontSize: '13px', color: '#888', marginLeft: 8 }}>
						Ref.{' '}
						{property.source === 'contentful'
							? 'ex-' + (property.id ? property.id.slice(-4) : '')
							: property.reference && property.reference.trim() !== ''
							? property.reference
							: property.propertyId
							? 'ec-' + property.propertyId.toString().slice(-4)
							: 'ec-1024'}
					</span>
				</Price>

				<Location>{getLocationText(property)}</Location>

				<Features>
					{getPropertyFeatures(property).map((feature, idx) => (
						<Feature key={idx}>
							<span>{feature.icon}</span>
							{feature.text}
						</Feature>
					))}
				</Features>

				<Description>{getDescription(property)}</Description>
			</Content>
		</Card>
	);
};

export default PropertyCard;
