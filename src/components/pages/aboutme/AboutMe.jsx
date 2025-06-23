import { Link } from 'react-router-dom';
import {
	StyledButton,
	StyledContainer,
	StyledNavbar,
	StyledNavCenter,
	StyledNavLeft,
	StyledNavLi,
	StyledNavRight
} from '../home/styles';
import AboutProfile from '../../aboutme/AboutProfile';
import Booking from '../../booking/Booking';
import Footer from '../../footer/Footer';
import InstagramFeed from '../../instagramfeed/InstagramFeed';

const AboutMe = () => {
	return (
		<StyledContainer style={{ background: 'none' }}>
			<StyledNavbar style={{ background: '#16243e' }}>
				<StyledNavLeft></StyledNavLeft>
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
						<Link to='/rent'>Alquiler</Link>
					</StyledNavLi>
					<StyledNavLi>
						<Link to='/sales'>Venta</Link>
					</StyledNavLi>
				</StyledNavCenter>
				<StyledNavRight>
					<StyledButton>
						Hablemos <img src='/icons/whatsapp-icon.png' alt='' />
					</StyledButton>{' '}
				</StyledNavRight>
			</StyledNavbar>
			<AboutProfile />
			<InstagramFeed />
			<Booking />
			<Footer />
		</StyledContainer>
	);
};

export default AboutMe;
