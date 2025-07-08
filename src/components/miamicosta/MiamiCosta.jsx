import { Link } from 'react-router-dom';
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

const MiamiCosta = () => {
	return (
		<StyledContainer>
			<StyledContent>
				{/* Sección Miami */}
				<StyledSection>
					<StyledSectionTitle>Miami</StyledSectionTitle>
					<StyledDescription>
						Vivir o invertir en Miami no es solo una decisión inmobiliaria, es
						una apuesta por un estilo de vida dinámico, internacional y con un
						mercado en constante crecimiento. Te mostraré las{' '}
						<b>zonas que realmente valen la pena,</b> más allá de lo que aparece
						en los portales. Además, te acompaño en todo el proceso si vienes
						desde el extranjero: trámites, contratos, visitas y más.
					</StyledDescription>
					<StyledImageContainer>
						<StyledImage
							src='/images/costa-espanola.png'
							alt='Miami Properties'
						/>
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
							<Link to='/sales?location=Miami'>
								<StyledViewButton
									style={{ position: 'static', transform: 'none' }}
								>
									En venta
								</StyledViewButton>
							</Link>
							<Link to='/rent?location=Miami'>
								<StyledViewButton
									style={{ position: 'static', transform: 'none' }}
								>
									En alquiler
								</StyledViewButton>
							</Link>
						</div>
					</StyledImageContainer>
				</StyledSection>

				{/* Sección Costa Española */}
				<StyledSection>
					<StyledSectionTitle>Costa Española</StyledSectionTitle>
					<StyledDescription>
						Las costas del Mediterráneo no solo ofrecen sol, mar y relax.
						También son una oportunidad perfecta para encontrar calidad de vida,
						descanso o inversión. Trabajo con propiedades en zonas estratégicas
						de la **Costa Blanca, Costa del Sol y otras ubicaciones con alta
						demanda y calidad de vida.**
					</StyledDescription>
					<StyledImageContainer>
						<StyledImage
							src='/images/en-alquiler.png'
							alt='Costa Española Properties'
						/>
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
							<Link to='/sales?location=Costa Española'>
								<StyledViewButton
									style={{ position: 'static', transform: 'none' }}
								>
									En venta
								</StyledViewButton>
							</Link>
							<Link to='/rent?location=Costa Española'>
								<StyledViewButton
									style={{ position: 'static', transform: 'none' }}
								>
									En alquiler
								</StyledViewButton>
							</Link>
						</div>
					</StyledImageContainer>
				</StyledSection>
			</StyledContent>
		</StyledContainer>
	);
};

export default MiamiCosta;
