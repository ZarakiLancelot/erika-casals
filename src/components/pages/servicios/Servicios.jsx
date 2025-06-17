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

const Servicios = () => {
	return (
		<StyledContainer>
			<StyledNavbar>
				<StyledNavLeft></StyledNavLeft>
				<StyledNavCenter>
					<StyledNavLi>
						<Link to='/'>Inicio</Link>
					</StyledNavLi>
					<StyledNavLi>
						<Link to='/servicios'>Servicios</Link>
					</StyledNavLi>
					<StyledNavLi>Sobre mí</StyledNavLi>
					<StyledNavLi>Alquiler</StyledNavLi>
					<StyledNavLi>Venta</StyledNavLi>
				</StyledNavCenter>
				<StyledNavRight>
					<StyledButton>
						Hablemos <img src='/icons/whatsapp-icon.png' alt='' />
					</StyledButton>
				</StyledNavRight>
			</StyledNavbar>

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
					<StyledButton>
						Hablemos ahora por WhatsApp{' '}
						<img src='/icons/whatsapp-icon.png' alt='' />
					</StyledButton>
				</StyledFlexContainer>
				<StyledFlexContainer>
					<StyledImage src='/images/home-group-2.png' alt='Service Image 2' />
				</StyledFlexContainer>
			</StyledContent>
			<Propiedades reverse={false} />
			<Propiedades reverse={true} />
			<MiamiCosta />
			<Booking />

			{/* Footer */}
			<Footer />
		</StyledContainer>
	);
};

export default Servicios;
