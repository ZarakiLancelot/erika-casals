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
		propertyType: '', // Nuevo filtro para tipo de propiedad
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
	const [availablePropertyTypes, setAvailablePropertyTypes] = useState([]); // Tipos de propiedades disponibles

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

	// Generar tipos de propiedades disponibles
	useEffect(() => {
		const allProps = [...properties, ...contentfulProperties];
		if (allProps.length > 0) {
			const types = new Set();
			allProps.forEach(property => {
				if (property.propertyType) {
					types.add(property.propertyType);
				}
			});
			setAvailablePropertyTypes(Array.from(types).sort());
		}
	}, [properties, contentfulProperties]);

	// Función para verificar si una propiedad tiene una característica específica
	const hasFeature = (property, searchTerm) => {
		const term = searchTerm.toLowerCase();

		// Búsqueda por características específicas
		if (term.includes('ascensor') || term.includes('elevador')) {
			return property.features?.liftAvailable === true || property.features?.hasLift === true;
		}

		if (
			term.includes('aire acondicionado') ||
			term.includes('aire') ||
			term.includes('ac')
		) {
			return property.features?.conditionedAir === true || property.features?.hasAirConditioning === true;
		}

		if (term.includes('terraza')) {
			return property.features?.terrace === true || property.features?.hasTerrace === true;
		}

		if (term.includes('balcon') || term.includes('balcón')) {
			return property.features?.balcony === true || property.features?.hasBalcony === true;
		}

		if (
			term.includes('garaje') ||
			term.includes('parking') ||
			term.includes('aparcamiento')
		) {
			return property.features?.parkingAvailable === true;
		}

		if (term.includes('piscina')) {
			return property.features?.pool === true || property.features?.hasSwimmingPool === true;
		}

		if (term.includes('jardin') || term.includes('jardín')) {
			return property.features?.garden === true || property.features?.hasGarden === true;
		}

		if (term.includes('trastero') || term.includes('storage')) {
			return property.features?.storage === true;
		}

		if (term.includes('armarios empotrados') || term.includes('armarios')) {
			return property.features?.wardrobes === true || property.features?.hasWardrobe === true;
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
				?.comment?.toLowerCase() ||
			property.descriptions
				?.find(desc => desc.language === 'es')
				?.text?.toLowerCase() ||
			property.descriptions?.[0]?.comment?.toLowerCase() ||
			property.descriptions?.[0]?.text?.toLowerCase() ||
			property.description?.toLowerCase() ||
			'';
		// Soportar ambos formatos (API y FTP)
		const address =
			(typeof property.address === 'string'
				? property.address
				: property.address?.streetName
			)?.toLowerCase() || '';
		const district =
			property.district?.toLowerCase() ||
			property.address?.district?.toLowerCase() ||
			'';
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

			// Para propiedades de Idealista del FTP
			if (property.propertyId && property.source !== 'contentful') {
				// Soportar ambos formatos (API y FTP)
				const lat = property.latitude || property.address?.latitude;
				const lon = property.longitude || property.address?.longitude;
				const municipality = property.municipality || property.address?.town;
				const district = property.district || property.address?.district;

				// Si no hay datos de ubicación (dirección oculta), buscar en la descripción
				if (
					(!municipality || municipality === '') &&
					(!district || district === '') &&
					!lat &&
					!lon
				) {
					const description =
						property.descriptions?.find(d => d.language === 'es')?.comment ||
						property.descriptions?.find(d => d.language === 'es')?.text ||
						'';
					const lowerDesc = description.toLowerCase();

					if (locationFilter === 'madrid ciudad') {
						// Buscar menciones de "madrid" pero no "comunidad de madrid"
						if (
							lowerDesc.includes('madrid') &&
							!lowerDesc.includes('comunidad de madrid')
						) {
							// Si también hay filtro de distrito, verificar que lo mencione
							if (localFilters.district && localFilters.district !== '') {
								if (!lowerDesc.includes(localFilters.district.toLowerCase())) {
									return false;
								}
							}
							// Coincide con Madrid ciudad
						} else {
							return false;
						}
					} else if (
						locationFilter === 'comunidad de madrid y resto de españa'
					) {
						// Para comunidad de madrid, aceptar propiedades que no mencionan "madrid ciudad"
						if (
							lowerDesc.includes('madrid ciudad') ||
							(lowerDesc.includes('madrid') && !lowerDesc.includes('comunidad'))
						) {
							return false;
						}
					} else {
						// Para otras ubicaciones específicas, buscar en la descripción
						if (!lowerDesc.includes(locationFilter)) {
							return false;
						}
					}
				} else {
					// Hay datos de ubicación, usar la lógica normal
					if (locationFilter === 'madrid ciudad') {
						if (
							!isInMadrid({
								address: { latitude: lat, longitude: lon },
								municipality
							})
						) {
							return false;
						}

						if (localFilters.district && localFilters.district !== '') {
							const propertyDistrict =
								getDistrictFromCoordinates(lat, lon) || district;

							if (
								!propertyDistrict ||
								propertyDistrict.toLowerCase() !==
									localFilters.district.toLowerCase()
							) {
								return false;
							}
						}
					} else if (
						locationFilter === 'comunidad de madrid y resto de españa'
					) {
						if (
							isInMadrid({
								address: { latitude: lat, longitude: lon },
								municipality
							})
						) {
							return false;
						}

						if (localFilters.municipality && localFilters.municipality !== '') {
							if (
								municipality?.toLowerCase() !==
								localFilters.municipality.toLowerCase()
							) {
								return false;
							}
						}
					} else {
						// Para otras ubicaciones (Costa Española, Florida), buscar coincidencia
						const address =
							(typeof property.address === 'string'
								? property.address
								: property.address?.streetName
							)?.toLowerCase() || '';

						if (
							!address.includes(locationFilter) &&
							!(district && district.toLowerCase().includes(locationFilter)) &&
							!(
								municipality &&
								municipality.toLowerCase().includes(locationFilter)
							)
						) {
							return false;
						}
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
			// Soportar ambos formatos (API: operation.price, FTP: price directo)
			const price = property.price || property.operation?.price || 0;
			if (price < parseInt(localFilters.minPrice)) {
				return false;
			}
		}

		// Filtro por precio máximo
		if (localFilters.maxPrice && localFilters.maxPrice !== '') {
			// Soportar ambos formatos (API: operation.price, FTP: price directo)
			const price = property.price || property.operation?.price || 0;
			if (price > parseInt(localFilters.maxPrice)) {
				return false;
			}
		}

		// Filtro por área mínima
		if (localFilters.minArea && localFilters.minArea !== '') {
			// Soportar ambos formatos (API: features.areaConstructed, FTP: size directo)
			const area =
				property.size ||
				property.features?.areaConstructed ||
				property.features?.builtArea ||
				0;
			if (area < parseInt(localFilters.minArea)) {
				return false;
			}
		}

		// Filtro por área máxima
		if (localFilters.maxArea && localFilters.maxArea !== '') {
			// Soportar ambos formatos (API: features.areaConstructed, FTP: size directo)
			const area =
				property.size ||
				property.features?.areaConstructed ||
				property.features?.builtArea ||
				0;
			if (area > parseInt(localFilters.maxArea)) {
				return false;
			}
		}

		// Filtro por tipo de propiedad
		if (localFilters.propertyType && localFilters.propertyType !== '') {
			if (property.propertyType !== localFilters.propertyType) {
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

		// Para propiedades de Idealista, usar hasta el primer punto de la descripción
		const description =
			property.descriptions?.find(d => d.language === 'es')?.comment ||
			property.descriptions?.find(d => d.language === 'es')?.text ||
			property.descriptions?.[0]?.comment ||
			property.descriptions?.[0]?.text ||
			'';

		if (description) {
			// Obtener el texto hasta el primer punto
			const firstSentence = description.trim().split('.')[0];

			// Retornar la primera frase (sin el punto)
			return firstSentence.trim();
		}

		// Fallback al título genérico si no hay descripción
		return getPropertyTitle(property);
	};

	// Función para obtener el tamaño de la propiedad
	const getPropertySizeUnified = property => {
		if (property.source === 'contentful') {
			return property.size;
		}
		return property.size || property.features?.areaConstructed || property.features?.builtArea;
	};

	// Función para obtener el número de habitaciones
	const getRoomsUnified = property => {
		if (property.source === 'contentful') {
			return property.rooms;
		}
		return property.rooms || property.features?.rooms;
	};

	// Función para obtener el número de baños
	const getBathroomsUnified = property => {
		if (property.source === 'contentful') {
			return property.bathrooms;
		}
		return property.bathrooms || property.features?.bathroomNumber;
	};

	// Función para obtener etiquetas legibles de tipos de propiedad
	const getPropertyTypeLabel = type => {
		const labels = {
			flat: 'Piso',
			house: 'Casa / Chalet',
			penthouse: 'Ático',
			duplex: 'Dúplex',
			studio: 'Estudio',
			loft: 'Loft',
			office: 'Oficina',
			premise: 'Local',
			garage: 'Garaje',
			storage: 'Trastero',
			land: 'Terreno',
			building: 'Edificio',
			'country-house': 'Casa de campo'
		};
		return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
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
									{/* Filtro de tipo de propiedad */}
									{availablePropertyTypes.length > 1 && (
										<FilterGroup>
											<FilterLabel>Tipo de propiedad</FilterLabel>
											<FilterSelect
												value={localFilters.propertyType}
												onChange={e =>
													handleFilterChange('propertyType', e.target.value)
												}
											>
												<option value=''>Todos los tipos</option>
												{availablePropertyTypes.map(type => (
													<option key={type} value={type}>
														{getPropertyTypeLabel(type)}
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
												if (propertyId && !loadedImages.has(propertyId)) {
													loadPropertyImage(propertyId);
												} // Determinar la imagen a mostrar
												let imageSrc;
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
													imageSrc =
														getPropertyMainImage(propertyId) ||
														'/images/home-image-1.png';
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
														>
															{/* Mostrar loader mientras no esté cargada la imagen de Idealista */}
															{property.source !== 'contentful' &&
															!loadedImages.has(propertyId) ? (
																<ImageLoader />
															) : (
																<PropertyImage
																	src={imageSrc}
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
																			// Soportar tanto 'text' (Contentful) como 'comment' (Idealista FTP)
																			const description = esDesc
																				? esDesc.text || esDesc.comment
																				: property.descriptions[0].text ||
																				  property.descriptions[0].comment;
																			// Limitar a 150 caracteres
																			return description &&
																				description.length > 150
																				? description.substring(0, 150) + '...'
																				: description ||
																						'Propiedad en alquiler en excelente zona.';
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
