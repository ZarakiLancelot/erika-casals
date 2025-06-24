import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIdealistaProperties } from '../../hooks/useIdealistaProperties';
import { useContentfulSaleProperties } from '../../hooks/useContentfulProperties';
import PropertyDetail from './PropertyDetail';
import PageTransition from '../common/PageTransition';
import ScrollAnimation from '../common/ScrollAnimation';
import {
	PropertiesContainer,
	ContentWrapper,
	HeaderSection,
	MainContainer,
	FilterSidebar,
	FilterCard,
	FilterTitle,
	FilterGroup,
	FilterLabel,
	FilterSelect,
	FilterInput,
	PriceRangeGroup,
	PriceInput,
	PriceSeparator,
	PropertiesSection,
	ResultsHeader,
	ResultsCount,
	PropertiesGrid,
	PropertyCard as StyledPropertyCard,
	PropertyImage,
	ImageLoader,
	PropertyContent,
	PropertyTitle,
	PropertyPrice,
	PropertyDescription,
	PropertyBottom,
	PropertyFeatures,
	PropertyFeature,
	PropertyIcon,
	LoadingSpinner,
	ErrorMessage,
	EmptyState,
	// Componentes de navegación
	StyledNavbar,
	StyledNavLeft,
	StyledNavCenter,
	StyledNavLi,
	StyledNavRight,
	StyledButton
} from './styles';
import Footer from '../footer/Footer';

const Properties = () => {
	const location = useLocation();
	const {
		properties,
		loading,
		error,
		setFilter,
		formatPrice,
		getPropertyMainImage,
		getPropertyTitle,
		fetchPropertyImages
	} = useIdealistaProperties();
	// Hook para obtener propiedades de Contentful
	const {
		properties: contentfulProperties,
		loading: contentfulLoading,
		error: contentfulError
	} = useContentfulSaleProperties();

	// Estados para filtros locales
	const [localFilters, setLocalFilters] = useState({
		location: '',
		minPrice: '',
		maxPrice: '',
		minArea: '',
		maxArea: '',
		features: ''
	});
	const [showDetail, setShowDetail] = useState(false);
	const [selectedProperty, setSelectedProperty] = useState(null);
	const [loadedImages, setLoadedImages] = useState(new Set());
	const [loadingImages, setLoadingImages] = useState(new Set());
	const [availableLocations, setAvailableLocations] = useState([]);
	// Establecer filtro a 'sale' al montar el componente y limpiar filtros locales
	useEffect(() => {
		setFilter('sale');
		// Limpiar filtros locales cuando se cambia de página
		setLocalFilters({
			location: '',
			minPrice: '',
			maxPrice: '',
			minArea: '',
			maxArea: '',
			features: ''
		}); // Limpiar imágenes cargadas para evitar conflictos
		setLoadedImages(new Set());
		setLoadingImages(new Set());
	}, [setFilter, location.pathname]); // Agregar location.pathname como dependencia

	// Función para cargar imagen de manera lazy solo cuando sea necesario
	const loadPropertyImage = useCallback(
		async propertyId => {
			if (
				!loadedImages.has(propertyId) &&
				!loadingImages.has(propertyId) &&
				propertyId
			) {
				setLoadingImages(prev => new Set([...prev, propertyId]));
				await fetchPropertyImages(propertyId);
				setLoadedImages(prev => new Set([...prev, propertyId]));
				setLoadingImages(prev => {
					const newSet = new Set(prev);
					newSet.delete(propertyId);
					return newSet;
				});
			}
		},
		[loadedImages, loadingImages, fetchPropertyImages]
	);

	// Generar ubicaciones disponibles basadas en las propiedades de ambas fuentes
	useEffect(() => {
		if (properties.length > 0) {
			const locations = new Set();
			properties.forEach(property => {
				if (property.address?.town) {
					locations.add(property.address.town);
				}
				if (property.address?.district) {
					locations.add(property.address.district);
				}
			});
			setAvailableLocations(Array.from(locations).sort());
		}
	}, [properties]);

	// Función para verificar si una propiedad tiene una característica específica
	const hasFeature = (property, searchTerm) => {
		const term = searchTerm.toLowerCase();

		// Búsqueda por características específicas
		if (term.includes('ascensor') || term.includes('elevador')) {
			return property.features?.liftAvailable === true;
		}

		if (
			term.includes('aire acondicionado') ||
			term.includes('aire') ||
			term.includes('ac')
		) {
			return property.features?.conditionedAir === true;
		}

		if (term.includes('terraza')) {
			return property.features?.terrace === true;
		}

		if (term.includes('balcon') || term.includes('balcón')) {
			return property.features?.balcony === true;
		}

		if (
			term.includes('garaje') ||
			term.includes('parking') ||
			term.includes('aparcamiento')
		) {
			return property.features?.parkingAvailable === true;
		}

		if (term.includes('piscina')) {
			return property.features?.pool === true;
		}

		if (term.includes('jardin') || term.includes('jardín')) {
			return property.features?.garden === true;
		}

		if (term.includes('trastero') || term.includes('storage')) {
			return property.features?.storage === true;
		}

		if (term.includes('armarios empotrados') || term.includes('armarios')) {
			return property.features?.wardrobes === true;
		}

		if (term.includes('calefaccion') || term.includes('calefacción')) {
			return (
				property.features?.heatingType &&
				property.features.heatingType !== 'none'
			);
		}

		if (term.includes('atico') || term.includes('ático')) {
			return property.features?.penthouse === true;
		}

		if (term.includes('duplex') || term.includes('dúplex')) {
			return property.features?.duplex === true;
		}

		// Si no es una característica específica, buscar en la descripción
		const description =
			property.descriptions
				?.find(desc => desc.language === 'es')
				?.text?.toLowerCase() ||
			property.descriptions?.[0]?.text?.toLowerCase() ||
			property.description?.toLowerCase() ||
			'';
		const address = property.address?.streetName?.toLowerCase() || '';
		const district = property.address?.district?.toLowerCase() || '';

		return (
			description.includes(term) ||
			address.includes(term) ||
			district.includes(term)
		);
	};
	// Combinar propiedades de Idealista y Contentful
	const allProperties = [
		...properties,
		...contentfulProperties // Ya están filtradas por venta en el hook
	];

	// Filtrar propiedades localmente según los filtros adicionales
	const filteredProperties = allProperties.filter(property => {
		// Filtro por ubicación
		if (localFilters.location && localFilters.location !== '') {
			const locationFilter = localFilters.location.toLowerCase();

			// Para propiedades de Idealista
			if (property.address) {
				const address = property.address?.streetName?.toLowerCase() || '';
				const district = property.address?.district?.toLowerCase() || '';
				const town = property.address?.town?.toLowerCase() || '';
				if (
					!address.includes(locationFilter) &&
					!district.includes(locationFilter) &&
					!town.includes(locationFilter)
				) {
					return false;
				}
			}
			// Para propiedades de Contentful
			else if (property.source === 'contentful') {
				const location = property.location?.toLowerCase() || '';
				if (!location.includes(locationFilter)) {
					return false;
				}
			}
		}
		// Filtro por precio mínimo
		if (localFilters.minPrice && localFilters.minPrice !== '') {
			const price = property.operation?.price || property.price || 0;
			if (price < parseInt(localFilters.minPrice)) {
				return false;
			}
		}

		// Filtro por precio máximo
		if (localFilters.maxPrice && localFilters.maxPrice !== '') {
			const price = property.operation?.price || property.price || 0;
			if (price > parseInt(localFilters.maxPrice)) {
				return false;
			}
		}
		// Filtro por área mínima
		if (localFilters.minArea && localFilters.minArea !== '') {
			const area =
				property.features?.areaConstructed ||
				property.features?.builtArea ||
				property.size ||
				0;
			if (area < parseInt(localFilters.minArea)) {
				return false;
			}
		}

		// Filtro por área máxima
		if (localFilters.maxArea && localFilters.maxArea !== '') {
			const area =
				property.features?.areaConstructed ||
				property.features?.builtArea ||
				property.size ||
				0;
			if (area > parseInt(localFilters.maxArea)) {
				return false;
			}
		}

		// Filtro por características específicas
		if (localFilters.features && localFilters.features !== '') {
			if (!hasFeature(property, localFilters.features)) {
				return false;
			}
		}
		return true;
	});
	// Función para obtener el título correcto de la propiedad (Idealista o Contentful)
	const getPropertyTitleUnified = property => {
		if (property.source === 'contentful') {
			return property.title || 'Propiedad exclusiva';
		}
		return getPropertyTitle(property);
	};

	// Función para obtener el tamaño de la propiedad
	const getPropertySizeUnified = property => {
		if (property.source === 'contentful') {
			return property.size;
		}
		return property.features?.areaConstructed || property.features?.builtArea;
	};

	// Función para obtener el número de habitaciones
	const getRoomsUnified = property => {
		if (property.source === 'contentful') {
			return property.rooms;
		}
		return property.features?.rooms;
	};

	// Función para obtener el número de baños
	const getBathroomsUnified = property => {
		if (property.source === 'contentful') {
			return property.bathrooms;
		}
		return property.features?.bathroomNumber;
	};

	const handleFilterChange = (filterName, value) => {
		setLocalFilters(prev => ({
			...prev,
			[filterName]: value
		}));
	};

	const handlePropertyClick = async property => {
		setSelectedProperty(property);
		setShowDetail(true);

		// Cargar imágenes si no las tiene ya
		if (property.propertyId) {
			await fetchPropertyImages(property.propertyId);
		}
	};

	if (showDetail && selectedProperty) {
		return (
			<PropertyDetail
				property={selectedProperty}
				onBack={() => setShowDetail(false)}
			/>
		);
	}

	return (
		<PropertiesContainer>
			{' '}
			<ContentWrapper>
				<StyledNavbar>
					<StyledNavLeft></StyledNavLeft>{' '}
					<StyledNavCenter>
						<StyledNavLi>
							<Link to='/'>Inicio</Link>
						</StyledNavLi>
						<StyledNavLi>
							<Link to='/servicios'>Servicios</Link>
						</StyledNavLi>
						<StyledNavLi>
							<Link to='/aboutme'>Sobre mí</Link>
						</StyledNavLi>{' '}
						<StyledNavLi>
							<Link to='/rent'>Alquiler</Link>
						</StyledNavLi>
						<StyledNavLi>
							<Link to='/sales'>Venta</Link>
						</StyledNavLi>
					</StyledNavCenter>
					<StyledNavRight>
						<StyledButton>
							Hablemos <img src='/icons/whatsapp-icon.png' alt='' />
						</StyledButton>
					</StyledNavRight>{' '}
				</StyledNavbar>
				<PageTransition type='properties'>
					<HeaderSection>
						<h1>En Venta</h1>
					</HeaderSection>
					<MainContainer>
						{/* Sidebar de filtros */}
						<FilterSidebar>
							<FilterCard>
								<FilterTitle>Filtros de búsqueda</FilterTitle> {/* Filtros */}
								<FilterGroup>
									<FilterLabel>Localización</FilterLabel>
									<FilterSelect
										value={localFilters.location}
										onChange={e =>
											handleFilterChange('location', e.target.value)
										}
									>
										<option value=''>Todas las ubicaciones</option>
										{availableLocations.map(location => (
											<option key={location} value={location}>
												{location}
											</option>
										))}
									</FilterSelect>
								</FilterGroup>
								<FilterGroup>
									<FilterLabel>Precio</FilterLabel>
									<PriceRangeGroup>
										<PriceInput
											placeholder='Precio mín €'
											value={localFilters.minPrice}
											onChange={e =>
												handleFilterChange('minPrice', e.target.value)
											}
											type='number'
										/>
										<PriceSeparator>—</PriceSeparator>
										<PriceInput
											placeholder='Precio máx €'
											value={localFilters.maxPrice}
											onChange={e =>
												handleFilterChange('maxPrice', e.target.value)
											}
											type='number'
										/>
									</PriceRangeGroup>
								</FilterGroup>
								<FilterGroup>
									<FilterLabel>Superficie (m²)</FilterLabel>
									<PriceRangeGroup>
										<PriceInput
											placeholder='m² min'
											value={localFilters.minArea}
											onChange={e =>
												handleFilterChange('minArea', e.target.value)
											}
											type='number'
										/>
										<PriceSeparator>—</PriceSeparator>
										<PriceInput
											placeholder='m² max'
											value={localFilters.maxArea}
											onChange={e =>
												handleFilterChange('maxArea', e.target.value)
											}
											type='number'
										/>
									</PriceRangeGroup>
								</FilterGroup>
								<FilterGroup>
									<FilterLabel>Características</FilterLabel>
									<FilterInput
										placeholder='ej: ascensor, aire acondicionado, terraza...'
										value={localFilters.features}
										onChange={e =>
											handleFilterChange('features', e.target.value)
										}
										title='Busca por: ascensor, aire acondicionado, terraza, balcón, garaje, piscina, jardín, trastero, armarios, calefacción, ático, dúplex'
									/>
								</FilterGroup>
							</FilterCard>
						</FilterSidebar>{' '}
						{/* Sección principal de propiedades */}
						<PropertiesSection>
							{' '}
							<ResultsHeader>
								<ResultsCount>
									{loading || contentfulLoading
										? 'Cargando propiedades...'
										: error || contentfulError
										? 'Error al cargar propiedades'
										: `${filteredProperties.length} ${
												filteredProperties.length === 1
													? 'resultado'
													: 'resultados'
										  } encontrados`}
								</ResultsCount>
							</ResultsHeader>
							{(loading || contentfulLoading) && (
								<LoadingSpinner>Cargando propiedades...</LoadingSpinner>
							)}
							{(error || contentfulError) && (
								<ErrorMessage>{error || contentfulError}</ErrorMessage>
							)}
							{!(loading || contentfulLoading) &&
								!(error || contentfulError) &&
								filteredProperties.length === 0 && (
									<EmptyState>
										<h3>No se encontraron propiedades</h3>
										<p>Intenta ajustar los filtros o verifica la conexión</p>
									</EmptyState>
								)}{' '}
							{!(loading || contentfulLoading) &&
								!(error || contentfulError) &&
								filteredProperties.length > 0 && (
									<PropertiesGrid>
										{' '}
										{filteredProperties.map((property, index) => {
											// Para propiedades de Idealista
											const propertyId = property.propertyId;
											if (propertyId && !loadedImages.has(propertyId)) {
												loadPropertyImage(propertyId);
											} // Determinar la imagen a mostrar
											let imageSrc = '/images/home-image-1.png'; // fallback
											if (property.source === 'contentful') {
												// Para propiedades de Contentful
												if (
													property.images &&
													property.images.length > 0 &&
													property.images[0].url
												) {
													const imageUrl = property.images[0].url;
													imageSrc = imageUrl.startsWith('//')
														? `https:${imageUrl}`
														: imageUrl;
												} else {
													imageSrc = '/images/home-image-1.png';
												}
											} else {
												// Para propiedades de Idealista
												imageSrc =
													getPropertyMainImage(propertyId) ||
													'/images/home-image-1.png';
											}

											return (
												<ScrollAnimation
													key={property.id || propertyId || index}
													delay={index * 0.1}
													type='scaleIn'
												>
													<StyledPropertyCard
														key={property.id || propertyId || index}
														onClick={() => handlePropertyClick(property)}
													>
														{/* Mostrar loader mientras carga, imagen cuando está disponible, o placeholder si no hay imagen */}
														{loadingImages.has(propertyId) &&
														property.source !== 'contentful' ? (
															<ImageLoader />
														) : (
															<PropertyImage
																src={imageSrc}
																alt={getPropertyTitleUnified(property)}
															/>
														)}{' '}
														<PropertyContent>
															<PropertyIcon />
															<PropertyTitle>
																{getPropertyTitleUnified(property)}
															</PropertyTitle>
															<PropertyPrice>
																{property.source === 'contentful'
																	? `${property.price?.toLocaleString(
																			'es-ES'
																	  )} €`
																	: formatPrice(property)}
																<span>
																	{' '}
																	Ref.{' '}
																	{property.source === 'contentful'
																		? 'ex'
																		: 'ec'}
																	-
																	{property.source === 'contentful'
																		? property.id.slice(-4)
																		: propertyId?.toString().slice(-4) ||
																		  '1024'}
																</span>
															</PropertyPrice>{' '}
															<PropertyDescription>
																{(() => {
																	if (property.source === 'contentful') {
																		const description =
																			property.description ||
																			'Propiedad exclusiva con características únicas.';
																		return description.length > 150
																			? description.substring(0, 150) + '...'
																			: description;
																	}

																	if (
																		property.descriptions &&
																		property.descriptions.length > 0
																	) {
																		const esDesc = property.descriptions.find(
																			desc => desc.language === 'es'
																		);
																		const description = esDesc
																			? esDesc.text
																			: property.descriptions[0].text;
																		// Limitar a 150 caracteres
																		return description.length > 150
																			? description.substring(0, 150) + '...'
																			: description;
																	}
																	return (
																		property.description ||
																		'Excelente propiedad en una ubicación privilegiada con acabados de calidad.'
																	);
																})()}
															</PropertyDescription>{' '}
															<PropertyBottom>
																<PropertyFeatures>
																	<img src='/icons/house.png' alt='' />
																	{getPropertySizeUnified(property) && (
																		<PropertyFeature>
																			{getPropertySizeUnified(property)}m²
																		</PropertyFeature>
																	)}
																	{getRoomsUnified(property) && (
																		<PropertyFeature>
																			{getRoomsUnified(property)} hab.
																		</PropertyFeature>
																	)}
																	{getBathroomsUnified(property) && (
																		<PropertyFeature>
																			{getBathroomsUnified(property)} baños
																		</PropertyFeature>
																	)}
																	{property.source === 'contentful' && (
																		<PropertyFeature
																			style={{
																				color: '#2c5aa0',
																				fontWeight: 'bold',
																				fontSize: '10px'
																			}}
																		>
																			✨ Exclusiva
																		</PropertyFeature>
																	)}
																</PropertyFeatures>
															</PropertyBottom>
														</PropertyContent>
													</StyledPropertyCard>
												</ScrollAnimation>
											);
										})}
									</PropertiesGrid>
								)}{' '}
						</PropertiesSection>
					</MainContainer>
					<Footer />
				</PageTransition>
			</ContentWrapper>
		</PropertiesContainer>
	);
};

export default Properties;
