import { Link } from 'react-router-dom';
import Booking from '../../booking/Booking';
import Footer from '../../footer/Footer';
import InstagramFeed from '../../instagramfeed/InstagramFeed';
import WhoIs from '../../layouts/whois/WhoIs';
import MyWork from '../../mywork/MyWork';
import Reviews from '../../reviews/Reviews';
import ServicesComp from '../../servicesComp/ServicesComp';
import PageTransition from '../../common/PageTransition';
import ScrollAnimation from '../../common/ScrollAnimation';
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
} from './styles';

const Home = () => {
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
			<PageTransition type='home'>
				<StyledContent>
					<StyledFlexContainer>
						<StyledImage src='/images/home-group-1.png' alt='Home Image 1' />
					</StyledFlexContainer>
					<StyledFlexContainer>
						<StyledTitle>
							Vende tu propiedad con alguien que realmente te representa.
						</StyledTitle>
						<StyledDescription>
							Soy Erika Casals, asesora inmobiliaria especializada en ventas de
							propiedades en España. Acompaño a propietarios como tú a vender su
							casa con confianza, destacando su valor real y asegurando un
							proceso claro, ágil y sin complicaciones.
						</StyledDescription>
						<StyledButton
							as='a'
							href='https://wa.me/34655981758'
							target='_blank'
							rel='noopener noreferrer'
						>
							Contáctame <img src='/icons/whatsapp-icon.png' alt='' />
						</StyledButton>
					</StyledFlexContainer>
					<StyledFlexContainer>
						<StyledImage src='/images/home-group-2.png' alt='Home Image 1' />
					</StyledFlexContainer>
				</StyledContent>{' '}
				<ScrollAnimation delay={0.1} type='slideLeft'>
					<WhoIs />
				</ScrollAnimation>
				<ScrollAnimation delay={0.2} type='slideRight'>
					<MyWork />
				</ScrollAnimation>
				<ScrollAnimation delay={0.3} type='scaleIn'>
					<ServicesComp />
				</ScrollAnimation>
				<ScrollAnimation delay={0.4} type='slideUp'>
					<Reviews />
				</ScrollAnimation>
				<ScrollAnimation delay={0.5} type='fadeIn'>
					<Booking />
				</ScrollAnimation>
				<ScrollAnimation delay={0.6} type='slideUp'>
					<InstagramFeed />
				</ScrollAnimation>
				<ScrollAnimation delay={0.7} type='fadeIn'>
					<Footer />
				</ScrollAnimation>
			</PageTransition>
		</StyledContainer>
	);
};

export default Home;
