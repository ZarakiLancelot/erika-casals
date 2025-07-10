import AboutProfile from '../../aboutme/AboutProfile';
import PageTransition from '../../common/PageTransition';
import ScrollAnimation from '../../common/ScrollAnimation';
import ResponsiveNavbar from '../../common/ResponsiveNavbar';
import { StyledContainer } from '../home/styles';
import Booking from '../../booking/Booking';
import Footer from '../../footer/Footer';
import InstagramFeed from '../../instagramfeed/InstagramFeed';
import CertificatesMarquee from '../../certificates/CertificatesMarquee';

const AboutMe = () => {
	return (
		<div>
			<ResponsiveNavbar />
			<PageTransition>
				<StyledContainer style={{ background: 'none', height: 'auto' }}>
					<AboutProfile />
				</StyledContainer>
				<CertificatesMarquee />
				<ScrollAnimation delay={0.1}>
					<InstagramFeed />
				</ScrollAnimation>
				<ScrollAnimation delay={0.2}>
					<Booking />
				</ScrollAnimation>
				<Footer />
			</PageTransition>
		</div>
	);
};

export default AboutMe;
