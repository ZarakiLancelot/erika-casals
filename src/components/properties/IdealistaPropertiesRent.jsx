import { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useIdealistaProperties } from '../../hooks/useIdealistaProperties';
import { useContentfulRentProperties } from '../../hooks/useContentfulProperties';
import PageTransition from '../common/PageTransition';
import ScrollAnimation from '../common/ScrollAnimation';
import {
	getOrganizedLocations,
	isInMadrid,
	getDistrictFromCoordinates
} from '../../utils/madridDistrictsGeoJSON';
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
	EmptyState
} from './styles';
import Footer from '../footer/Footer';
import ResponsiveNavbar from '../common/ResponsiveNavbar';

const PropertiesRent = () => {
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
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
	// Hook para obtener propiedades de Contentful (solo alquiler)
	const {
		properties: contentfulProperties,
		loading: contentfulLoading,
		error: contentfulError
	} = useContentfulRentProperties();
	// Estados para filtros locales
	const [localFilters, setLocalFilters] = useState({
		location: '',
		district: '', // Filtro para distritos de Madrid ciudad
		municipality: '', // Nuevo filtro para municipios de Comunidad de Madrid
		minPrice: '',
		maxPrice: '',
		minArea: '',
		maxArea: '',
		features: ''
	});
	const [loadedImages, setLoadedImages] = useState(new Set());
	const [loadingImages, setLoadingImages] = useState(new Set());
	const [availableLocations, setAvailableLocations] = useState([]);
	const [availableDistricts, setAvailableDistricts] = useState([]); // Distritos para Madrid ciudad
	const [availableMunicipalities, setAvailableMunicipalities] = useState([]); // Municipios para Comunidad de Madrid
	const [visibleProperties, setVisibleProperties] = useState(new Set());

	// Función para cargar imagen de manera lazy solo cuando sea necesario
	const loadPropertyImage = useCallback(
		async propertyId => {
			if (
				!loadedImages.has(propertyId) &&
				!loadingImages.has(propertyId) &&
				propertyId &&
				visibleProperties.has(propertyId)
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
		[loadedImages, loadingImages, visibleProperties, fetchPropertyImages]
	);

	// Intersection Observer para lazy loading de imágenes
	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const propertyId = entry.target.dataset.propertyId;
						if (propertyId && propertyId !== 'undefined') {
							setVisibleProperties(prev => new Set([...prev, propertyId]));
						}
					}
				});
			},
			{
				rootMargin: '200px', // Cargar 200px antes de que sea visible
				threshold: 0.01
			}
		);

		// Dar tiempo al DOM para renderizar y observar las tarjetas
		const setupObserver = () => {
			const cards = document.querySelectorAll('[data-property-id]');

			if (cards.length === 0) return;

			cards.forEach(card => {
				const propertyId = card.dataset.propertyId;
				if (propertyId && propertyId !== 'undefined') {
					observer.observe(card);

					// Si la tarjeta ya está visible, marcarla inmediatamente
					const rect = card.getBoundingClientRect();
					const isVisible =
						rect.top >= 0 &&
						rect.left >= 0 &&
						rect.bottom <=
							(window.innerHeight || document.documentElement.clientHeight) +
								200 &&
						rect.right <=
							(window.innerWidth || document.documentElement.clientWidth);

					if (isVisible) {
						setVisibleProperties(prev => new Set([...prev, propertyId]));
					}
				}
			});
		};

		// Intentar varias veces para asegurar que el DOM esté listo
		const timer1 = setTimeout(setupObserver, 100);
		const timer2 = setTimeout(setupObserver, 500);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			observer.disconnect();
		};
	}, [properties, contentfulProperties]); // Re-observar cuando cambien las propiedades

	// Cargar imágenes cuando una propiedad se vuelva visible
	useEffect(() => {
		visibleProperties.forEach(propertyId => {
			if (!loadedImages.has(propertyId) && !loadingImages.has(propertyId)) {
				loadPropertyImage(propertyId);
			}
		});
	}, [visibleProperties, loadedImages, loadingImages, loadPropertyImage]);

	// Establecer filtro a 'rent' al montar el componente y limpiar filtros locales
	useEffect(() => {
		setFilter('rent');

		// Obtener el filtro de localización desde los parámetros de consulta
		const locationParam = searchParams.get('location');

		// Limpiar filtros locales cuando se cambia de página
		setLocalFilters({
			location: locationParam || '',
			district: '',
			municipality: '',
			minPrice: '',
			maxPrice: '',
			minArea: '',
			maxArea: '',
			features: ''
		}); // Limpiar imágenes cargadas para evitar conflictos
		setLoadedImages(new Set());
		setLoadingImages(new Set());
	}, [setFilter, location.pathname, searchParams]); // Agregar searchParams como dependencia
	// Generar ubicaciones disponibles basadas en las propiedades organizadas jerárquicamente
	useEffect(() => {
		const allProps = [...properties, ...contentfulProperties];
		if (allProps.length > 0) {
			// Usar el nuevo sistema de organización de ubicaciones
			const organized = getOrganizedLocations(properties, contentfulProperties);

			// Crear lista de ubicaciones principales para el primer filtro
			const mainLocations = [];

			// Agregar Madrid ciudad si hay distritos
			if (
				organized.madridCiudad.districts.length > 0 ||
				organized.madridCiudad.otherLocations.length > 0
			) {
				mainLocations.push('Madrid ciudad');
			}

			// Agregar Comunidad de Madrid si hay municipios
			if (organized.comunidadMadrid.municipalities.length > 0) {
				mainLocations.push('Comunidad de Madrid y resto de España');
			}

			// Agregar ubicaciones internacionales
			if (organized.international['Costa Española'].length > 0) {
				mainLocations.push('Costa Española');
			}
			if (organized.international.Florida.length > 0) {
				mainLocations.push('Florida');
			}

			setAvailableLocations(mainLocations.sort());

			// Configurar filtros secundarios según la ubicación seleccionada
			if (localFilters.location.toLowerCase() === 'madrid ciudad') {
				setAvailableDistricts(organized.madridCiudad.districts);
				setAvailableMunicipalities([]);
			} else if (
				localFilters.location.toLowerCase() ===
				'comunidad de madrid y resto de españa'
			) {
				setAvailableDistricts([]);
				setAvailableMunicipalities(organized.comunidadMadrid.municipalities);
			} else {
				setAvailableDistricts([]);
				setAvailableMunicipalities([]);
			}
		}
	}, [properties, contentfulProperties, localFilters.location]);

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

		// Si no es una característica específica, buscar en la descripción, dirección, distrito, referencia o id
		const description =
			property.descriptions
				?.find(desc => desc.language === 'es')
				?.text?.toLowerCase() ||
			property.descriptions?.[0]?.text?.toLowerCase() ||
			property.description?.toLowerCase() ||
			'';
		const address = property.address?.streetName?.toLowerCase() || '';
		const district = property.address?.district?.toLowerCase() || '';
		const reference = property.reference?.toLowerCase() || '';
		const propertyId = property.propertyId
			? property.propertyId.toString()
			: '';
		return (
			description.includes(term) ||
			address.includes(term) ||
			district.includes(term) ||
			reference.includes(term) ||
			propertyId.includes(term)
		);
	};

	// Combinar propiedades de Idealista y Contentful
	const allProperties = [
		...properties,
		...contentfulProperties // Ya están filtradas por alquiler en el hook
	];

	// Filtrar propiedades localmente según los filtros adicionales
	const filteredProperties = allProperties.filter(property => {
		// Filtro por ubicación principal
		if (localFilters.location && localFilters.location !== '') {
			const locationFilter = localFilters.location.toLowerCase();

			// Para propiedades de Idealista
			if (property.address) {
				if (locationFilter === 'madrid ciudad') {
					// Si se selecciona Madrid ciudad, solo mostrar propiedades de Madrid
					if (!isInMadrid(property)) {
						return false;
					}

					// Si también hay filtro de distrito, aplicarlo
					if (localFilters.district && localFilters.district !== '') {
						const propertyDistrict =
							getDistrictFromCoordinates(
								property.address.latitude,
								property.address.longitude
							) || property.address.district;

						if (
							!propertyDistrict ||
							propertyDistrict.toLowerCase() !==
								localFilters.district.toLowerCase()
						) {
							return false;
						}
					}
				} else if (locationFilter === 'comunidad de madrid y resto de españa') {
					// Si se selecciona Comunidad de Madrid y resto de España, mostrar todo EXCEPTO Madrid ciudad
					if (isInMadrid(property)) {
						return false;
					}

					// Si también hay filtro de municipio, aplicarlo
					if (localFilters.municipality && localFilters.municipality !== '') {
						const propertyTown = property.address?.town?.toLowerCase() || '';
						if (propertyTown !== localFilters.municipality.toLowerCase()) {
							return false;
						}
					}
				} else {
					// Para otras ubicaciones (Costa Española, Florida), buscar coincidencia
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
			}
			// Para propiedades de Contentful
			else if (property.source === 'contentful') {
				const location = property.location?.toLowerCase() || '';
				let matchesLocation = false;

				if (locationFilter === 'madrid ciudad') {
					// Para Madrid ciudad, solo incluir si la location sugiere que es Madrid ciudad
					matchesLocation =
						location.includes('madrid') && !property.propertyZone;
				} else if (locationFilter === 'comunidad de madrid y resto de españa') {
					// Para Comunidad de Madrid y resto de España, incluir si no es Costa ni Florida
					matchesLocation =
						property.propertyZone !== 'Costa' &&
						property.propertyZone !== 'Florida';

					// Si hay filtro de municipio, aplicarlo
					if (
						matchesLocation &&
						localFilters.municipality &&
						localFilters.municipality !== ''
					) {
						matchesLocation = location.includes(
							localFilters.municipality.toLowerCase()
						);
					}
				} else {
					// Para ubicaciones específicas
					matchesLocation = location.includes(locationFilter);

					// También verificar si coincide con propertyZone
					if (!matchesLocation && property.propertyZone) {
						if (
							property.propertyZone === 'Costa' &&
							locationFilter.includes('costa española')
						) {
							matchesLocation = true;
						} else if (
							property.propertyZone === 'Florida' &&
							locationFilter.includes('florida')
						) {
							matchesLocation = true;
						}
					}
				}

				if (!matchesLocation) {
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

	// Funciones unificadas para manejo de propiedades de ambas fuentes
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
		setLocalFilters(prev => {
			const newFilters = {
				...prev,
				[filterName]: value
			};

			// Si cambia la ubicación, limpiar los filtros secundarios
			if (filterName === 'location') {
				if (value.toLowerCase() !== 'madrid ciudad') {
					newFilters.district = '';
				}
				if (value.toLowerCase() !== 'comunidad de madrid y resto de españa') {
					newFilters.municipality = '';
				}
			}

			return newFilters;
		});
	};

	const handlePropertyClick = property => {
		// Usar solo el ID sin prefijo
		const propertyId =
			property.source === 'contentful' ? property.id : property.propertyId;

		// Navegar pasando la propiedad como estado para cargar instantáneamente
		navigate(`/property/${propertyId}`, {
			state: { property }
		});
	};

	return (
		<div>
			<ResponsiveNavbar />
			<PageTransition type='properties'>
				<PropertiesContainer>
					<ContentWrapper>
						<HeaderSection
							style={{
								'--header-bg-image': 'url(/images/en-alquiler-page.png)'
							}}
						>
							<h1>En Alquiler</h1>
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
									{/* Mostrar filtro de distrito solo si Madrid ciudad está seleccionado */}
									{localFilters.location.toLowerCase() === 'madrid ciudad' &&
										availableDistricts.length > 0 && (
											<FilterGroup>
												<FilterLabel>Distrito de Madrid</FilterLabel>
												<FilterSelect
													value={localFilters.district}
													onChange={e =>
														handleFilterChange('district', e.target.value)
													}
												>
													<option value=''>Todos los distritos</option>
													{availableDistricts.map(district => (
														<option key={district} value={district}>
															{district}
														</option>
													))}
												</FilterSelect>
											</FilterGroup>
										)}
									{/* Mostrar filtro de municipio solo si Comunidad de Madrid y resto de España está seleccionado */}
									{localFilters.location.toLowerCase() ===
										'comunidad de madrid y resto de españa' &&
										availableMunicipalities.length > 0 && (
											<FilterGroup>
												<FilterLabel>Municipio</FilterLabel>
												<FilterSelect
													value={localFilters.municipality}
													onChange={e =>
														handleFilterChange('municipality', e.target.value)
													}
												>
													<option value=''>Todos los municipios</option>
													{availableMunicipalities.map(municipality => (
														<option key={municipality} value={municipality}>
															{municipality}
														</option>
													))}
												</FilterSelect>
											</FilterGroup>
										)}
									<FilterGroup>
										<FilterLabel>Precio mensual</FilterLabel>
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
							</FilterSidebar>

							{/* Sección principal de propiedades */}
							<PropertiesSection>
								<ResultsHeader>
									<ResultsCount>
										{loading
											? 'Cargando propiedades...'
											: error
											? 'Error al cargar propiedades'
											: `${filteredProperties.length} ${
													filteredProperties.length === 1
														? 'resultado'
														: 'resultados'
											  } encontrados`}
									</ResultsCount>
								</ResultsHeader>{' '}
								{(loading || contentfulLoading) && (
									<LoadingSpinner>Cargando propiedades...</LoadingSpinner>
								)}
								{(error || contentfulError) && (
									<ErrorMessage>{error || contentfulError}</ErrorMessage>
								)}
								{!loading &&
									!contentfulLoading &&
									!error &&
									!contentfulError &&
									filteredProperties.length === 0 && (
										<EmptyState>
											<h3>No se encontraron propiedades</h3>
											<p>Intenta ajustar los filtros o verifica la conexión</p>
										</EmptyState>
									)}{' '}
								{!loading &&
									!contentfulLoading &&
									!error &&
									!contentfulError &&
									filteredProperties.length > 0 && (
										<PropertiesGrid>
											{filteredProperties.map((property, index) => {
												// Para propiedades de Idealista
												const propertyId = property.propertyId;

												// Determinar si debemos mostrar skeleton loader
												const isIdealistaProperty =
													property.source !== 'contentful';
												const shouldShowSkeleton =
													isIdealistaProperty &&
													propertyId &&
													!loadedImages.has(propertyId);

												// Determinar la imagen a mostrar
												let imageSrc = null;
												if (property.source === 'contentful') {
													// Para Contentful, usar la URL de la primera imagen
													if (property.images && property.images.length > 0) {
														const imageUrl = property.images[0].url;
														imageSrc = imageUrl.startsWith('//')
															? `https:${imageUrl}`
															: imageUrl;
													} else {
														imageSrc = '/images/home-image-1.png';
													}
												} else {
													// Para propiedades de Idealista
													imageSrc = getPropertyMainImage(propertyId);
												}
												return (
													<ScrollAnimation
														key={
															property.source === 'contentful'
																? property.id
																: propertyId || index
														}
														delay={index * 0.1}
													>
														<StyledPropertyCard
															onClick={() => handlePropertyClick(property)}
															data-property-id={propertyId} // Para Intersection Observer
														>
															{/* Mostrar skeleton mientras carga imagen de Idealista */}
															{shouldShowSkeleton ? (
																<ImageLoader />
															) : (
																<PropertyImage
																	src={imageSrc || '/images/home-image-1.png'}
																	alt={getPropertyTitleUnified(property)}
																/>
															)}
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
																			? 'ex-' + property.id.slice(-4)
																			: property.reference ||
																			  propertyId?.toString().slice(-4) ||
																			  '1024'}
																	</span>
																</PropertyPrice>
																<PropertyDescription>
																	{(() => {
																		if (property.source === 'contentful') {
																			const description =
																				property.description ||
																				'Propiedad exclusiva en alquiler con características únicas.';
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
																			'Propiedad en alquiler en excelente zona. Ideal para familias o profesionales.'
																		);
																	})()}
																</PropertyDescription>
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
																		)}{' '}
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
					</ContentWrapper>
				</PropertiesContainer>
				<Footer />
			</PageTransition>
		</div>
	);
};

export default PropertiesRent;
