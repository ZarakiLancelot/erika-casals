// Utilidad para formatear direcciones según la visibilidad

/**
 * Formatea la dirección de una propiedad según su nivel de visibilidad
 * @param {Object} address - Objeto address de la propiedad
 * @returns {string} - Dirección formateada según la visibilidad
 */
export const formatAddressByVisibility = address => {
	if (!address) return '';

	const { streetName, streetNumber, visibility } = address;

	switch (visibility) {
		case 'full':
			// Mostrar calle y número
			return streetName && streetNumber
				? `${streetName}, ${streetNumber}`
				: streetName || '';

		case 'street':
			// Mostrar solo la calle
			return streetName || '';

		case 'hidden':
			// No mostrar ni calle ni número
			return '';

		default:
			// Por defecto, comportamiento como 'street'
			return streetName || '';
	}
};

/**
 * Obtiene la dirección completa incluyendo la ciudad
 * @param {Object} address - Objeto address de la propiedad
 * @returns {string} - Dirección completa formateada
 */
export const getFullFormattedAddress = address => {
	if (!address) return '';

	const streetInfo = formatAddressByVisibility(address);
	const town = address.town || '';

	if (streetInfo && town) {
		return `${streetInfo}, ${town}`;
	} else if (town) {
		return town;
	} else if (streetInfo) {
		return streetInfo;
	}

	return '';
};

/**
 * Verifica si se debe mostrar información de la dirección
 * @param {Object} address - Objeto address de la propiedad
 * @returns {boolean} - true si se debe mostrar alguna información de dirección
 */
export const shouldShowAddress = address => {
	if (!address) return false;

	return (
		address.visibility !== 'hidden' && (address.streetName || address.town)
	);
};
