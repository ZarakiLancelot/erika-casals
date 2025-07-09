import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import { useIdealistaProperties } from '../../hooks/useIdealistaProperties';
import Footer from '../footer/Footer';

const DetailContainer = styled.div`
	min-height: 100vh;
	background: #f5f5f5;
`;

// Navegación
const StyledNavbar = styled.nav`
	color: white;
	display: flex;
	background-color: #16243e;
	justify-content: space-between;
	align-items: center;
	padding: 3rem 5%;
	position: relative;

	/* Ocultar navegación en la impresión */
	@media print {
		display: none !important;
	}

	@media (max-width: 768px) {
		padding: 1.5rem 1rem;
		flex-direction: column;
		gap: 1rem;
	}
`;

const StyledNavLeft = styled.div`
	flex: 1;
`;

const StyledNavCenter = styled.ul`
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 2;
	text-align: center;
	gap: 2rem;

	@media (max-width: 768px) {
		gap: 1rem;
		flex-wrap: wrap;
		order: 2;
	}
`;

const StyledNavLi = styled.li`
	list-style: none;
	color: white;
	cursor: pointer;
	transition: color 0.3s ease;
	font-weight: 300;
	letter-spacing: 1px;

	a {
		color: white;
		text-decoration: none;
		transition: color 0.3s ease;

		&:hover {
			color: rgb(167, 196, 250);
		}
	}

	&:hover {
		color: rgb(167, 196, 250);
	}

	@media (max-width: 768px) {
		font-size: 0.9rem;
	}
`;

const StyledNavRight = styled.div`
	flex: 1;

	@media (max-width: 768px) {
		order: 1;
		flex: none;
	}
`;

const StyledButton = styled.button`
	border: none;
	background-color: white;
	border-radius: 20px;
	padding: 0.4rem 1.5rem;
	font-family: 'Montserrat', sans-serif;
	font-weight: 500;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 1rem;
	transition: background-color 0.3s ease;
	justify-self: center;
	color: #16243e;
	font-size: 12px;

	img {
		width: 1.2rem;
		height: 1.2rem;
	}

	&:hover {
		background-color: rgb(167, 196, 250);
	}

	@media (max-width: 768px) {
		padding: 0.6rem 1.2rem;
		font-size: 0.9rem;
		gap: 0.8rem;
		border-radius: 18px;

		img {
			width: 1.2rem !important;
			height: 1.2rem !important;
		}
	}

	@media (max-width: 480px) {
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
		gap: 0.6rem;
	}
`;

const BackButton = styled.button`
	position: fixed;
	top: 180px;
	left: 20px;
	z-index: 1000;
	background: rgba(0, 0, 0, 0.7);
	color: white;
	border: none;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	transition: all 0.3s ease;

	&:hover {
		background: rgba(0, 0, 0, 0.9);
		transform: scale(1.1);
	}

	/* Ocultar botón de volver en la impresión */
	@media print {
		display: none !important;
	}
`;

const ImageGallery = styled.div`
	position: relative;
	height: 550px;
	display: grid;
	grid-template-columns: 2fr 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 4px;
	padding: 0;
	margin: 0;

	overflow: hidden;

	@media (max-width: 768px) {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		height: 300px;
	}

	@media (max-width: 480px) {
		grid-template-columns: 1fr;
		grid-template-rows: repeat(5, 1fr);
		height: 250px;
	}

	/* Optimizar para impresión */
	@media print {
		height: 400px;
		page-break-inside: avoid;

		/* Mostrar solo la imagen principal */
		> div:not(:first-child) {
			display: none !important;
		}

		/* La primera imagen ocupa todo el espacio disponible */
		> div:first-child {
			grid-column: 1 / -1;
			grid-row: 1 / -1;
		}
	}
`;

const ImageItem = styled.div`
	position: relative;
	overflow: hidden;
	cursor: pointer;

	&:first-child {
		grid-row: 1 / -1;

		@media (max-width: 768px) {
			grid-row: 1 / 3;
			grid-column: 1 / -1;
		}

		@media (max-width: 480px) {
			grid-row: 1 / 3;
			grid-column: 1;
		}
	}
`;

const GalleryImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: all 0.3s ease;

	&:hover {
		transform: scale(1.05);
	}
`;

// Loader para imágenes del grid en PropertyDetail
const GalleryImageLoader = styled.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: loading 1.5s infinite;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	@keyframes loading {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	&::after {
		content: '';
		width: 30px;
		height: 30px;
		border: 2px solid #e0e0e0;
		border-top: 2px solid #2c5aa0;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

const ImageOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0);
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 18px;
	font-weight: 600;

	${ImageItem}:hover & {
		background: rgba(0, 0, 0, 0.3);
	}
`;

const MoreImagesOverlay = styled(ImageOverlay)`
	background: rgba(0, 0, 0, 0.6);
	font-size: 24px;

	${ImageItem}:hover & {
		background: rgba(0, 0, 0, 0.8);
	}
`;

// Lightbox
const LightboxOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.9);
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: ${props => (props.show ? 1 : 0)};
	visibility: ${props => (props.show ? 'visible' : 'hidden')};
	transition: all 0.3s ease;
`;

const LightboxContent = styled.div`
	position: relative;
	max-width: 90vw;
	max-height: 90vh;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const LightboxImage = styled.img`
	max-width: 100%;
	max-height: 100%;
	object-fit: contain;
`;

const LightboxClose = styled.button`
	position: absolute;
	top: -50px;
	right: 0;
	background: none;
	border: none;
	color: white;
	font-size: 30px;
	cursor: pointer;
	padding: 10px;
	transition: all 0.3s ease;

	&:hover {
		transform: scale(1.2);
	}
`;

const LightboxNav = styled.button`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background: rgba(255, 255, 255, 0.2);
	border: none;
	color: white;
	font-size: 24px;
	padding: 15px 20px;
	cursor: pointer;
	border-radius: 50%;
	transition: all 0.3s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	&.prev {
		left: -80px;
	}

	&.next {
		right: -80px;
	}

	@media (max-width: 768px) {
		font-size: 20px;
		padding: 12px 16px;

		&.prev {
			left: 10px;
		}

		&.next {
			right: 10px;
		}
	}

	@media (max-width: 480px) {
		font-size: 18px;
		padding: 10px 14px;

		&.prev {
			left: 5px;
		}

		&.next {
			right: 5px;
		}
	}
`;

const LightboxCounter = styled.div`
	position: absolute;
	bottom: -50px;
	left: 50%;
	transform: translateX(-50%);
	color: white;
	font-size: 16px;
	font-weight: 600;
`;

const ContentContainer = styled.div`
	max-width: 1400px;
	margin: 50px auto;
	background-color: white;
	display: grid;
	grid-template-columns: 2fr 1fr;
	gap: 40px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
		gap: 30px;
	}

	/* Estilos para impresión */
	@media print {
		margin: 0;
		max-width: none;
		grid-template-columns: 1fr;
		gap: 20px;
		box-shadow: none;
	}
`;

const MainContent = styled.div`
	background: white;
	padding: 40px;
	/* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
`;

const PropertyHeader = styled.div`
	margin-bottom: 30px;
	border-bottom: 1px solid #eee;
	padding-bottom: 20px;
`;

const PropertyTitle = styled.h1`
	font-family: 'Space Grotesk', sans-serif;
	font-size: 28px;
	font-weight: 600;
	color: #000;
	margin: 0 0 15px 0;
	line-height: 1.3;
`;

const PropertyPrice = styled.div`
	font-family: 'Space Grotesk', sans-serif;
	color: #16243e;
	font-size: 18px;
	font-weight: 400;
	margin-bottom: 10px;
	display: flex;
	align-items: baseline;
	gap: 10px;

	span {
		color: #16243e;
		font-size: 1rem;
		font-weight: normal;
	}
`;

const PropertyLocation = styled.div`
	font-family: 'Space Grotesk', sans-serif;
	font-size: 16px;
	color: #6b6b6b;
	display: flex;
	align-items: center;

	&:before {
		content: '📍';
		margin-right: 8px;
		font-size: 14px;
	}
`;

const PropertyInfo = styled.div`
	display: flex;
	align-items: baseline;
	gap: 15px;
	margin-bottom: 10px;
	flex-wrap: wrap;
`;

const PropertyArea = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	color: #666;
	font-size: 12px;

	span {
		font-family: 'Space Grotesk', sans-serif;
		align-self: last baseline;
		font-weight: 400;
		border-radius: 0;
		font-size: 14px;
		color: #16243e;
	}
`;

const PropertyFeatures = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	gap: 20px;
	margin-bottom: 30px;
	padding: 20px;
	background: #f8f9fa;
	border-radius: 0;
`;

const Feature = styled.div`
	text-align: center;

	.icon {
		font-size: 24px;
		margin-bottom: 8px;
		display: block;
	}

	.value {
		font-size: 18px;
		font-weight: 600;
		color: #2c3e50;
		margin-bottom: 4px;
	}

	.label {
		font-size: 12px;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
`;

const DescriptionSection = styled.div`
	margin-bottom: 30px;

	h3 {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: #000;
		margin-bottom: 16px;
	}

	p {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 15px;
		line-height: 1.6;
		color: #6b6b6b;
		margin: 0;
	}
`;

const CharacteristicsSection = styled.div`
	h3 {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: #000;
		margin-bottom: 20px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;

		&:after {
			content: '${props => (props.expanded ? '▼' : '▶')}';
			font-size: 14px;
		}

		/* Ocultar la flecha en la versión impresa y quitar el cursor */
		@media print {
			cursor: default;
			&:after {
				display: none;
			}
		}
	}
`;

const CharacteristicsList = styled.div`
	display: ${props => (props.expanded ? 'block' : 'none')};
	background: #f8f9fa;
	padding: 20px;
	border-radius: 0;

	/* Mostrar todos los acordeones en la versión impresa */
	@media print {
		display: block !important;
	}

	.characteristic {
		display: flex;
		justify-content: space-between;
		padding: 8px 0;
		border-bottom: 1px solid #e9ecef;

		&:last-child {
			border-bottom: none;
		}

		.label {
			font-weight: 500;
			color: #495057;
		}

		.value {
			color: #2c3e50;
		}
	}
`;

const Sidebar = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;

	/* En la versión impresa, ocultar completamente el sidebar */
	@media print {
		display: none !important;
	}
`;

const ContactCard = styled.div`
	width: 100%;
	background: white;
	border-radius: 0;
	padding: 30px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	/* text-align: center; */
`;

const ContactTitle = styled.h3`
	font-family: 'Space Grotesk', sans-serif;
	font-size: 18px;
	font-weight: 500;
	color: #16243e;
	margin-bottom: 20px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const ContactButton = styled.button`
	width: fit-content;
	border: none;
	background-color: #16243e;
	border-radius: 30px;
	padding: 1rem 2.15rem;
	font-size: 1rem;
	font-family: 'Montserrat', sans-serif;
	font-weight: 500;
	cursor: pointer;
	display: flex;
	color: white;
	align-items: center;
	gap: 1rem;
	transition: background-color 0.3s ease;
	justify-self: center;

	img {
		// hacer el icono blanco teniendo en cuenta que el fondo es un azul oscuro sin invertirlo
		width: 1.5rem;
		height: 1.5rem;
		filter: brightness(0) invert(1);
	}

	&:hover {
		background-color: rgb(167, 196, 250);
	}

	@media (max-width: 768px) {
		padding: 0.6rem 1.2rem;
		font-size: 0.9rem;
		gap: 0.8rem;
		border-radius: 18px;

		img {
			width: 1.2rem !important;
			height: 1.2rem !important;
		}
	}

	@media (max-width: 480px) {
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
	}
`;

const ContactForm = styled.form`
	.form-group {
		margin-bottom: 20px;
	}

	.form-label {
		display: block;
		margin-bottom: 8px;
		font-weight: 500;
		color: #16243e;
		font-size: 14px;
	}

	.form-input {
		width: 100%;
		padding: 12px 16px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 14px;
		font-family: 'Montserrat', sans-serif;
		transition: border-color 0.3s ease;

		&:focus {
			outline: none;
			border-color: #16243e;
		}
	}

	textarea.form-input {
		resize: vertical;
		min-height: 100px;
	}

	.contact-submit {
		width: 100%;
		padding: 12px;
		background-color: #16243e;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.3s ease;

		&:hover {
			background-color: #2c3e50;
		}
	}
`;

// Styled components para el bloque de compartir e imprimir
const SharePrintBlock = styled.div`
	width: 100%;
	background: white;
	border-radius: 0;
	padding: 30px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	margin-top: 20px;
`;

const ShareTitle = styled.h3`
	font-family: 'Space Grotesk', sans-serif;
	font-size: 18px;
	font-weight: 500;
	color: #666;
	margin-bottom: 20px;
	text-transform: none;
	letter-spacing: 0.5px;
`;

const ShareButtonsContainer = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
`;

const ShareButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 50px;
	height: 50px;
	border: none;
	border-radius: 10px;
	cursor: pointer;
	transition: all 0.3s ease;
	padding: 0;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
	}

	&:active {
		transform: translateY(-1px);
	}

	img {
		width: 24px;
		height: 24px;
		object-fit: contain;
		filter: brightness(0) invert(1); /* Hacer las imágenes blancas */
	}

	/* WhatsApp */
	&.whatsapp {
		background-color: #25d366;
	}

	/* Facebook */
	&.facebook {
		background-color: #1877f2;
	}

	/* Twitter */
	&.twitter {
		background-color: #1da1f2;

		img {
			filter: none; /* El icono SVG ya es blanco */
		}
	}

	/* Print */
	&.print {
		background-color: #6c757d;

		img {
			filter: none; /* Los iconos SVG ya son blancos */
		}
	}
`;

// Wrapper para ocultar Footer en impresión
const FooterWrapper = styled.div`
	@media print {
		display: none !important;
	}
`;

const PropertyDetail = ({ property, onBack, images }) => {
	const componentRef = useRef();
	const {
		propertyImages,
		getPropertyMainImage,
		formatPrice,
		fetchPropertyImages
	} = useIdealistaProperties();
	const [characteristicsExpanded, setCharacteristicsExpanded] = useState(false);
	const [buildingExpanded, setBuildingExpanded] = useState(false);
	const [equipmentExpanded, setEquipmentExpanded] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showLightbox, setShowLightbox] = useState(false);
	const [imagesLoading, setImagesLoading] = useState(true);
	const [contactForm, setContactForm] = useState({
		name: '',
		phone: '',
		message: ''
	});

	// Estados para gestos táctiles
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);

	// Distancia mínima para considerar un swipe
	const minSwipeDistance = 50;

	// Configuración para react-to-print
	const handlePrint = useReactToPrint({
		contentRef: componentRef,
		documentTitle: 'Detalle de Propiedad',
		onAfterPrint: () => {
			console.log('Impresión completada');
		}
	});

	// Funciones para compartir
	const handleWhatsAppShare = () => {
		const propertyTitle = getPropertyTitle(property);
		const propertyPrice = formatPrice(property);
		const currentUrl = window.location.href;
		const message = `¡Mira esta propiedad! ${propertyTitle} - ${propertyPrice}. Más detalles: ${currentUrl}`;
		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, '_blank');
	};

	const handleFacebookShare = () => {
		const currentUrl = window.location.href;
		const propertyTitle = getPropertyTitle(property);
		const propertyPrice = formatPrice(property);

		// Facebook Sharer con más parámetros
		const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
			currentUrl
		)}&quote=${encodeURIComponent(
			`${propertyTitle} - ${propertyPrice}. ¡Échale un vistazo a esta increíble propiedad!`
		)}`;
		window.open(facebookUrl, '_blank', 'width=600,height=400');
	};

	const handleTwitterShare = () => {
		const propertyTitle = getPropertyTitle(property);
		const propertyPrice = formatPrice(property);
		const currentUrl = window.location.href;
		const tweetText = `¡Mira esta propiedad! ${propertyTitle} - ${propertyPrice}`;
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			tweetText
		)}&url=${encodeURIComponent(currentUrl)}`;
		window.open(twitterUrl, '_blank', 'width=600,height=400');
	};

	// Cargar imágenes al montar el componente
	useEffect(() => {
		if (images && images.length > 0) {
			// Si se pasaron imágenes como prop, usarlas directamente
			setImagesLoading(false);
		} else if (property.source === 'contentful') {
			// Para propiedades de Contentful, las imágenes ya vienen en la propiedad
			setImagesLoading(false);
		} else if (property.propertyId && !propertyImages[property.propertyId]) {
			// Para propiedades de Idealista, cargar imágenes de la API
			setImagesLoading(true);
			fetchPropertyImages(property.propertyId).then(() => {
				setImagesLoading(false);
			});
		} else {
			setImagesLoading(false);
		}
	}, [
		images,
		property.propertyId,
		property.source,
		propertyImages,
		fetchPropertyImages
	]);
	// Imágenes de ejemplo para el grid cuando la API no devuelve fotos
	const mockImages = [
		{ url: '/images/home-image-1.png', alt: 'Vista principal de la propiedad' },
		{ url: '/images/home-image-2.png', alt: 'Sala de estar' },
		{ url: '/images/home-image-3.png', alt: 'Cocina moderna' },
		{ url: '/images/home-image-4.png', alt: 'Dormitorio principal' },
		{ url: '/images/costa-espanola.png', alt: 'Vista exterior' },
		{ url: '/images/miami.png', alt: 'Área de recreación' },
		{ url: '/images/booking-photo.png', alt: 'Baño principal' },
		{ url: '/images/who-is-image.png', alt: 'Terraza' }
	];
	// Obtener imágenes según la fuente
	const getPropertyImages = () => {
		if (images && images.length > 0) {
			// Usar las imágenes pasadas como prop (cargadas específicamente para esta propiedad)
			return images;
		} else if (
			property.source === 'contentful' &&
			property.images &&
			property.images.length > 0
		) {
			// Para propiedades de Contentful, usar las imágenes incluidas
			return property.images.map(img => ({
				url: img.url.startsWith('//') ? `https:${img.url}` : img.url,
				alt: img.title || 'Imagen de la propiedad'
			}));
		} else if (property.propertyId && propertyImages[property.propertyId]) {
			// Para propiedades de Idealista, usar las imágenes cargadas de la API
			return propertyImages[property.propertyId];
		}
		// Fallback a imágenes mock
		return mockImages;
	};

	const allImages = getPropertyImages();
	const getLocationText = property => {
		// Si viene de Contentful, usar el campo location
		if (property.source === 'contentful' && property.location) {
			return property.location;
		}

		// Para propiedades de Idealista, usar address
		if (property.address) {
			const { streetName, streetNumber, town } = property.address;
			const parts = [streetName, streetNumber, town].filter(Boolean);
			return parts.join(', ');
		}
		return 'Ubicación no especificada';
	};
	const getPropertyFeatures = property => {
		const features = [];

		// Área construida - Compatible con ambas fuentes
		const area = property.size || property.features?.areaConstructed;
		if (area) {
			features.push({
				icon: '📐',
				value: area,
				label: 'm² construidos'
			});
		}

		// Habitaciones - Compatible con ambas fuentes
		const rooms = property.rooms || property.features?.rooms;
		if (rooms) {
			features.push({
				icon: '🛏️',
				value: rooms,
				label: 'Habitaciones'
			});
		}

		// Baños - Compatible con ambas fuentes
		const bathrooms = property.bathrooms || property.features?.bathroomNumber;
		if (bathrooms) {
			features.push({
				icon: '🚿',
				value: bathrooms,
				label: 'Baños'
			});
		}

		// Planta - Solo para Idealista
		if (property.address?.floor !== undefined) {
			features.push({
				icon: '🏢',
				value: property.address.floor,
				label: 'Planta'
			});
		}

		return features;
	};
	const getCharacteristics = property => {
		const characteristics = [];

		// Tipo de propiedad - Compatible con ambas fuentes
		if (property.type) {
			// Para Contentful, puede ser "En venta"/"En alquiler", usar propertyType si está disponible
			const propertyType = property.propertyType || property.type;

			// Traducir el tipo de propiedad
			const typeMap = {
				flat: 'Piso',
				house: 'Casa',
				commercial: 'Local comercial',
				office: 'Oficina',
				garage: 'Plaza de garaje',
				land: 'Terreno',
				premises: 'Local',
				store: 'Local comercial',
				warehouse: 'Nave industrial',
				// Para Contentful
				Apartamento: 'Apartamento',
				Villa: 'Villa',
				Penthouse: 'Penthouse',
				Casa: 'Casa'
			};

			// Solo agregar si no es "En venta" o "En alquiler"
			if (propertyType !== 'En venta' && propertyType !== 'En alquiler') {
				characteristics.push({
					label: 'Tipo',
					value: typeMap[propertyType] || propertyType
				});
			}
		}

		// Superficie - Compatible con ambas fuentes
		const area = property.size || property.features?.areaConstructed;
		if (area) {
			characteristics.push({
				label: 'Superficie construida',
				value: `${area} m²`
			});
		}

		// Certificación energética - Solo Idealista por ahora
		if (property.features?.energyCertificateRating) {
			characteristics.push({
				label: 'Certificación energética',
				value: property.features.energyCertificateRating
			});
		}

		// Orientaciones - Solo Idealista
		const orientations = [];
		if (property.features?.orientationNorth) orientations.push('Norte');
		if (property.features?.orientationSouth) orientations.push('Sur');
		if (property.features?.orientationEast) orientations.push('Este');
		if (property.features?.orientationWest) orientations.push('Oeste');

		if (orientations.length > 0) {
			characteristics.push({
				label: 'Orientación',
				value: orientations.join(', ')
			});
		}

		// Estado de conservación - Solo Idealista
		if (property.features?.conservation) {
			// Traducir el estado de conservación
			const conservationMap = {
				good: 'Buen estado',
				excellent: 'Excelente estado',
				new_construction: 'Obra nueva',
				needs_renovation: 'A reformar',
				to_renovate: 'Para reformar',
				renovated: 'Reformado',
				poor: 'Mal estado'
			};
			characteristics.push({
				label: 'Estado',
				value:
					conservationMap[property.features.conservation] ||
					property.features.conservation
			});
		}

		// Para propiedades de Contentful, agregar características específicas
		if (
			property.source === 'contentful' &&
			property.features &&
			Array.isArray(property.features)
		) {
			property.features.forEach(feature => {
				characteristics.push({
					label: 'Característica',
					value: feature
				});
			});
		}

		return characteristics;
	}; // Función para obtener características del edificio
	const getBuildingCharacteristics = property => {
		const building = [];

		// Para propiedades de Idealista
		if (property.address?.floor !== undefined) {
			// Función para traducir valores de piso
			const translateFloor = floor => {
				// Si es un string, manejar casos especiales
				if (typeof floor === 'string') {
					const floorLower = floor.toLowerCase().trim();
					// Casos especiales para bajo, sótano, etc.
					if (
						floorLower === 'bj' ||
						floorLower === 'bjª' ||
						floorLower === 'bajo'
					)
						return 'Bajo';
					if (floorLower === 'st' || floorLower === 'sótano') return 'Sótano';
					if (floorLower === 'ss' || floorLower === 'semisótano')
						return 'Semisótano';
					if (floorLower === 'en' || floorLower === 'entreplanta')
						return 'Entreplanta';
					// Si es un número como string, convertir a número
					const numFloor = parseInt(floor);
					if (!isNaN(numFloor)) {
						return numFloor === 0 ? 'Bajo' : `${numFloor}ª`;
					}
					// Si no coincide con ningún patrón, devolver tal como está
					return floor;
				}
				// Si es un número
				if (typeof floor === 'number') {
					return floor === 0 ? 'Bajo' : `${floor}ª`;
				}
				// Fallback
				return floor;
			};

			building.push({
				label: 'Planta',
				value: translateFloor(property.address.floor)
			});
		}

		// Ascensor - Compatible con ambas fuentes
		const hasElevator =
			property.features?.liftAvailable ||
			(property.source === 'contentful' &&
				property.features &&
				Array.isArray(property.features) &&
				property.features.some(f => f.toLowerCase().includes('ascensor')));

		if (hasElevator !== undefined) {
			building.push({
				label: 'Ascensor',
				value: hasElevator ? 'Sí' : 'No'
			});
		}

		if (property.features?.priceCommunity) {
			building.push({
				label: 'Gastos de comunidad',
				value: `${property.features.priceCommunity}€/mes`
			});
		}

		if (property.features?.currentOccupation) {
			const occupationMap = {
				free: 'Libre',
				occupied: 'Ocupado',
				rental: 'En alquiler'
			};
			building.push({
				label: 'Estado de ocupación',
				value:
					occupationMap[property.features.currentOccupation] ||
					property.features.currentOccupation
			});
		}

		if (property.features?.windowsLocation) {
			const windowsMap = {
				internal: 'Interior',
				external: 'Exterior',
				both: 'Interior y exterior'
			};
			building.push({
				label: 'Tipo de ventanas',
				value:
					windowsMap[property.features.windowsLocation] ||
					property.features.windowsLocation
			});
		}

		if (property.features?.penthouse !== undefined) {
			building.push({
				label: 'Ático',
				value: property.features.penthouse ? 'Sí' : 'No'
			});
		}

		if (property.features?.duplex !== undefined) {
			building.push({
				label: 'Dúplex',
				value: property.features.duplex ? 'Sí' : 'No'
			});
		}

		return building;
	};

	// Función para obtener equipamiento
	const getEquipmentCharacteristics = property => {
		const equipment = [];

		if (property.features?.conditionedAir !== undefined) {
			equipment.push({
				label: 'Aire acondicionado',
				value: property.features.conditionedAir ? 'Sí' : 'No'
			});
		}

		if (property.features?.heatingType) {
			const heatingMap = {
				individual_gas: 'Gas individual',
				central_gas: 'Gas central',
				electric: 'Eléctrica',
				gasoil: 'Gasóleo',
				none: 'Sin calefacción'
			};
			equipment.push({
				label: 'Calefacción',
				value:
					heatingMap[property.features.heatingType] ||
					property.features.heatingType
			});
		}

		if (property.features?.wardrobes !== undefined) {
			equipment.push({
				label: 'Armarios empotrados',
				value: property.features.wardrobes ? 'Sí' : 'No'
			});
		}

		if (property.features?.storage !== undefined) {
			equipment.push({
				label: 'Trastero',
				value: property.features.storage ? 'Sí' : 'No'
			});
		}

		if (property.features?.parkingAvailable !== undefined) {
			equipment.push({
				label: 'Plaza de garaje',
				value: property.features.parkingAvailable ? 'Sí' : 'No'
			});
		}

		if (property.features?.pool !== undefined) {
			equipment.push({
				label: 'Piscina',
				value: property.features.pool ? 'Sí' : 'No'
			});
		}

		if (property.features?.garden !== undefined) {
			equipment.push({
				label: 'Jardín',
				value: property.features.garden ? 'Sí' : 'No'
			});
		}

		if (property.features?.terrace !== undefined) {
			equipment.push({
				label: 'Terraza',
				value: property.features.terrace ? 'Sí' : 'No'
			});
		}

		if (property.features?.balcony !== undefined) {
			equipment.push({
				label: 'Balcón',
				value: property.features.balcony ? 'Sí' : 'No'
			});
		}

		if (property.features?.handicappedAdaptedAccess !== undefined) {
			equipment.push({
				label: 'Acceso adaptado',
				value: property.features.handicappedAdaptedAccess ? 'Sí' : 'No'
			});
		}

		return equipment;
	};
	const getDescription = property => {
		// Si viene de Contentful y tiene descripción, usarla
		if (property.source === 'contentful' && property.description) {
			return property.description;
		}

		// Para propiedades de Idealista, usar descriptions
		if (property.descriptions && property.descriptions.length > 0) {
			const esDesc = property.descriptions.find(desc => desc.language === 'es');
			if (esDesc) return esDesc.text;
			return property.descriptions[0].text;
		}

		// Descripción por defecto
		return `Venta de locales en excelente zona. Las posibilidades son muchas dependiendo de las necesidades finales del cliente. Actualmente un 60% de la superficie se destina. Con aproximadamente la mitad de locales de fachada Su distribución permite realizar locales distribuidos en una o dos plantas inferiores casatrasteras). Uno de los locales solo la fachada es acristalada y otros dos tienen amplias ventanas y puertas con acceso. Con ubicación, privilegiada a pocos metros del Ayuntamiento, centro comercial así como del metro línea 12) y fuente. Contactanos para más información.`;
	};
	const getPropertyTitle = property => {
		// Si viene de Contentful y tiene título, usarlo
		if (property.source === 'contentful' && property.title) {
			return property.title;
		}

		// Para propiedades de Idealista, generar título como antes
		const type = property.type || 'Propiedad';
		const location = property.address?.town || 'Madrid';

		const typeTranslations = {
			flat: 'Piso',
			house: 'Casa',
			commercial: 'Local comercial',
			office: 'Oficina',
			garage: 'Garaje',
			land: 'Terreno'
		};

		const translatedType = typeTranslations[type] || type;
		return `${translatedType} en ${location}`;
	};
	const handleFormChange = (field, value) => {
		setContactForm(prev => ({
			...prev,
			[field]: value
		}));
	};

	const openLightbox = index => {
		setCurrentImageIndex(index);
		setShowLightbox(true);
	};

	const closeLightbox = () => {
		setShowLightbox(false);
	};
	const nextImage = useCallback(() => {
		setCurrentImageIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
	}, [allImages.length]);
	const prevImage = useCallback(() => {
		setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
	}, [allImages.length]);

	// Funciones para manejar gestos táctiles
	const onTouchStart = e => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
	};

	const onTouchMove = e => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe && allImages.length > 1) {
			nextImage();
		}
		if (isRightSwipe && allImages.length > 1) {
			prevImage();
		}
	};

	// Manejar teclas del lightbox
	useEffect(() => {
		const handleKeyPress = e => {
			if (!showLightbox) return;

			switch (e.key) {
				case 'Escape':
					closeLightbox();
					break;
				case 'ArrowLeft':
					prevImage();
					break;
				case 'ArrowRight':
					nextImage();
					break;
				default:
					break;
			}
		};
		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [showLightbox, nextImage, prevImage]);

	return (
		<DetailContainer>
			{/* Navegación */}
			<StyledNavbar>
				<StyledNavLeft></StyledNavLeft>
				<StyledNavCenter>
					<StyledNavLi>
						<Link to='/'>Inicio</Link>
					</StyledNavLi>
					<StyledNavLi>
						<Link to='/servicios'>Servicios</Link>
					</StyledNavLi>
					<StyledNavLi>Sobre mí</StyledNavLi>
					<StyledNavLi>
						<Link to='/rent'>Alquiler</Link>
					</StyledNavLi>
					<StyledNavLi>
						<Link to='/sales'>Venta</Link>
					</StyledNavLi>
				</StyledNavCenter>
				<StyledNavRight>
					<StyledButton
						as='a'
						href='https://wa.me/34655981758'
						target='_blank'
						rel='noopener noreferrer'
					>
						Hablemos <img src='/icons/whatsapp-icon.png' alt='' />
					</StyledButton>
				</StyledNavRight>
			</StyledNavbar>{' '}
			<BackButton onClick={onBack}>←</BackButton>
			{/* Lightbox */}
			<LightboxOverlay show={showLightbox} onClick={closeLightbox}>
				<LightboxContent onClick={e => e.stopPropagation()}>
					<LightboxClose onClick={closeLightbox}>×</LightboxClose>
					{allImages.length > 1 && (
						<>
							<LightboxNav className='prev' onClick={prevImage}>
								‹
							</LightboxNav>
							<LightboxNav className='next' onClick={nextImage}>
								›
							</LightboxNav>
						</>
					)}{' '}
					<LightboxImage
						src={
							allImages[currentImageIndex]?.url ||
							allImages[currentImageIndex]?.link ||
							getPropertyMainImage(property.propertyId)
						}
						alt={`Imagen ${currentImageIndex + 1}`}
						onTouchStart={onTouchStart}
						onTouchMove={onTouchMove}
						onTouchEnd={onTouchEnd}
					/>
					<LightboxCounter>
						{currentImageIndex + 1} / {allImages.length}
					</LightboxCounter>
				</LightboxContent>
			</LightboxOverlay>{' '}
			{/* Contenido principal */}
			<ContentContainer ref={componentRef}>
				{' '}
				{/* Galería de imágenes ocupando todo el ancho */}
				<ImageGallery style={{ gridColumn: '1 / -1' }}>
					{imagesLoading
						? // Mostrar loaders mientras cargan las imágenes
						  Array.from({ length: 7 }, (_, index) => (
								<ImageItem key={index}>
									<GalleryImageLoader />
								</ImageItem>
						  ))
						: // Mostrar imágenes reales una vez cargadas
						  allImages.slice(0, 7).map((image, index) => (
								<ImageItem key={index} onClick={() => openLightbox(index)}>
									<GalleryImage
										src={
											image.url ||
											image.link ||
											getPropertyMainImage(property.propertyId)
										}
										alt={`Imagen ${index + 1}`}
									/>
									{index === 6 && allImages.length > 7 ? (
										<MoreImagesOverlay>
											+{allImages.length - 6} más
										</MoreImagesOverlay>
									) : (
										<ImageOverlay />
									)}
								</ImageItem>
						  ))}
				</ImageGallery>{' '}
				<MainContent>
					<PropertyHeader>
						<PropertyTitle>{getPropertyTitle(property)}</PropertyTitle>{' '}
						<PropertyInfo>
							{' '}
							<PropertyPrice>
								{formatPrice(property)}
								<span>
									{' '}
									Ref. ec-
									{property.propertyId?.toString().slice(-4) ||
										property.id?.toString().slice(-4) ||
										'1024'}
								</span>
							</PropertyPrice>{' '}
							{(property.size || property.features?.areaConstructed) && (
								<PropertyArea>
									<img src='/icons/house.png' alt='' />
									<span>
										{property.size || property.features?.areaConstructed}m²
									</span>
								</PropertyArea>
							)}
						</PropertyInfo>
						<PropertyLocation>{getLocationText(property)}</PropertyLocation>
					</PropertyHeader>
					<PropertyFeatures>
						{getPropertyFeatures(property).map((feature, index) => (
							<Feature key={index}>
								<span className='icon'>{feature.icon}</span>
								<div className='value'>{feature.value}</div>
								<div className='label'>{feature.label}</div>
							</Feature>
						))}
					</PropertyFeatures>
					<DescriptionSection>
						<h3>Descripción</h3>
						<p>{getDescription(property)}</p>
					</DescriptionSection>{' '}
					<CharacteristicsSection expanded={characteristicsExpanded}>
						<h3
							onClick={() =>
								setCharacteristicsExpanded(!characteristicsExpanded)
							}
						>
							Características básicas
						</h3>
						<CharacteristicsList expanded={characteristicsExpanded}>
							{getCharacteristics(property).map((char, index) => (
								<div key={index} className='characteristic'>
									<span className='label'>{char.label}</span>
									<span className='value'>{char.value}</span>
								</div>
							))}{' '}
						</CharacteristicsList>
					</CharacteristicsSection>
					{/* Acordeón de Edificio */}
					<CharacteristicsSection expanded={buildingExpanded}>
						<h3 onClick={() => setBuildingExpanded(!buildingExpanded)}>
							Edificio
						</h3>
						<CharacteristicsList expanded={buildingExpanded}>
							{getBuildingCharacteristics(property).map((char, index) => (
								<div key={index} className='characteristic'>
									<span className='label'>{char.label}</span>
									<span className='value'>{char.value}</span>
								</div>
							))}{' '}
						</CharacteristicsList>
					</CharacteristicsSection>
					{/* Acordeón de Equipamiento */}
					<CharacteristicsSection expanded={equipmentExpanded}>
						<h3 onClick={() => setEquipmentExpanded(!equipmentExpanded)}>
							Equipamiento
						</h3>
						<CharacteristicsList expanded={equipmentExpanded}>
							{getEquipmentCharacteristics(property).map((char, index) => (
								<div key={index} className='characteristic'>
									<span className='label'>{char.label}</span>
									<span className='value'>{char.value}</span>
								</div>
							))}{' '}
						</CharacteristicsList>
					</CharacteristicsSection>
				</MainContent>
				{/* Sidebar de contacto */}
				<Sidebar>
					<ContactButton
						as='a'
						href='https://wa.me/34655981758'
						target='_blank'
						rel='noopener noreferrer'
					>
						Hablemos ahora por WhatsApp{' '}
						<img src='/icons/whatsapp-icon.png' alt='' />
					</ContactButton>
					<ContactCard>
						<ContactTitle>¿Quieres saber más?</ContactTitle>

						<ContactForm>
							<div className='form-group'>
								<label className='form-label'>Nombre</label>
								<input
									type='text'
									className='form-input'
									value={contactForm.name}
									onChange={e => handleFormChange('name', e.target.value)}
									placeholder='Tu nombre'
								/>
							</div>{' '}
							<div className='form-group'>
								<label className='form-label'>Teléfono</label>
								<input
									type='tel'
									className='form-input'
									value={contactForm.phone}
									onChange={e => handleFormChange('phone', e.target.value)}
									placeholder='Tu teléfono'
								/>
							</div>
							<div className='form-group'>
								<label className='form-label'>Mensaje</label>
								<textarea
									className='form-input'
									value={contactForm.message}
									onChange={e => handleFormChange('message', e.target.value)}
									placeholder='Tu mensaje'
									rows={4}
								/>
							</div>
							<button className='contact-submit'>Contactar</button>
						</ContactForm>
					</ContactCard>

					{/* Bloque de compartir e imprimir */}
					<SharePrintBlock>
						<ShareTitle>Comparte este inmueble</ShareTitle>
						<ShareButtonsContainer>
							<ShareButton
								className='whatsapp'
								onClick={handleWhatsAppShare}
								title='Compartir por WhatsApp'
							>
								<img src='/icons/whatsapp-icon.png' alt='WhatsApp' />
							</ShareButton>
							<ShareButton
								className='facebook'
								onClick={handleFacebookShare}
								title='Compartir en Facebook'
							>
								<img src='/icons/facebook-icon.png' alt='Facebook' />
							</ShareButton>
							<ShareButton
								className='twitter'
								onClick={handleTwitterShare}
								title='Compartir en Twitter'
							>
								<img src='/icons/twitter-icon.svg' alt='Twitter' />
							</ShareButton>
							<ShareButton
								className='print'
								onClick={handlePrint}
								title='Imprimir o guardar como PDF'
							>
								<img src='/icons/print-icon.svg' alt='Imprimir' />
							</ShareButton>
						</ShareButtonsContainer>
					</SharePrintBlock>
				</Sidebar>
			</ContentContainer>
			<FooterWrapper>
				<Footer />
			</FooterWrapper>
		</DetailContainer>
	);
};

export default PropertyDetail;
