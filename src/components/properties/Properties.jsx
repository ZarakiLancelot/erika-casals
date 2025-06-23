import { useState, useEffect } from 'react';
import { useBackendProperties } from '../hooks/useBackendProperties';
import styled from 'styled-components';

// Styled components (los mismos estilos del componente original)
const PropertyListContainer = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	font-family: Arial, sans-serif;
`;

const FilterSection = styled.div`
	margin-bottom: 30px;
	text-align: center;
`;

const FilterButton = styled.button`
	background: ${props => (props.active ? '#ff6b35' : '#f5f5f5')};
	color: ${props => (props.active ? 'white' : '#333')};
	border: none;
	padding: 12px 24px;
	margin: 0 10px;
	border-radius: 25px;
	cursor: pointer;
	font-size: 16px;
	font-weight: 500;
	transition: all 0.3s ease;

	&:hover {
		background: ${props => (props.active ? '#e55a2b' : '#e0e0e0')};
	}
`;

const StatusBar = styled.div`
	background: ${props => (props.usingMock ? '#fff3cd' : '#d4edda')};
	border: 1px solid ${props => (props.usingMock ? '#ffeaa7' : '#c3e6cb')};
	color: ${props => (props.usingMock ? '#856404' : '#155724')};
	padding: 12px;
	border-radius: 8px;
	margin-bottom: 20px;
	text-align: center;
	font-size: 14px;
`;

const LoadingSpinner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200px;
	font-size: 18px;
	color: #666;
`;

const PropertiesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
	gap: 20px;
	margin-top: 20px;
`;

const PropertyCard = styled.div`
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	cursor: pointer;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
	}
`;

const ImageSliderContainer = styled.div`
	position: relative;
	width: 100%;
	height: 250px;
	overflow: hidden;
`;

const ImageSlider = styled.div`
	display: flex;
	width: ${props => props.imageCount * 100}%;
	height: 100%;
	transform: translateX();
	transition: transform 0.3s ease;
`;

const PropertyImage = styled.img`
	width: ${props => 100 / props.totalImages}%;
	height: 250px;
	object-fit: cover;
	display: block;
	flex-shrink: 0;
`;

const SliderControls = styled.div`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	display: flex;
	justify-content: space-between;
	width: 100%;
	padding: 0 10px;
	pointer-events: none;
`;

const SliderButton = styled.button`
	background: rgba(0, 0, 0, 0.5);
	color: white;
	border: none;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	pointer-events: all;
	font-size: 18px;
	transition: background 0.3s ease;

	&:hover {
		background: rgba(0, 0, 0, 0.7);
	}

	&:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
`;

const ImageCounter = styled.div`
	position: absolute;
	bottom: 10px;
	right: 10px;
	background: rgba(0, 0, 0, 0.7);
	color: white;
	padding: 4px 8px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
`;

const PropertyContent = styled.div`
	padding: 20px;
`;

const PropertyTitle = styled.h3`
	font-size: 18px;
	font-weight: 600;
	color: #333;
	margin: 0 0 10px 0;
	line-height: 1.3;
`;

const PropertyPrice = styled.div`
	font-size: 24px;
	font-weight: 700;
	color: #ff6b35;
	margin-bottom: 15px;
`;

const PropertyDetails = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 15px;
	font-size: 14px;
	color: #666;
`;

const PropertyDetailItem = styled.div`
	display: flex;
	align-items: center;
	gap: 5px;
`;

const PropertyAddress = styled.div`
	font-size: 14px;
	color: #888;
	margin-bottom: 15px;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
`;

const PropertyFeatures = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
`;

const FeatureTag = styled.span`
	background: #f0f8ff;
	color: #0066cc;
	padding: 4px 8px;
	border-radius: 12px;
	font-size: 12px;
	border: 1px solid #e0f2ff;
`;

// Modal
const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	padding: 20px;
`;

const ModalContent = styled.div`
	background: white;
	border-radius: 12px;
	max-width: 800px;
	max-height: 90vh;
	overflow-y: auto;
	position: relative;
`;

const CloseButton = styled.button`
	position: absolute;
	top: 15px;
	right: 15px;
	background: rgba(0, 0, 0, 0.5);
	color: white;
	border: none;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	cursor: pointer;
	font-size: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;

	&:hover {
		background: rgba(0, 0, 0, 0.7);
	}
`;

const ModalImage = styled.img`
	width: 100%;
	height: 400px;
	object-fit: cover;
`;

const ModalBody = styled.div`
	padding: 30px;
`;

const ModalTitle = styled.h2`
	font-size: 24px;
	color: #333;
	margin: 0 0 10px 0;
`;

const ModalPrice = styled.div`
	font-size: 32px;
	font-weight: 700;
	color: #ff6b35;
	margin-bottom: 20px;
`;

const ModalDescription = styled.div`
	font-size: 16px;
	line-height: 1.6;
	color: #666;
	margin-bottom: 20px;
`;

const ModalFeatures = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 20px;
`;

const ContactInfo = styled.div`
	background: #f8f9fa;
	padding: 20px;
	border-radius: 8px;
	margin-top: 20px;

	h4 {
		margin: 0 0 10px 0;
		color: #333;
	}

	p {
		margin: 5px 0;
		color: #666;
	}
`;

const Properties = () => {
	const [operation, setOperation] = useState('all');
	const [selectedProperty, setSelectedProperty] = useState(null);
	const {
		properties: allProperties,
		loading,
		error,
		filterByOperation
	} = useBackendProperties();

	// Filter properties based on selected operation
	const properties =
		operation === 'all' ? allProperties : filterByOperation(operation);

	const handleFilterChange = newOperation => {
		setOperation(newOperation);
	};

	// Componente de Slider de Imágenes
	const ImageSliderComponent = ({ images, propertyTitle }) => {
		const [currentIndex, setCurrentIndex] = useState(0);

		const nextImage = e => {
			e.stopPropagation();
			setCurrentIndex(prev => (prev + 1) % images.length);
		};

		const prevImage = e => {
			e.stopPropagation();
			setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
		};

		if (!images || images.length === 0) {
			return (
				<PropertyImage
					src='/images/home-image-1.png'
					alt={propertyTitle}
					totalImages={1}
				/>
			);
		}

		if (images.length === 1) {
			return (
				<PropertyImage
					src={images[0]}
					alt={propertyTitle}
					totalImages={1}
					onError={e => {
						e.target.src = '/images/home-image-1.png';
					}}
				/>
			);
		}

		return (
			<ImageSliderContainer>
				<ImageSlider imageCount={images.length} currentIndex={currentIndex}>
					{images.map((image, index) => (
						<PropertyImage
							key={index}
							src={image}
							alt={`${propertyTitle} - Imagen ${index + 1}`}
							totalImages={images.length}
							onError={e => {
								e.target.src = '/images/home-image-1.png';
							}}
						/>
					))}
				</ImageSlider>

				<SliderControls>
					<SliderButton onClick={prevImage} disabled={currentIndex === 0}>
						‹
					</SliderButton>
					<SliderButton
						onClick={nextImage}
						disabled={currentIndex === images.length - 1}
					>
						›
					</SliderButton>
				</SliderControls>

				<ImageCounter>
					{currentIndex + 1} / {images.length}
				</ImageCounter>
			</ImageSliderContainer>
		);
	};

	const openModal = property => {
		setSelectedProperty(property);
	};

	const closeModal = () => {
		setSelectedProperty(null);
	};

	// Cerrar modal al presionar Escape
	useEffect(() => {
		const handleEscape = e => {
			if (e.key === 'Escape') {
				closeModal();
			}
		};

		if (selectedProperty) {
			document.addEventListener('keydown', handleEscape);
			return () => document.removeEventListener('keydown', handleEscape);
		}
	}, [selectedProperty]);

	return (
		<PropertyListContainer>
			<h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
				Propiedades Disponibles
			</h1>
			<FilterSection>
				<FilterButton
					active={operation === 'all'}
					onClick={() => handleFilterChange('all')}
				>
					Todas las propiedades
				</FilterButton>
				<FilterButton
					active={operation === 'sale'}
					onClick={() => handleFilterChange('sale')}
				>
					En venta
				</FilterButton>
				<FilterButton
					active={operation === 'rent'}
					onClick={() => handleFilterChange('rent')}
				>
					En alquiler
				</FilterButton>
			</FilterSection>{' '}
			<StatusBar usingMock={!!error}>
				{error
					? '📦 Mostrando datos de prueba (backend no disponible)'
					: '🌐 Mostrando datos reales de la API'}
				{properties.length > 0 &&
					` • ${properties.length} propiedades encontradas`}
			</StatusBar>
			{loading && <LoadingSpinner>⏳ Cargando propiedades...</LoadingSpinner>}
			{error && (
				<div
					style={{
						background: '#f8d7da',
						color: '#721c24',
						padding: '15px',
						borderRadius: '8px',
						marginBottom: '20px',
						textAlign: 'center'
					}}
				>
					❌ {error}
				</div>
			)}
			{!loading && properties.length === 0 && !error && (
				<div
					style={{
						textAlign: 'center',
						padding: '50px',
						color: '#666',
						fontSize: '18px'
					}}
				>
					No se encontraron propiedades para:{' '}
					<strong>
						{operation === 'all'
							? 'todas las operaciones'
							: operation === 'sale'
							? 'venta'
							: 'alquiler'}
					</strong>
				</div>
			)}{' '}
			<PropertiesGrid>
				{properties.map(property => (
					<PropertyCard key={property.id} onClick={() => openModal(property)}>
						<ImageSliderComponent
							images={property.images}
							propertyTitle={property.title}
						/>
						<PropertyContent>
							<PropertyTitle>{property.title}</PropertyTitle>
							<PropertyPrice>
								{property.price?.toLocaleString()} €
								{property.operation === 'rent' && '/mes'}
							</PropertyPrice>
							<PropertyDetails>
								<PropertyDetailItem>📐 {property.size} m²</PropertyDetailItem>
								<PropertyDetailItem>
									🛏️ {property.rooms} hab.
								</PropertyDetailItem>
								<PropertyDetailItem>
									🚿 {property.bathrooms} baños
								</PropertyDetailItem>
							</PropertyDetails>
							<PropertyAddress>{property.address}</PropertyAddress>
							<PropertyFeatures>
								{property.features.slice(0, 3).map((feature, index) => (
									<FeatureTag key={index}>{feature}</FeatureTag>
								))}
								{property.features.length > 3 && (
									<FeatureTag>+{property.features.length - 3} más</FeatureTag>
								)}
							</PropertyFeatures>
						</PropertyContent>
					</PropertyCard>
				))}
			</PropertiesGrid>
			{/* Modal */}
			{selectedProperty && (
				<ModalOverlay onClick={closeModal}>
					<ModalContent onClick={e => e.stopPropagation()}>
						<CloseButton onClick={closeModal}>×</CloseButton>{' '}
						<ModalImage
							src={selectedProperty.images[0]}
							alt={selectedProperty.title}
							onError={e => {
								e.target.src = '/images/home-image-1.png';
							}}
						/>
						<ModalBody>
							<ModalTitle>{selectedProperty.title}</ModalTitle>
							<ModalPrice>
								{selectedProperty.price?.toLocaleString()} €
								{selectedProperty.operation === 'rent' && '/mes'}
							</ModalPrice>

							<PropertyDetails>
								<PropertyDetailItem>
									📐 {selectedProperty.size} m²
								</PropertyDetailItem>
								<PropertyDetailItem>
									🛏️ {selectedProperty.rooms} habitaciones
								</PropertyDetailItem>
								<PropertyDetailItem>
									🚿 {selectedProperty.bathrooms} baños
								</PropertyDetailItem>
							</PropertyDetails>

							<PropertyAddress
								style={{ fontSize: '16px', marginBottom: '20px' }}
							>
								📍 {selectedProperty.address}
							</PropertyAddress>

							<ModalDescription>
								{selectedProperty.description}
							</ModalDescription>

							<h4>Características:</h4>
							<ModalFeatures>
								{selectedProperty.features.map((feature, index) => (
									<FeatureTag key={index}>{feature}</FeatureTag>
								))}
							</ModalFeatures>

							<ContactInfo>
								<h4>Información de contacto</h4>
								<p>
									<strong>Nombre:</strong> {selectedProperty.contact.name}
								</p>
								<p>
									<strong>Teléfono:</strong> {selectedProperty.contact.phone}
								</p>
								<p>
									<strong>Email:</strong> {selectedProperty.contact.email}
								</p>
								{selectedProperty.reference && (
									<p>
										<strong>Referencia:</strong> {selectedProperty.reference}
									</p>
								)}
							</ContactInfo>
						</ModalBody>
					</ModalContent>
				</ModalOverlay>
			)}
		</PropertyListContainer>
	);
};

export default Properties;
