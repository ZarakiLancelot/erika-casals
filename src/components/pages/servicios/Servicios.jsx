import {
	StyledButton,
	StyledContainer,
	StyledContent,
	StyledDescription,
	StyledFlexContainer,
	StyledImage,
	StyledTitle
} from '../home/styles';
import Footer from '../../footer/Footer';
import Propiedades from '../../propiedades/Propiedades';
import MiamiCosta from '../../miamicosta/MiamiCosta';
import Booking from '../../booking/Booking';
import PageTransition from '../../common/PageTransition';
import ScrollAnimation from '../../common/ScrollAnimation';
import ResponsiveNavbar from '../../common/ResponsiveNavbar';

const Servicios = () => {
	return (
		<div>
			<ResponsiveNavbar />
			<PageTransition>
				<StyledContainer>
					<StyledContent>
						<StyledFlexContainer>
							<StyledImage
								src='/images/services-group-1.png'
								alt='Service Image 1'
							/>
						</StyledFlexContainer>
						<StyledFlexContainer>
							<StyledTitle>
								Dime qué estás buscando… y te mostraré el camino más directo
								para encontrarlo.
							</StyledTitle>
							<StyledDescription>
								Cada cliente es diferente. Algunos buscan una inversión
								rentable, otros una segunda residencia, y otros simplemente
								quieren empezar una nueva etapa con total tranquilidad. Por eso
								mis servicios se adaptan a ti, no al revés.
							</StyledDescription>
							<StyledButton
								as='a'
								href='https://wa.me/34655981758'
								target='_blank'
								rel='noopener noreferrer'
							>
								Hablemos ahora por WhatsApp{' '}
								<img src='/icons/whatsapp-icon.png' alt='' />
							</StyledButton>
						</StyledFlexContainer>
						<StyledFlexContainer>
							<StyledImage
								src='/images/home-group-2.png'
								alt='Service Image 2'
							/>
						</StyledFlexContainer>
					</StyledContent>
				</StyledContainer>
				<ScrollAnimation delay={0.1} type='slideLeft'>
					<Propiedades reverse={false} />
				</ScrollAnimation>
				<ScrollAnimation delay={0.2} type='slideRight'>
					<Propiedades reverse={true} />
				</ScrollAnimation>
				<ScrollAnimation delay={0.3} type='scaleIn'>
					<MiamiCosta />
				</ScrollAnimation>
				<ScrollAnimation delay={0.4} type='fadeIn'>
					<Booking />
				</ScrollAnimation>
				<ScrollAnimation delay={0.5} type='slideUp'>
					<Footer />
				</ScrollAnimation>
			</PageTransition>
		</div>
	);
};

export default Servicios;
