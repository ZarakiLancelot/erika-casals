import { Link } from 'react-router-dom';
import {
	StyledButton,
	StyledContainer,
	StyledContent,
	StyledDescription,
	StyledFlexContainer,
	StyledImage,
	StyledNavbar,
	StyledNavCenter,
	StyledNavLeft,
	StyledNavLi,
	StyledNavRight,
	StyledTitle
} from '../home/styles';
import Footer from '../../footer/Footer';
import Propiedades from '../../propiedades/Propiedades';
import MiamiCosta from '../../miamicosta/MiamiCosta';
import Booking from '../../booking/Booking';
import PageTransition from '../../common/PageTransition';
import ScrollAnimation from '../../common/ScrollAnimation';

const Servicios = () => {
	return (
		<StyledContainer>
			<StyledNavbar>
				<StyledNavLeft></StyledNavLeft>{' '}
				<StyledNavCenter>
					<StyledNavLi>
						<Link to='/'>Inicio</Link>
					</StyledNavLi>
					<StyledNavLi>
						<Link to='/servicios'>Servicios</Link>
					</StyledNavLi>
					<StyledNavLi>
						<Link to='/aboutme'>Sobre mí</Link>
					</StyledNavLi>
					<StyledNavLi>
						{' '}
						<Link to='/rent'>Alquiler</Link>
					</StyledNavLi>
					<StyledNavLi>
						<Link to='/sales'>Venta</Link>
					</StyledNavLi>
				</StyledNavCenter>
				<StyledNavRight>
					<StyledButton
						as='a'
						href='https://wa.me/34655981758'
						target='_blank'
						rel='noopener noreferrer'
					>
						Hablemos <img src='/icons/whatsapp-icon.png' alt='' />
					</StyledButton>
				</StyledNavRight>{' '}
			</StyledNavbar>{' '}
			<PageTransition style={{ height: '100%' }}>
				<StyledContent>
					<StyledFlexContainer>
						<StyledImage
							src='/images/services-group-1.png'
							alt='Service Image 1'
						/>
					</StyledFlexContainer>
					<StyledFlexContainer>
						<StyledTitle>
							Dime qué estás buscando… y te mostraré el camino más directo para
							encontrarlo.
						</StyledTitle>
						<StyledDescription>
							Cada cliente es diferente. Algunos buscan una inversión rentable,
							otros una segunda residencia, y otros simplemente quieren empezar
							una nueva etapa con total tranquilidad. Por eso mis servicios se
							adaptan a ti, no al revés.
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
						<StyledImage src='/images/home-group-2.png' alt='Service Image 2' />
					</StyledFlexContainer>
				</StyledContent>{' '}
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
		</StyledContainer>
	);
};

export default Servicios;
