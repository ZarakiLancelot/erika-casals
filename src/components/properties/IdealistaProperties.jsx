import { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useIdealistaProperties } from '../../hooks/useIdealistaProperties';
import {
	useContentfulSaleProperties,
	useNewDevelopments
} from '../../hooks/useContentfulProperties';
import PageTransition from '../common/PageTransition';
import ScrollAnimation from '../common/ScrollAnimation';
import NewDevelopmentCard from './NewDevelopmentCard';
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

const Properties = () => {
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
	// Hook para obtener propiedades de Contentful
	const {
		properties: contentfulProperties,
		loading: contentfulLoading,
		error: contentfulError
	} = useContentfulSaleProperties();

	const {
		newDevelopments,
		loading: newDevelopmentsLoading,
		error: newDevelopmentsError,
		fetchNewDevelopments
	} = useNewDevelopments();

	// Estados para filtros locales
	const [localFilters, setLocalFilters] = useState({
		location: '',
		district: '', // Filtro para distritos de Madrid ciudad
		municipality: '', // Nuevo filtro para municipios de Comunidad de Madrid
		minPrice: '',
		maxPrice: '',
		minArea: '',
		maxArea: '',
		features: '',
		lowestPrice: false, // Filtro para precio más bajo
		highestPrice: false // Filtro para precio más alto
	});
	const [loadedImages, setLoadedImages] = useState(new Set());
	const [loadingImages, setLoadingImages] = useState(new Set());
	const [availableLocations, setAvailableLocations] = useState([]);
	const [availableDistricts, setAvailableDistricts] = useState([]); // Distritos para Madrid ciudad
	const [availableMunicipalities, setAvailableMunicipalities] = useState([]); // Municipios para Comunidad de Madrid
	const [newDev, setNewDev] = useState([]);
	// Establecer filtro a 'sale' al montar el componente y limpiar filtros locales
	useEffect(() => {
		setFilter('sale');

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
			features: '',
			lowestPrice: false,
			highestPrice: false
		}); // Limpiar imágenes cargadas para evitar conflictos
		setLoadedImages(new Set());
		setLoadingImages(new Set());
	}, [setFilter, location.pathname, searchParams]); // Agregar searchParams como dependencia

	// Cargar nuevos desarrollos al montar el componente
	useEffect(() => {
		fetchNewDevelopments();
	}, [fetchNewDevelopments]);

	useEffect(() => {
		if (!newDevelopmentsLoading) {
			setNewDev(newDevelopments);
		}
	}, [newDevelopments, newDevelopmentsLoading]);

	// Función para cargar imagen de una propiedad cuando sea necesario
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
		const allProps = [
			...properties,
			...contentfulProperties,
			...newDevelopments
		];
		if (allProps.length > 0) {
			// Usar el nuevo sistema de organización de ubicaciones
			const organized = getOrganizedLocations(
				properties,
				contentfulProperties,
				newDev
			);

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
	}, [
		properties,
		contentfulProperties,
		newDevelopments,
		localFilters.location
	]);

	// Función para verificar si una propiedad tiene una característica específica
	const hasFeature = (property, searchTerm) => {
		const term = searchTerm.toLowerCase();

		// Para newDevelopments, buscar en la descripción, título, ubicación y features
		if (property.source === 'newDevelopments') {
			const description = property.description?.toLowerCase() || '';
			const title = property.title?.toLowerCase() || '';
			const location = property.location?.toLowerCase() || '';

			// Buscar en el array de features si existe
			const featuresMatch =
				property.features && Array.isArray(property.features)
					? property.features.some(feature =>
							feature.toLowerCase().includes(term)
					  )
					: false;

			return (
				description.includes(term) ||
				title.includes(term) ||
				location.includes(term) ||
				featuresMatch
			);
		}

		// Búsqueda por características específicas para Idealista
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
			(typeof property.address === 'string' ? property.address : property.address?.streetName)?.toLowerCase() || '';
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
		...contentfulProperties,
		...newDevelopments
	];

	// Filtrar propiedades localmente según los filtros adicionales
	const filteredProperties = allProperties.filter(property => {
		// Filtro por ubicación principal
		if (localFilters.location && localFilters.location !== '') {
			const locationFilter = localFilters.location.toLowerCase();

			// Para propiedades de Idealista del FTP
			if (property.propertyId && property.source !== 'newDevelopments') {
				// Soportar ambos formatos (API y FTP)
				const lat = property.latitude || property.address?.latitude;
				const lon = property.longitude || property.address?.longitude;
				const municipality = property.municipality || property.address?.town;
				const district = property.district || property.address?.district;
				
				// Si no hay datos de ubicación (dirección oculta), buscar en la descripción
				if ((!municipality || municipality === '') && (!district || district === '') && !lat && !lon) {
					const description = 
						property.descriptions?.find(d => d.language === 'es')?.comment ||
						property.descriptions?.find(d => d.language === 'es')?.text || 
						'';
					const lowerDesc = description.toLowerCase();
					
					if (locationFilter === 'madrid ciudad') {
						// Buscar menciones de "madrid" pero no "comunidad de madrid"
						if (lowerDesc.includes('madrid') && !lowerDesc.includes('comunidad de madrid')) {
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
					} else if (locationFilter === 'comunidad de madrid y resto de españa') {
						// Para comunidad de madrid, aceptar propiedades que no mencionan "madrid ciudad"
						// o que mencionan "comunidad de madrid" explícitamente
						if (lowerDesc.includes('madrid ciudad') || 
						    (lowerDesc.includes('madrid') && !lowerDesc.includes('comunidad'))) {
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
						if (!isInMadrid({ address: { latitude: lat, longitude: lon }, municipality })) {
							return false;
						}

						if (localFilters.district && localFilters.district !== '') {
							const propertyDistrict =
								getDistrictFromCoordinates(lat, lon) ||
								district;

							if (
								!propertyDistrict ||
								propertyDistrict.toLowerCase() !==
									localFilters.district.toLowerCase()
							) {
								return false;
							}
						}
					} else if (locationFilter === 'comunidad de madrid y resto de españa') {
						if (isInMadrid({ address: { latitude: lat, longitude: lon }, municipality })) {
							return false;
						}

						if (localFilters.municipality && localFilters.municipality !== '') {
							if (municipality?.toLowerCase() !== localFilters.municipality.toLowerCase()) {
								return false;
							}
						}
					} else {
						// Para otras ubicaciones (Costa Española, Florida), buscar coincidencia
						const address = 
							(typeof property.address === 'string' ? property.address : property.address?.streetName)?.toLowerCase() || '';

						if (
							!address.includes(locationFilter) &&
							!(district && district.toLowerCase().includes(locationFilter)) &&
							!(municipality && municipality.toLowerCase().includes(locationFilter))
						) {
							return false;
						}
					}
				}
			}
			if (property.source === 'newDevelopments') {
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
			// // Para propiedades de Contentful
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

		if (localFilters.minPrice && localFilters.minPrice !== '') {
			// Soportar ambos formatos (API: operation.price, FTP: price directo)
			const price =
				property.price ||
				property.operation?.price || 
				property.minPrice || 
				0;
			if (price < parseInt(localFilters.minPrice)) {
				return false;
			}
		}
		// Filtro por precio máximo
		if (localFilters.maxPrice && localFilters.maxPrice !== '') {
			// Soportar ambos formatos (API: operation.price, FTP: price directo)
			const price =
				property.price ||
				property.operation?.price || 
				property.maxPrice || 
				0;
			if (price > parseInt(localFilters.maxPrice)) {
				return false;
			}
		}
		// Filtro por área mínima
		if (localFilters.minArea && localFilters.minArea !== '') {
			let area = 0;
			if (property.source === 'newDevelopments') {
				// Para newDevelopments, usar minSize como área mínima
				area = property.minSize || property.size || 0;
			} else {
				// Para otras fuentes (Idealista, Contentful)
				// Soportar ambos formatos (API: features.areaConstructed, FTP: size directo)
				area =
					property.size ||
					property.features?.areaConstructed ||
					property.features?.builtArea ||
					0;
			}
			if (area < parseInt(localFilters.minArea)) {
				return false;
			}
		}

		// Filtro por área máxima
		if (localFilters.maxArea && localFilters.maxArea !== '') {
			let area = 0;
			if (property.source === 'newDevelopments') {
				// Para newDevelopments, usar maxSize como área máxima
				area = property.maxSize || property.size || 0;
			} else {
				// Para otras fuentes (Idealista, Contentful)
				// Soportar ambos formatos (API: features.areaConstructed, FTP: size directo)
				area =
					property.size ||
					property.features?.areaConstructed ||
					property.features?.builtArea ||
					0;
			}
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

	// Aplicar filtros de precio más bajo/alto después del filtrado inicial
	let sortedFilteredProperties = [...filteredProperties];

	// Si se selecciona precio más bajo, ordenar por precio ascendente y tomar los primeros
	if (localFilters.lowestPrice) {
		sortedFilteredProperties = sortedFilteredProperties.sort((a, b) => {
			// Soportar ambos formatos (API: operation.price, FTP: price directo)
			const priceA = a.price || a.operation?.price || a.minPrice || 0;
			const priceB = b.price || b.operation?.price || b.minPrice || 0;
			return priceA - priceB;
		});
	}

	// Si se selecciona precio más alto, ordenar por precio descendente y tomar los primeros
	if (localFilters.highestPrice) {
		sortedFilteredProperties = sortedFilteredProperties.sort((a, b) => {
			// Soportar ambos formatos (API: operation.price, FTP: price directo)
			const priceA = a.price || a.operation?.price || a.minPrice || 0;
			const priceB = b.price || b.operation?.price || b.minPrice || 0;
			return priceB - priceA;
		});
	}

	// Usar las propiedades filtradas y ordenadas
	const finalFilteredProperties = sortedFilteredProperties;

	// Función para obtener el título correcto de la propiedad (Idealista o Contentful)
	const getPropertyTitleUnified = property => {
		if (
			property.source === 'contentful' ||
			property.source === 'newDevelopments'
		) {
			return property.title || 'Propiedad exclusiva';
		}
		return getPropertyTitle(property);
	};

	// Función para obtener el tamaño de la propiedad
	const getPropertySizeUnified = property => {
		if (
			property.source === 'contentful' ||
			property.source === 'newDevelopments'
		) {
			return property.size;
		}
		return property.features?.areaConstructed || property.features?.builtArea;
	};

	// Función para obtener el número de habitaciones
	const getRoomsUnified = property => {
		if (
			property.source === 'contentful' ||
			property.source === 'newDevelopments'
		) {
			return property.rooms;
		}
		return property.features?.rooms;
	};

	// Función para obtener el número de baños
	const getBathroomsUnified = property => {
		if (
			property.source === 'contentful' ||
			property.source === 'newDevelopments'
		) {
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

			// Lógica para checkboxes de precio: solo uno puede estar activo
			if (filterName === 'lowestPrice' && value) {
				newFilters.highestPrice = false;
			} else if (filterName === 'highestPrice' && value) {
				newFilters.lowestPrice = false;
			}

			return newFilters;
		});
	};

	const handlePropertyClick = property => {
		// Usar solo el ID sin prefijo
		const propertyId =
			property.source === 'contentful' || property.source === 'newDevelopments'
				? property.id
				: property.propertyId;

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
								'--header-bg-image': 'url(/images/en-venta-page.png)'
							}}
						>
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
										{/* Checkboxes para filtros de precio */}
										<div
											style={{
												display: 'flex',
												gap: '20px',
												marginTop: '20px'
											}}
										>
											<label
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '5px',
													fontSize: '14px',
													color: '#666'
												}}
											>
												<input
													type='checkbox'
													checked={localFilters.lowestPrice}
													onChange={e =>
														handleFilterChange('lowestPrice', e.target.checked)
													}
													style={{ marginRight: '5px' }}
												/>
												Precio más bajo
											</label>
											<label
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '5px',
													fontSize: '14px',
													color: '#666'
												}}
											>
												<input
													type='checkbox'
													checked={localFilters.highestPrice}
													onChange={e =>
														handleFilterChange('highestPrice', e.target.checked)
													}
													style={{ marginRight: '5px' }}
												/>
												Precio más alto
											</label>
										</div>
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
											: `${finalFilteredProperties.length} ${
													finalFilteredProperties.length === 1
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
									finalFilteredProperties.length === 0 && (
										<EmptyState>
											<h3>No se encontraron propiedades</h3>
											<p>Intenta ajustar los filtros o verifica la conexión</p>
										</EmptyState>
									)}{' '}
								{!(loading || contentfulLoading) &&
									!(error || contentfulError) &&
									finalFilteredProperties.length > 0 && (
										<PropertiesGrid>
											{' '}
											{finalFilteredProperties.map((property, index) => {
												if (property.source === 'newDevelopments') {
													return (
														<NewDevelopmentCard
															key={property.id || index}
															property={property}
															index={index}
															onClick={handlePropertyClick}
														/>
													);
												}
												// Para propiedades de Idealista
												const propertyId = property.propertyId;

												// Cargar imagen si es de Idealista y no está cargada
												if (propertyId && !loadedImages.has(propertyId)) {
													loadPropertyImage(propertyId);
												}

												// Determinar la imagen a mostrar
												let imageSrc = '/images/home-image-1.png'; // fallback
												if (
													property.source === 'contentful' ||
													property.source === 'newDevelopments'
												) {
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
															{/* Mostrar loader mientras no esté cargada la imagen de Idealista */}
															{property.source !== 'contentful' &&
															property.source !== 'newDevelopments' &&
															!loadedImages.has(propertyId) ? (
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
																	{property.source === 'contentful' ||
																	property.source === 'newDevelopments'
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
																			// Soportar tanto 'text' (Contentful) como 'comment' (Idealista FTP)
																			const description = esDesc
																				? (esDesc.text || esDesc.comment)
																				: (property.descriptions[0].text || property.descriptions[0].comment);
																			// Limitar a 150 caracteres
																			return description && description.length > 150
																				? description.substring(0, 150) + '...'
																				: (description || 'Excelente propiedad en una ubicación privilegiada.');
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
					</ContentWrapper>
				</PropertiesContainer>
				<Footer />
			</PageTransition>
		</div>
	);
};

export default Properties;
