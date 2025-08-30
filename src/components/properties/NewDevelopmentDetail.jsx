import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import emailjs from '@emailjs/browser';
import {
	formatAddressByVisibility,
	shouldShowAddress
} from '../../utils/addressUtils';
import Footer from '../footer/Footer';
import ResponsiveNavbar from '../common/ResponsiveNavbar';

const DetailContainer = styled.div`
	min-height: 100vh;
	background: #f5f5f5;
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

	@media (max-width: 768px) {
		top: 120px;
	}

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
	margin: 0 auto;
	max-width: 1400px;
	overflow: hidden;

	@media (max-width: 768px) {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		height: 300px;
	}

	@media (max-width: 480px) {
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 2fr 1fr;
		height: 350px;
		gap: 2px;
	}

	@media print {
		height: 400px;
		page-break-inside: avoid;

		> div:not(:first-child) {
			display: none !important;
		}

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
			grid-row: 1;
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 480px) {
		&:nth-child(2) {
			grid-row: 2;
			grid-column: 1;
		}

		&:nth-child(3) {
			grid-row: 2;
			grid-column: 2;
		}

		&:nth-child(4) {
			grid-row: 2;
			grid-column: 3;
		}

		&:nth-child(n + 5) {
			display: none;
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
	margin: 0 auto;
	background-color: white;
	display: grid;
	grid-template-columns: 2fr 1fr;
	gap: 40px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
		gap: 30px;
	}

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

const ProjectDescriptionSection = styled.div`
	max-width: 1400px;
	margin: 20px auto;
	padding: 30px 40px;
	background: white;
	border-top: 1px solid #eee;

	h2 {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 24px;
		font-weight: 600;
		color: #000;
		margin-bottom: 20px;
		text-align: center;
	}

	p {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 16px;
		line-height: 1.7;
		color: #333;
		margin: 0;
		text-align: justify;
	}

	@media (max-width: 768px) {
		padding: 20px;
		margin: 10px;
		
		h2 {
			font-size: 20px;
		}
		
		p {
			font-size: 15px;
		}
	}

	@media print {
		page-break-inside: avoid;
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
			content: '▼';
			font-size: 14px;
		}

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
	margin-top: 25px;
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

		&:hover:not(:disabled) {
			background-color: #2c3e50;
		}

		&:disabled {
			background-color: #ccc;
			cursor: not-allowed;
			opacity: 0.7;
		}
	}
`;

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
	text-align: center;
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

const FooterWrapper = styled.div`
	@media print {
		display: none !important;
	}
`;

const NewDevelopmentDetail = ({ property, onBack }) => {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [characteristicsExpanded, setCharacteristicsExpanded] = useState(false);
	const [buildingExpanded, setBuildingExpanded] = useState(false);
	const [contactForm, setContactForm] = useState({
		name: '',
		phone: '',
		message: ''
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState('');
	const [propertyImages, setPropertyImages] = useState([]);
	const [imageLoadStates, setImageLoadStates] = useState({});
	const printRef = useRef();

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	useEffect(() => {
		emailjs.init('YOUR_PUBLIC_KEY');
	}, []);

	const handlePrint = useReactToPrint({
		content: () => printRef.current
	});

	const handleWhatsAppShare = () => {
		const url = window.location.href;
		const text = `¡Mira esta propiedad! ${getPropertyTitle(property)}`;
		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
			`${text} ${url}`
		)}`;
		window.open(whatsappUrl, '_blank');
	};

	const handleFacebookShare = () => {
		const url = window.location.href;
		const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
			url
		)}`;
		window.open(facebookUrl, '_blank');
	};

	const handleTwitterShare = () => {
		const url = window.location.href;
		const text = `¡Mira esta propiedad! ${getPropertyTitle(property)}`;
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			text
		)}&url=${encodeURIComponent(url)}`;
		window.open(twitterUrl, '_blank');
	};

	useEffect(() => {
		if (property) {
			const loadImages = () => {
				let imagesToLoad = [];

				// Para newDevelopments, usar las imágenes de Contentful
				if (property.images && property.images.length > 0) {
					imagesToLoad = property.images.map(img => {
						const url = img.url || img;
						// Asegurar que la URL sea una cadena y tenga protocolo https
						if (typeof url === 'string' && url.startsWith('//')) {
							return `https:${url}`;
						}
						return url;
					});
				} else {
					// Imágenes mock si no hay imágenes disponibles
					imagesToLoad = [
						'/images/mock-property-1.jpg',
						'/images/mock-property-2.jpg',
						'/images/mock-property-3.jpg',
						'/images/mock-property-4.jpg'
					];
				}

				setPropertyImages(imagesToLoad);

				// Inicializar estados de carga
				const initialLoadStates = {};
				imagesToLoad.forEach((_, index) => {
					initialLoadStates[index] = false;
				});
				setImageLoadStates(initialLoadStates);
			};

			loadImages();
		}
	}, [property]);

	const handleImageLoad = index => {
		setImageLoadStates(prev => ({
			...prev,
			[index]: true
		}));
	};

	const openLightbox = index => {
		setCurrentImageIndex(index);
		setLightboxOpen(true);
	};

	const closeLightbox = () => {
		setLightboxOpen(false);
	};

	const nextImage = () => {
		setCurrentImageIndex(prev =>
			prev === propertyImages.length - 1 ? 0 : prev + 1
		);
	};

	const prevImage = () => {
		setCurrentImageIndex(prev =>
			prev === 0 ? propertyImages.length - 1 : prev - 1
		);
	};

	const handleKeyDown = useCallback(
		e => {
			if (lightboxOpen) {
				if (e.key === 'Escape') closeLightbox();
				if (e.key === 'ArrowLeft') prevImage();
				if (e.key === 'ArrowRight') nextImage();
			}
		},
		[lightboxOpen]
	);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleKeyDown]);

	// Funciones auxiliares específicas para newDevelopments
	const getPropertyTitle = property => {
		return property.title || property.name || 'Nuevo Desarrollo';
	};

	const formatPrice = property => {
		if (property.price) {
			return `${new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			}).format(property.minPrice)} - ${new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			}).format(property.maxPrice)}`
		}
		return 'Consultar precio';
	};

	const getLocationText = property => {
		return property.address || 'Ubicación disponible';
	};

	const getDescription = () => {
		const description = property.description || property.descriptions && property.descriptions.map(description => {
			return `${description.text}`
		}) || 'Nuevo desarrollo exclusivo con características únicas y acabados de primera calidad.'
		return description
	};

	const getPropertyFeatures = property => {
		const features = [];

		if (property.numberOfUnits) {
			features.push({
				icon: '🏠',
				value: property.numberOfUnits,
				label: 'Numero de Unidades'
			});
		}

		if (property.numberOfFloors) {
			features.push({
				icon: '🏢',
				value: property.numberOfFloors,
				label: 'Numero de Pisos'
			});
		}

		if (property.minSize || property.maxSize) {
			features.push({
				icon: '📐',
				value: `${property.minSize} - ${property.maxSize} ft²`,
				label: 'Superficie'
			});
		}

		if (property.completionYear) {
			features.push({
				icon: '📅',
				value: property.completionYear,
				label: 'Año de Completación'
			});
		}

		return features;
	};

	const getCharacteristics = property => {
		const characteristics = [];

		if (property.developer) {
			characteristics.push({
				label: 'Desarrollador',
				value: property.developer
			});
		}

		if (property.architect) {
			characteristics.push({
				label: 'Arquitecto',
				value: property.architect
			});
		}

		if (property.interiorDesign) {
			characteristics.push({
				label: 'Diseño de Interior',
				value: property.interiorDesign
			});
		}

		if (property.hoa) {
			characteristics.push({
				label: 'HOA',
				value: property.hoa
			});
		}
		if (property.depositSchedule) {
			characteristics.push({
				label: 'Plan de Depósito',
				value: property.depositSchedule
			});
		}

		return characteristics;
	};


	const handleFormChange = (field, value) => {
		setContactForm(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleFormSubmit = async e => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitMessage('');

		try {
			const templateParams = {
				from_name: contactForm.name,
				from_phone: contactForm.phone,
				message: contactForm.message,
				property_title: getPropertyTitle(property),
				property_url: window.location.href
			};

			await emailjs.send(
				'YOUR_SERVICE_ID',
				'YOUR_TEMPLATE_ID',
				templateParams
			);

			setSubmitMessage('¡Mensaje enviado correctamente!');
			setContactForm({ name: '', phone: '', message: '' });
		} catch (error) {
			console.error('Error sending email:', error);
			setSubmitMessage('Error al enviar el mensaje. Inténtalo de nuevo.');
		}

		setIsSubmitting(false);
	};

	if (!property) {
		return <div>Cargando...</div>;
	}

	return (
		<div ref={printRef}>
			<ResponsiveNavbar />
			{lightboxOpen && (
				<LightboxOverlay onClick={closeLightbox}>
					<LightboxContent onClick={e => e.stopPropagation()}>
						<LightboxImage
							src={propertyImages[currentImageIndex]}
							alt={`Imagen ${currentImageIndex + 1}`}
						/>
						<LightboxClose onClick={closeLightbox}>×</LightboxClose>
						{propertyImages.length > 1 && (
							<>
								<LightboxNav className='prev' onClick={prevImage}>
									‹
								</LightboxNav>
								<LightboxNav className='next' onClick={nextImage}>
									›
								</LightboxNav>
							</>
						)}
						<LightboxCounter>
							{currentImageIndex + 1} / {propertyImages.length}
						</LightboxCounter>
					</LightboxContent>
				</LightboxOverlay>
			)}
			<DetailContainer>
				<BackButton onClick={onBack}>←</BackButton>
				<ImageGallery>
					{propertyImages.slice(0, 7).map((image, index) => (
						<ImageItem key={index} onClick={() => openLightbox(index)}>
							{!imageLoadStates[index] && <GalleryImageLoader />}
							<GalleryImage
								src={image}
								alt={`Imagen ${index + 1}`}
								onLoad={() => handleImageLoad(index)}
								style={{ display: imageLoadStates[index] ? 'block' : 'none' }}
							/>
							{index === 6 && propertyImages.length > 7 && (
								<MoreImagesOverlay>
									+{propertyImages.length - 7} más
								</MoreImagesOverlay>
							)}
							{index < 5 && (
								<ImageOverlay />
							)}
						</ImageItem>
					))}
				</ImageGallery>
				<ContentContainer>
					<MainContent>
						<PropertyHeader>
							<PropertyTitle>{getPropertyTitle(property)}</PropertyTitle>
							<PropertyInfo>
								<PropertyPrice>
									{formatPrice(property)}
									<span>
										Ref. ex-{property.id ? property.id.slice(-4) : '1024'}
									</span>
								</PropertyPrice>
								{(property.minSize || property.maxSize) && (
									<PropertyArea>
										<img src='/icons/house.png' alt='' />
										<span>{property.minSize}ft² - {property.maxSize}ft²</span>
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
						</DescriptionSection>
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
										<span style={{
											textAlign: 'right'
										}} className='value'>{char.value}</span>
									</div>
								))}
							</CharacteristicsList>
						</CharacteristicsSection>
						{
							property?.features?.length > 0 &&
							<CharacteristicsSection expanded={buildingExpanded}>
								<h3 style={{ marginTop: '25px' }} onClick={() => setBuildingExpanded(!buildingExpanded)}>
									Características del Edificio
								</h3>
								<CharacteristicsList expanded={buildingExpanded}>
									{property?.features?.map((feature, index) => (
										<div key={index} className='characteristic'>
											<span className='label'>{feature}</span>
										</div>
									))}
								</CharacteristicsList>
							</CharacteristicsSection>
						}
					</MainContent>
					<Sidebar>
						<ContactButton
							as='a'
							href='https://wa.me/34655981758'
							target='_blank'
							rel='noopener noreferrer'
						>
							Hablemos ahora por WhatsApp
							<img src='/icons/whatsapp-icon.png' alt='' />
						</ContactButton>
						<ContactCard>
							<ContactTitle>¿Quieres saber más?</ContactTitle>
							<ContactForm onSubmit={handleFormSubmit}>
								<div className='form-group'>
									<label className='form-label'>Nombre</label>
									<input
										type='text'
										className='form-input'
										value={contactForm.name}
										onChange={e => handleFormChange('name', e.target.value)}
										placeholder='Tu nombre...'
										required
									/>
								</div>
								<div className='form-group'>
									<label className='form-label'>Teléfono</label>
									<input
										type='tel'
										className='form-input'
										value={contactForm.phone}
										onChange={e => handleFormChange('phone', e.target.value)}
										placeholder='Tu teléfono...'
										required
									/>
								</div>
								<div className='form-group'>
									<label className='form-label'>Mensaje</label>
									<textarea
										className='form-input'
										value={contactForm.message}
										onChange={e => handleFormChange('message', e.target.value)}
										placeholder='Tu mensaje, indica por favor la calle de la propiedad que quieras consultar...'
										rows={4}
										required
									/>
								</div>
								{submitMessage && (
									<div
										style={{
											color: submitMessage.includes('Error')
												? '#dc3545'
												: '#28a745',
											fontSize: '14px',
											marginBottom: '10px',
											textAlign: 'center'
										}}
									>
										{submitMessage}
									</div>
								)}
								<button
									type='submit'
									className='contact-submit'
									disabled={isSubmitting}
								>
									{isSubmitting ? 'Enviando...' : 'Contactar'}
								</button>
							</ContactForm>
						</ContactCard>

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
			</DetailContainer>
			<FooterWrapper>
				<Footer />
			</FooterWrapper>
		</div>
	);
};

export default NewDevelopmentDetail;