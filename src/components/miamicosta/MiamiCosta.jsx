import { Link } from 'react-router-dom';
import { useContentfulProperties } from '../../hooks/useContentfulProperties';
import {
	StyledContainer,
	StyledContent,
	StyledSection,
	StyledSectionTitle,
	StyledImageContainer,
	StyledImage,
	StyledViewButton,
	StyledDescription
} from './styles';

const LOCATIONS = [
	{
		key: 'Florida',
		zone: 'Florida',
		title: 'Florida',
		image: '/images/en-alquiler.png',
		alt: 'Florida Properties',
		saleLink: '/sales?location=Florida',
		rentLink: '/rent?location=Florida',
		description: (
			<>
				Vivir o invertir en Florida no es solo una decisión inmobiliaria, es una
				apuesta por un estilo de vida dinámico, internacional y con un mercado en
				constante crecimiento. Te mostraré las{' '}
				<b>zonas que realmente valen la pena,</b> más allá de lo que aparece en
				los portales. Además, te acompaño en todo el proceso si vienes desde el
				extranjero: trámites, contratos, visitas y más.
			</>
		)
	},
	{
		key: 'Costa',
		zone: 'Costa',
		title: 'Costa Española',
		image: '/images/costa-espanola.png',
		alt: 'Costa Española Properties',
		saleLink: '/sales?location=Costa Española',
		rentLink: '/rent?location=Costa Española',
		description: (
			<>
				Las costas del Mediterráneo no solo ofrecen sol, mar y relax. También son
				una oportunidad perfecta para encontrar calidad de vida, descanso o
				inversión. Trabajo con propiedades en zonas estratégicas de la{' '}
				<b>
					Costa Blanca, Costa del Sol y otras ubicaciones con alta demanda y
					calidad de vida.
				</b>
			</>
		)
	}
];

const MiamiCosta = () => {
	const { properties } = useContentfulProperties();

	return (
		<StyledContainer>
			<StyledContent>
				{LOCATIONS.map(loc => {
					const hasSale = properties.some(
						p => p.propertyZone === loc.zone && p.type === 'En venta'
					);
					const hasRent = properties.some(
						p => p.propertyZone === loc.zone && p.type === 'En alquiler'
					);

					return (
						<StyledSection key={loc.key}>
							<StyledSectionTitle>{loc.title}</StyledSectionTitle>
							<StyledDescription>{loc.description}</StyledDescription>
							<StyledImageContainer>
								<StyledImage src={loc.image} alt={loc.alt} />
								{(hasSale || hasRent) && (
									<div
										style={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											display: 'flex',
											gap: '15px',
											flexWrap: 'wrap',
											justifyContent: 'center',
											zIndex: 3
										}}
									>
										{hasSale && (
											<Link to={loc.saleLink}>
												<StyledViewButton
													style={{ position: 'static', transform: 'none' }}
												>
													En venta
												</StyledViewButton>
											</Link>
										)}
										{hasRent && (
											<Link to={loc.rentLink}>
												<StyledViewButton
													style={{ position: 'static', transform: 'none' }}
												>
													En alquiler
												</StyledViewButton>
											</Link>
										)}
									</div>
								)}
							</StyledImageContainer>
						</StyledSection>
					);
				})}
			</StyledContent>
		</StyledContainer>
	);
};

export default MiamiCosta;
