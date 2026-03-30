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
	EmptyState,
	PaginationContainer,
	PaginationButton,
	PaginationInfo
} from './styles';
import Footer from '../footer/Footer';
import ResponsiveNavbar from '../common/ResponsiveNavbar';
import RangeSelect from './RangeSelect';

const PROPERTY_TYPE_MAP = {
	Piso: 'flat', Apartamento: 'flat', Estudio: 'studio', Loft: 'loft',
	'Ático': 'penthouse', Atico: 'penthouse',
	Casa: 'house', Chalet: 'house', 'Casa / Chalet': 'house', 'Villa / Chalet': 'house', Villa: 'house', Adosado: 'house',
	'Dúplex': 'duplex', Duplex: 'duplex',
	Local: 'premises', 'Local comercial': 'premises',
	Oficina: 'office', Garaje: 'garage', Trastero: 'storage',
	Terreno: 'land', 'Terreno urbano': 'land',
	Nave: 'warehouse', 'Nave industrial': 'warehouse',
	Edificio: 'building',
};
const normalizePropertyType = type => PROPERTY_TYPE_MAP[type] || type;
const formatRef = ref => { const s = ref.toLowerCase(); const last = s[s.length - 1]; return /[a-z]/.test(last) ? s.slice(0, -1) + last.toUpperCase() : s; };

const RENT_PRICE_PRESETS = [500, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000];
const AREA_PRESETS = [30, 40, 50, 60, 70, 80, 100, 120, 150, 200, 300];
const priceLabel = p => p.toLocaleString('es-ES') + ' €';
const areaLabel = p => p + ' m²';

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
		fetchPropertyImages,
		fetchPropertyDescription
	} = useIdealistaProperties();
	// Hook para obtener propiedades de Contentful (solo alquiler)
	const {
		properties: contentfulProperties,
		loading: contentfulLoading,
		error: contentfulError
	} = useContentfulRentProperties();

	const [localFilters, setLocalFilters] = useState({
		location: '',
		district: '',
		municipality: '',
		propertyType: '',
		minPrice: '',
		maxPrice: '',
		minArea: '',
		maxArea: '',
		features: ''
	});
	const clearFilters = () => setLocalFilters({
		location: '',
		district: '',
		municipality: '',
		propertyType: '',
		minPrice: '',
		maxPrice: '',
		minArea: '',
		maxArea: '',
		features: ''
	});
	const [loadedImages, setLoadedImages] = useState(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 12;
	const [descriptionCache, setDescriptionCache] = useState({});

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, [currentPage]);
	const [loadingImages, setLoadingImages] = useState(new Set());
	const [availableLocations, setAvailableLocations] = useState([]);
	const [availableDistricts, setAvailableDistricts] = useState([]);
	const [availableMunicipalities, setAvailableMunicipalities] = useState([]);
	const [availablePropertyTypes, setAvailablePropertyTypes] = useState([]);

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

		const locationParam = searchParams.get('location');

		setLocalFilters({
			location: locationParam || '',
			district: '',
			municipality: '',
			minPrice: '',
			maxPrice: '',
			minArea: '',
			maxArea: '',
			features: ''
		});
		setLoadedImages(new Set());
		setLoadingImages(new Set());
	}, [setFilter, location.pathname, searchParams]);

	useEffect(() => {
		const allProps = [...properties, ...contentfulProperties];
		if (allProps.length > 0) {
			const organized = getOrganizedLocations(properties, contentfulProperties);

			const mainLocations = [];

			if (
				organized.madridCiudad.districts.length > 0 ||
				organized.madridCiudad.otherLocations.length > 0
			) {
				mainLocations.push('Madrid');
			}

			if (organized.comunidadMadrid.municipalities.length > 0) {
				mainLocations.push('Comunidad de Madrid y resto de España');
			}

			if (organized.international['Costa Española'].length > 0) {
				mainLocations.push('Costa Española');
			}
			if (organized.international.Florida.length > 0) {
				mainLocations.push('Florida');
			}

			setAvailableLocations(mainLocations.sort());

			if (localFilters.location.toLowerCase() === 'madrid') {
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
					types.add(normalizePropertyType(property.propertyType));
				}
			});
			setAvailablePropertyTypes(Array.from(types).sort());
		}
	}, [properties, contentfulProperties]);

	// Función para verificar si una propiedad tiene una característica específica
	const hasFeature = (property, searchTerm) => {
		const term = searchTerm.toLowerCase();

		// Búsqueda por características específicas — si el flag está activo retorna true,
		// si no, cae al buscador de descripción como fallback
		if (term.includes('ascensor') || term.includes('elevador')) {
			if (property.features?.liftAvailable === true || property.features?.hasLift === true) return true;
		}

		if (
			term.includes('aire acondicionado') ||
			term.includes('aire') ||
			term.includes('ac')
		) {
			if (property.features?.conditionedAir === true || property.features?.hasAirConditioning === true) return true;
		}

		if (term.includes('terraza')) {
			if (property.features?.terrace === true || property.features?.hasTerrace === true) return true;
		}

		if (term.includes('balcon') || term.includes('balcón')) {
			if (property.features?.balcony === true || property.features?.hasBalcony === true) return true;
		}

		if (
			term.includes('garaje') ||
			term.includes('parking') ||
			term.includes('aparcamiento')
		) {
			if (property.features?.parkingAvailable === true) return true;
		}

		if (term.includes('piscina')) {
			if (property.features?.pool === true || property.features?.hasSwimmingPool === true) return true;
		}

		if (term.includes('jardin') || term.includes('jardín')) {
			if (property.features?.garden === true || property.features?.hasGarden === true) return true;
		}

		if (term.includes('trastero') || term.includes('storage')) {
			if (property.features?.storage === true) return true;
		}

		if (term.includes('armarios empotrados') || term.includes('armarios')) {
			if (property.features?.wardrobes === true || property.features?.hasWardrobe === true) return true;
		}

		if (term.includes('calefaccion') || term.includes('calefacción')) {
			if (property.features?.heatingType && property.features.heatingType !== 'none') return true;
			if (property.features?.hasHeating === true) return true;
		}

		if (term.includes('atico') || term.includes('ático')) {
			if (property.features?.penthouse === true) return true;
		}

		if (term.includes('duplex') || term.includes('dúplex')) {
			if (property.features?.duplex === true) return true;
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

					if (locationFilter === 'madrid') {
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
						// Para comunidad de madrid, aceptar propiedades que no mencionan "madrid"
						if (
							lowerDesc.includes('madrid') ||
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
					if (locationFilter === 'madrid') {
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

				if (locationFilter === 'madrid') {
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
			if (normalizePropertyType(property.propertyType) !== localFilters.propertyType) {
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
				if (value.toLowerCase() !== 'madrid') {
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

	// Paginación
	const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
	const paginatedProperties = filteredProperties.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	// Fetcha descripciones de la página actual desde accion=ficha (solo Inmovilla, solo las no cacheadas)
	useEffect(() => {
		const inmoPropiedades = paginatedProperties.filter(
			p => p.source === 'inmovilla' && p.propertyId && !descriptionCache[p.propertyId]
		);
		if (inmoPropiedades.length === 0) return;
		Promise.all(
			inmoPropiedades.map(p =>
				fetchPropertyDescription(p.propertyId).then(desc => ({ id: p.propertyId, desc }))
			)
		).then(results => {
			const newEntries = {};
			results.forEach(({ id, desc }) => { if (desc) newEntries[id] = desc; });
			if (Object.keys(newEntries).length > 0) {
				setDescriptionCache(prev => ({ ...prev, ...newEntries }));
			}
		});
	}, [paginatedProperties, fetchPropertyDescription]);

	const renderPagination = () => {
		const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
			.filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
			.reduce((acc, page, idx, arr) => {
				if (idx > 0 && page - arr[idx - 1] > 1) acc.push('...');
				acc.push(page);
				return acc;
			}, []);

		return (
			<PaginationContainer>
				<PaginationButton
					onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
					disabled={currentPage === 1}
				>
					← Anterior
				</PaginationButton>
				{pages.map((page, idx) =>
					page === '...' ? (
						<PaginationInfo key={`ellipsis-${idx}`}>…</PaginationInfo>
					) : (
						<PaginationButton
							key={page}
							$active={currentPage === page}
							onClick={() => setCurrentPage(page)}
						>
							{page}
						</PaginationButton>
					)
				)}
				<PaginationButton
					onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
					disabled={currentPage === totalPages}
				>
					Siguiente →
				</PaginationButton>
			</PaginationContainer>
		);
	};

	return (
		<div>
			<ResponsiveNavbar />
			<PageTransition type='properties'>
				<main>
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
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
									<FilterTitle style={{ marginBottom: 0 }}>Filtros de búsqueda</FilterTitle>
									<button
										onClick={clearFilters}
										style={{
											background: '#e8f0fe',
											border: '1.5px solid #4a6fa5',
											borderRadius: '8px',
											padding: '6px 14px',
											fontSize: '13px',
											fontWeight: '600',
											color: '#4a6fa5',
											cursor: 'pointer',
											whiteSpace: 'nowrap',
											display: 'flex',
											alignItems: 'center',
											gap: '5px',
											transition: 'all 0.2s ease',
										}}
										onMouseEnter={e => { e.currentTarget.style.background = '#4a6fa5'; e.currentTarget.style.color = '#fff'; }}
										onMouseLeave={e => { e.currentTarget.style.background = '#e8f0fe'; e.currentTarget.style.color = '#4a6fa5'; }}
									>
										✕ Limpiar filtros
									</button>
								</div>
									<FilterGroup>
										<FilterLabel htmlFor="filter-location">Localización</FilterLabel>
										{searchParams.get('location') ? (
											<FilterInput
												value={localFilters.location}
												readOnly
												style={{ cursor: 'default', background: '#f5f5f5' }}
											/>
										) : (
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
										)}
									</FilterGroup>
									{/* Mostrar filtro de distrito solo si Madrid ciudad está seleccionado */}
									{localFilters.location.toLowerCase() === 'madrid' &&
										availableDistricts.length > 0 && (
											<FilterGroup>
												<FilterLabel htmlFor="filter-district">Distrito de Madrid</FilterLabel>
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
												<FilterLabel htmlFor="filter-municipality">Municipio</FilterLabel>
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
											<FilterLabel htmlFor="filter-property-type">Tipo de propiedad</FilterLabel>
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
										<FilterLabel htmlFor="filter-price-min">Precio mensual</FilterLabel>
										<PriceRangeGroup>
											<RangeSelect
												presets={RENT_PRICE_PRESETS}
												value={localFilters.minPrice}
												onChange={v => handleFilterChange('minPrice', v)}
												placeholder='Precio mín €'
												aria-label='Precio mínimo'
												formatLabel={priceLabel}
											/>
											<PriceSeparator>—</PriceSeparator>
											<RangeSelect
												presets={RENT_PRICE_PRESETS}
												value={localFilters.maxPrice}
												onChange={v => handleFilterChange('maxPrice', v)}
												placeholder='Precio máx €'
												aria-label='Precio máximo'
												formatLabel={priceLabel}
											/>
										</PriceRangeGroup>
									</FilterGroup>
									<FilterGroup>
										<FilterLabel>Superficie (m²)</FilterLabel>
										<PriceRangeGroup>
											<RangeSelect
												presets={AREA_PRESETS}
												value={localFilters.minArea}
												onChange={v => handleFilterChange('minArea', v)}
												placeholder='m² min'
												aria-label='Superficie mínima'
												formatLabel={areaLabel}
											/>
											<PriceSeparator>—</PriceSeparator>
											<RangeSelect
												presets={AREA_PRESETS}
												value={localFilters.maxArea}
												onChange={v => handleFilterChange('maxArea', v)}
												placeholder='m² max'
												aria-label='Superficie máxima'
												formatLabel={areaLabel}
											/>
										</PriceRangeGroup>
									</FilterGroup>
									<FilterGroup>
										<FilterLabel htmlFor="filter-features">Características</FilterLabel>
										<FilterInput
											id="filter-features"
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
										<>
											<PropertiesGrid>
												{paginatedProperties.map((property, index) => {
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
																	loading="lazy"
																	width="400"
																	height="280"
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
																			: formatRef(property.reference || propertyId?.toString().slice(-4) || '1024')}
																	</span>
																</PropertyPrice>
																<PropertyDescription>
																	{(() => {
																		const raw = (
																			descriptionCache[property.propertyId] ||
																			property.description ||
																			property.descriptions?.find(d => d.language === 'es')?.text ||
																			property.descriptions?.[0]?.text ||
																			''
																		).replace(/<[^>]*>/g, '').replace(/~~/g, ' · ').trim();
																		return raw.length > 150 ? raw.substring(0, 150) + '...' : raw;
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
											{totalPages > 1 && renderPagination()}
										</>
									)}
							</PropertiesSection>
						</MainContainer>
					</ContentWrapper>
				</PropertiesContainer>
				</main>
				<Footer />
			</PageTransition>
		</div>
	);
};

export default PropertiesRent;
