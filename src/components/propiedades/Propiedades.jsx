import {
	StyledContainer,
	StyledContent,
	StyledFlexContainer,
	StyledTitle,
	StyledContentContainer,
	StyledContentDiv,
	StyledImageDiv,
	StyledPropertyDiv,
	StyledPropertyText,
	StyledViewButton
} from './styles';

const Propiedades = ({ reverse = false }) => {
	const propertyDataOptions = {
		1: {
			id: 1,
			text: (
				<>
					<b>Tu próxima inversión… o tu nuevo hogar</b>.
					<br />
					<br />
					Vender una propiedad con éxito va mucho más allá de publicarla en
					internet. Requiere estrategia, experiencia y una presentación
					impecable.
					<br />
					Yo me encargo de filtrar los compradores, destacar el valor real de tu
					vivienda y ayudarte a cerrar una venta segura y rentable, sin
					complicaciones.
					<br />
					<br />✅ Quieres vender tu casa sin perder tiempo con visitas
					improductivas.
					<br />
					<br />✅ Buscas un asesoramiento claro y honesto para fijar el precio
					adecuado.
					<br />
					<br />✅ Necesitas que te acompañen en todos los trámites legales y
					notariales.
				</>
			),
			propertyName: 'Propiedades Premium',
			propertyLocation: 'Ubicaciones Exclusivas',
			avatar: '/images/review-photo.png'
		},
		2: {
			id: 2,
			text: (
				<>
					<b>Alquila con seguridad, vive con libertad.</b>
					<br />
					<br />
					El alquiler no tiene por qué ser temporal ni impersonal.
					<br />
					<br />
					Te ayudo a encontrar alquileres que te den estabilidad, comodidad y
					las condiciones adecuadas para sentirte bien desde el primer día.
					<br />
					<b>Ofrezco alquileres…</b>
					<br />
					<br />✔ En zonas seleccionadas por su calidad de vida
					<br />
					<br />✔ Con contratos claros y garantías
					<br />
					<br />✅ Para estancias medias y largas
				</>
			),
			propertyName: 'Servicios de Compra',
			propertyLocation: 'Asesoramiento Personalizado',
			avatar: '/images/review-photo.png'
		}
	};

	const propertyData = propertyDataOptions[reverse ? 2 : 1];

	return (
		<StyledContainer>
			{' '}
			<StyledContent>
				<StyledTitle>
					Propiedades en{' '}
					<span style={{ textDecoration: 'underline' }}>
						{reverse ? 'alquiler' : 'venta'}
					</span>
				</StyledTitle>
				<StyledFlexContainer>
					<StyledContentContainer>
						<StyledContentDiv reverse={reverse}>
							<StyledPropertyDiv reverse={reverse}>
								<StyledPropertyText style={{ width: '90%' }}>
									{propertyData.text}
								</StyledPropertyText>
							</StyledPropertyDiv>
							<StyledImageDiv reverse={reverse}>
								<img src='/images/review-photo.png' alt='Property showcase' />
								<StyledViewButton>Ver Propiedades</StyledViewButton>
							</StyledImageDiv>
						</StyledContentDiv>
					</StyledContentContainer>
				</StyledFlexContainer>
			</StyledContent>
		</StyledContainer>
	);
};

export default Propiedades;
