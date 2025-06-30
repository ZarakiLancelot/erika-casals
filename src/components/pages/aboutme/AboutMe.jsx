import { Link } from 'react-router-dom';
import AboutProfile from '../../aboutme/AboutProfile';
import PageTransition from '../../common/PageTransition';
import ScrollAnimation from '../../common/ScrollAnimation';
import {
	StyledButton,
	StyledContainer,
	StyledNavbar,
	StyledNavCenter,
	StyledNavLeft,
	StyledNavLi,
	StyledNavRight
} from '../home/styles';
import Booking from '../../booking/Booking';
import Footer from '../../footer/Footer';
import InstagramFeed from '../../instagramfeed/InstagramFeed';

const AboutMe = () => {
	return (
		<StyledContainer style={{ background: 'none' }}>
			<StyledNavbar style={{ background: '#16243e' }}>
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
					</StyledButton>{' '}
				</StyledNavRight>{' '}
			</StyledNavbar>
			<PageTransition>
				<AboutProfile />
				<ScrollAnimation delay={0.1}>
					<InstagramFeed />
				</ScrollAnimation>
				<ScrollAnimation delay={0.2}>
					<Booking />
				</ScrollAnimation>
				<Footer />
			</PageTransition>
		</StyledContainer>
	);
};

export default AboutMe;
