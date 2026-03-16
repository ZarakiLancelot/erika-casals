import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import PropertyDetail from '../../components/properties/PropertyDetail';
import NewDevelopmentDetail from '../../components/properties/NewDevelopmentDetail';

const PropertyDetailPage = () => {
	const { propertyId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [property, setProperty] = useState(location.state?.property || null);
	const [loading, setLoading] = useState(!location.state?.property);
	const [hasSearched, setHasSearched] = useState(!!location.state?.property);
	const [propertyImages, setPropertyImages] = useState([]);

	// Función para cargar una propiedad específica desde el API de Inmovilla
	const loadIdealistaProperty = useCallback(async propertyId => {
		try {
			// Traer todas las propiedades y buscar por cod_ofer
			const url = `https://api.erikacasals.com/api.php?accion=paginacion&pagina=1&por_pagina=200`;
			const response = await fetch(url);
			if (!response.ok) return null;

			const result = await response.json();
			if (!result.ok) return null;

			const items = (result.data?.paginacion || []).filter(
				i => i.cod_ofer !== undefined
			);
			const item = items.find(i => String(i.cod_ofer) === String(propertyId));
			if (!item) return null;

			// Transformar al formato interno
			const NUMAGENCIA = '13731';
			const TIPO_MAP = {
				Piso: 'flat', Apartamento: 'flat', Estudio: 'studio', Loft: 'loft',
				'Ático': 'penthouse', Atico: 'penthouse', 'Dúplex': 'duplex', Duplex: 'duplex',
				'Casa / Chalet': 'house', Casa: 'house', Chalet: 'house',
				Local: 'premises', Oficina: 'office', Garaje: 'garage',
				Trastero: 'storage', Terreno: 'land', Nave: 'warehouse', Edificio: 'building'
			};
			const isRent = item.keyacci === 2;
			const numFotos = item.numfotos || 0;
			const fotoletra = item.fotoletra || 1;
			const images = numFotos > 0
				? Array.from({ length: numFotos }, (_, i) => ({
						url: `https://fotos15.apinmo.com/${NUMAGENCIA}/${item.cod_ofer}/${fotoletra}-${i + 1}.jpg`,
						id: `${item.cod_ofer}-${fotoletra}-${i + 1}`,
						position: i + 1
					}))
				: item.foto ? [{ url: item.foto, id: `${item.cod_ofer}-1`, position: 1 }] : [];
			const description = item.observaciones || item.texto || '';

			return {
				propertyId: String(item.cod_ofer),
				source: 'inmovilla',
				price: isRent ? item.precioalq : item.precioinmo,
				operation: isRent ? 'rent' : 'sale',
				size: item.m_cons || item.m_uties || null,
				rooms: item.habitaciones || null,
				bathrooms: item.banyos || null,
				images,
				description,
				descriptions: description ? [{ language: 'es', text: description }] : [],
				propertyType: TIPO_MAP[item.nbtipo] || 'flat',
				reference: String(item.cod_ofer),
				address: {
					town: item.ciudad || 'Madrid',
					district: item.zona || '',
					latitude: item.latitud || null,
					longitude: item.altitud || null
				},
				municipality: item.ciudad || 'Madrid',
				district: item.zona || '',
				latitude: item.latitud || null,
				longitude: item.altitud || null,
				features: {}
			};
		} catch (err) {
			console.error('Error al cargar la propiedad desde Inmovilla:', err);
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

	// Función para cargar imágenes desde la propiedad (ya vienen en el JSON)
	const loadPropertyImages = useCallback(async property => {
		try {
			console.log('🖼️ loadPropertyImages: Extracting images from property');

			// Las imágenes ya vienen en el objeto property desde el JSON
			if (property && property.images && Array.isArray(property.images)) {
				console.log(
					'✅ loadPropertyImages: Found',
					property.images.length,
					'images'
				);
				setPropertyImages(property.images);
				return property.images;
			} else {
				console.log('❌ loadPropertyImages: No images found in property');
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
				// Cargar imágenes desde la propiedad misma
				loadPropertyImages(idealistaProperty);
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
			propertyImages.length === 0
		) {
			console.log(
				'🖼️ PropertyDetailPage: Loading images for existing property'
			);
			loadPropertyImages(property);
		}
	}, [property, propertyImages.length, loadPropertyImages]);

	const handleBack = () => {
		navigate(-1);
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

	return property.source === 'newDevelopments' ? (
		<NewDevelopmentDetail
			property={property}
			onBack={handleBack}
			images={propertyImages}
		/>
	) : (
		<PropertyDetail
			property={property}
			onBack={handleBack}
			images={propertyImages}
		/>
	);
};

export default PropertyDetailPage;
