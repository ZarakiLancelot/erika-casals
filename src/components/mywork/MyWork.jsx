import {
	StyledCard,
	StyledCardContainer,
	StyledCardDescription,
	StyledCardIcon,
	StyledCardTitle,
	StyledContainer,
	StyledContent,
	StyledTitle
} from './styles';

const MyWork = () => {
	return (
		<StyledContainer>
			<StyledContent>
				<StyledTitle>Cómo trabajo contigo</StyledTitle>
				<StyledCardContainer>
					<StyledCard>
						<StyledCardIcon
							src='/icons/card-icon-1.png'
							alt='Consultation Icon'
						/>
						<StyledCardTitle>Te escucho sin prisas</StyledCardTitle>
						<StyledCardDescription>
							Hablamos por WhatsApp o llamada y me cuentas tu situación: por qué
							vendes, qué esperas y qué necesitas. Sin presión. Solo claridad
							desde el primer minuto.
						</StyledCardDescription>
					</StyledCard>
					<StyledCard>
						<StyledCardIcon src='/icons/card-icon-2.png' alt='Billing Icon' />
						<StyledCardTitle>
							Preparo una venta pensada para tu propiedad
						</StyledCardTitle>
						<StyledCardDescription>
							Analizo el valor real, el perfil del comprador ideal y defino una
							estrategia que destaque tu casa en el mercado. Sin improvisar. Sin
							depender de portales.
						</StyledCardDescription>
					</StyledCard>
					<StyledCard>
						<StyledCardIcon src='/icons/card-icon-3.png' alt='Visitas Icon' />
						<StyledCardTitle>Estás guiada de principio a fin</StyledCardTitle>
						<StyledCardDescription>
							Visitas filtradas, papeleo, dudas legales, notaría… Estoy contigo
							en cada paso, para que no tengas que preocuparte por nada.
						</StyledCardDescription>
					</StyledCard>
				</StyledCardContainer>
			</StyledContent>
		</StyledContainer>
	);
};

export default MyWork;
