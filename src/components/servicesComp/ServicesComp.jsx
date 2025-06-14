import {
	StyledContainer,
	StyledContent,
	StyledDescription,
	StyledGridContainer,
	StyledServiceButton,
	StyledServiceCard,
	StyledServiceDescription,
	StyledServiceIcon,
	StyledServiceTitle,
	StyledTitle
} from './styles';

const ServicesComp = () => {
	return (
		<StyledContainer>
			<StyledContent>
				<StyledTitle>Servicios</StyledTitle>
				<StyledDescription>
					Te ayudo a vender y alquilar con total confianza, tanto en España como
					en Miami. Propiedades seleccionadas, atención personalizada y
					acompañamiento en cada paso.
				</StyledDescription>
				<StyledGridContainer>
					<StyledServiceCard>
						<StyledServiceIcon src='/images/en-venta.png' alt='En venta' />
						<StyledServiceTitle>En venta</StyledServiceTitle>
						<StyledServiceDescription>
							Propiedades exclusivas listas para entrar a vivir o invertir con
							rentabilidad.
						</StyledServiceDescription>
						<StyledServiceButton href='https://erikacasals.com/venta'>
							Ver proyectos
						</StyledServiceButton>
					</StyledServiceCard>
					<StyledServiceCard>
						<StyledServiceIcon
							src='/images/en-alquiler.png'
							alt='En alquiler'
						/>
						<StyledServiceTitle>En alquiler</StyledServiceTitle>
						<StyledServiceDescription>
							Propiedades exclusivas listas para entrar a vivir o invertir con
							rentabilidad.
						</StyledServiceDescription>
						<StyledServiceButton href='https://erikacasals.com/venta'>
							Ver proyectos
						</StyledServiceButton>
					</StyledServiceCard>
					<StyledServiceCard>
						<StyledServiceIcon src='/images/miami.png' alt='Miami' />
						<StyledServiceTitle>Miami</StyledServiceTitle>
						<StyledServiceDescription>
							Vivir en Miami es una declaración de estilo de vida. Te muestro
							las zonas que realmente valen la pena.
						</StyledServiceDescription>
						<StyledServiceButton href='https://erikacasals.com/venta'>
							Ver proyectos
						</StyledServiceButton>
					</StyledServiceCard>
					<StyledServiceCard>
						<StyledServiceIcon
							src='/images/costa-espanola.png'
							alt='Costa Española'
						/>
						<StyledServiceTitle>Costa Española</StyledServiceTitle>
						<StyledServiceDescription>
							A orillas del Mediterráneo hay más que sol: hay hogares con alma.
						</StyledServiceDescription>
						<StyledServiceButton href='https://erikacasals.com/venta'>
							Ver proyectos
						</StyledServiceButton>
					</StyledServiceCard>
				</StyledGridContainer>
			</StyledContent>
		</StyledContainer>
	);
};

export default ServicesComp;
