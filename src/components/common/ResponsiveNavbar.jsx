import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Global styles - inject when navbar becomes fixed
const GlobalStyle = `
	.navbar-fixed {
		padding-top: 100px !important;
	}
	
	@media (max-width: 768px) {
		.navbar-fixed {
			padding-top: 0 !important;
		}
	}
`;

// Inject global styles
const injectGlobalStyles = () => {
	if (!document.getElementById('navbar-global-styles')) {
		const style = document.createElement('style');
		style.id = 'navbar-global-styles';
		style.textContent = GlobalStyle;
		document.head.appendChild(style);
	}
};

const MobileNavbar = ({ isScrolled }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<StyledMobileNavbar>
			<MobileNavContainer>
				<MobileNavLeft>
					<HamburgerButton $isScrolled={isScrolled} onClick={toggleMenu} aria-label='Abrir menú'>
						<span></span>
						<span></span>
						<span></span>
					</HamburgerButton>
				</MobileNavLeft>

				<MobileNavCenter>
					<img src='/images/logo-nav.png' alt='Logo' />
				</MobileNavCenter>

				<MobileNavRight>
					<StyledButton
						as='a'
						href='https://wa.me/34655981758'
						target='_blank'
						rel='noopener noreferrer'
						className={`button-nav ${isScrolled ? 'scrolled' : ''}`}
					>
						Hablemos
						<img
							src='/icons/whatsapp-icon.png'
							alt='WhatsApp'
							className='img-nav'
						/>
					</StyledButton>
				</MobileNavRight>
			</MobileNavContainer>

			<MobileMenu $isOpen={isMenuOpen}>
				<MobileMenuOverlay $isOpen={isMenuOpen} onClick={closeMenu} />
				<MobileMenuContent $isOpen={isMenuOpen}>
					<MobileMenuHeader>
						<img src='/images/logo-nav.png' alt='Logo' />
						<CloseButton onClick={closeMenu} aria-label='Cerrar menú'>
							×
						</CloseButton>
					</MobileMenuHeader>
					<MobileMenuList>
						<MobileMenuItem>
							<Link to='/' onClick={closeMenu}>
								Inicio
							</Link>
						</MobileMenuItem>
						<MobileMenuItem>
							<Link to='/servicios' onClick={closeMenu}>
								Servicios
							</Link>
						</MobileMenuItem>
						<MobileMenuItem>
							<Link to='/aboutme' onClick={closeMenu}>
								Sobre mí
							</Link>
						</MobileMenuItem>
						<MobileMenuItem>
							<Link to='/rent' onClick={closeMenu}>
								Alquiler
							</Link>
						</MobileMenuItem>
						<MobileMenuItem>
							<Link to='/sales' onClick={closeMenu}>
								Venta
							</Link>
						</MobileMenuItem>
					</MobileMenuList>
				</MobileMenuContent>
			</MobileMenu>
		</StyledMobileNavbar>
	);
};

// Desktop Navbar Component
const DesktopNavbar = ({ isScrolled }) => {
	return (
		<StyledDesktopNavbar $isScrolled={isScrolled}>
			<StyledNavLeft>
				<img src='/images/logo-nav.png' alt='Logo' />
			</StyledNavLeft>
			<StyledNavCenter>
				<StyledNavLi $isScrolled={isScrolled}>
					<Link to='/'>Inicio</Link>
				</StyledNavLi>
				<StyledNavLi $isScrolled={isScrolled}>
					<Link to='/servicios'>Servicios</Link>
				</StyledNavLi>
				<StyledNavLi $isScrolled={isScrolled}>
					<Link to='/aboutme'>Sobre mí</Link>
				</StyledNavLi>
				<StyledNavLi $isScrolled={isScrolled}>
					<Link to='/rent'>Alquiler</Link>
				</StyledNavLi>
				<StyledNavLi $isScrolled={isScrolled}>
					<Link to='/sales'>Venta</Link>
				</StyledNavLi>
			</StyledNavCenter>
			<StyledNavRight>
				<StyledButton
					as='a'
					href='https://wa.me/34655981758'
					target='_blank'
					rel='noopener noreferrer'
					className={`button-nav ${isScrolled ? 'scrolled' : ''}`}
				>
					Hablemos
					<img
						src='/icons/whatsapp-icon.png'
						alt='WhatsApp'
						className='img-nav'
					/>
				</StyledButton>
			</StyledNavRight>
		</StyledDesktopNavbar>
	);
};

// Main Responsive Navbar Component
const ResponsiveNavbar = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	// Inject global styles
	useEffect(() => {
		injectGlobalStyles();
		console.log('ResponsiveNavbar mounted'); // Debug
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			console.log(
				'Scroll position:',
				scrollTop,
				'Window height:',
				window.innerHeight,
				'Document height:',
				document.documentElement.scrollHeight
			); // Debug mejorado
			setIsScrolled(scrollTop > 50);
		};

		// Probar scroll inmediatamente
		handleScroll();

		window.addEventListener('scroll', handleScroll, { passive: true });
		console.log('Scroll listener added'); // Debug

		return () => {
			window.removeEventListener('scroll', handleScroll);
			console.log('Scroll listener removed'); // Debug
		};
	}, []);

	// Agregar clase al body cuando el navbar es fixed
	useEffect(() => {
		console.log('isScrolled changed:', isScrolled); // Debug
		if (isScrolled) {
			document.body.classList.add('navbar-fixed');
		} else {
			document.body.classList.remove('navbar-fixed');
		}

		return () => {
			document.body.classList.remove('navbar-fixed');
		};
	}, [isScrolled]);

	return (
		<StyledNavbarContainer $isScrolled={isScrolled}>
			<DesktopNavbar isScrolled={isScrolled} />
			<MobileNavbar isScrolled={isScrolled} />
		</StyledNavbarContainer>
	);
};

// Styled Components
const StyledNavbarContainer = styled.nav`
	background-color: ${props => (props.$isScrolled ? '#16243e' : 'white')};
	color: white;
	position: ${props => (props.$isScrolled ? 'fixed' : 'relative')};
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	transition: all 0.3s ease;
	box-shadow: ${props =>
		props.$isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'};
`;

const StyledDesktopNavbar = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.2rem 0;

	@media (max-width: 768px) {
		display: none;
	}
`;

const StyledMobileNavbar = styled.div`
	display: none;

	@media (max-width: 768px) {
		display: block;
	}
`;

const MobileNavContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
`;

const MobileNavLeft = styled.div`
	flex: 1;
	display: flex;
	justify-content: flex-start;
`;

const MobileNavCenter = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;

	img {
		width: 80px;
		height: 80px;
	}
`;

const MobileNavRight = styled.div`
	flex: 1;
	display: flex;
	justify-content: flex-end;
`;

const HamburgerButton = styled.button`
	background: none;
	border: none;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 30px;
	height: 30px;
	cursor: pointer;
	padding: 0;

	span {
		width: 25px;
		height: 3px;
		background-color: ${props => (props.$isScrolled ? 'white' : '#16243e')};
		margin: 2px 0;
		transition: 0.3s;
		border-radius: 2px;

		&:nth-child(1) {
			transform-origin: center;
		}
		&:nth-child(2) {
			transform-origin: center;
		}
		&:nth-child(3) {
			transform-origin: center;
		}
	}

	&:hover span {
		background-color: rgb(167, 196, 250);
	}
`;

const MobileMenu = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1001;
	pointer-events: ${props => (props.$isOpen ? 'auto' : 'none')};
`;

const MobileMenuOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: ${props => (props.$isOpen ? 1 : 0)};
	transition: opacity 0.3s ease-in-out;
`;

const MobileMenuContent = styled.div`
	position: relative;
	background-color: white;
	width: 280px;
	height: 100%;
	display: flex;
	flex-direction: column;
	box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
	transform: translateX(${props => (props.$isOpen ? '0' : '-100%')});
	transition: transform 0.3s ease-in-out;
`;

const MobileMenuHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.5rem;
	border-bottom: 1px solid #eee;

	img {
		width: 60px;
		height: 60px;
	}
`;

const CloseButton = styled.button`
	background: none;
	border: none;
	font-size: 2rem;
	color: #16243e;
	cursor: pointer;
	padding: 0;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #f5f5f5;
	}
`;

const MobileMenuList = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	flex: 1;
`;

const MobileMenuItem = styled.li`
	border-bottom: 1px solid #eee;

	a {
		display: block;
		padding: 1.2rem 1.5rem;
		color: #16243e;
		text-decoration: none;
		font-weight: 400;
		letter-spacing: 1px;
		transition: background-color 0.3s ease, color 0.3s ease;

		&:hover {
			background-color: #f8f9fa;
			color: rgb(167, 196, 250);
		}
	}
`;

const StyledNavLeft = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;

	img {
		width: 100px;
		height: 100px;
	}
`;

const StyledNavCenter = styled.ul`
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 2;
	text-align: center;
	gap: 2rem;
	list-style: none;
	margin: 0;
	padding: 0;
`;

const StyledNavLi = styled.li`
	color: ${props => (props.$isScrolled ? 'white' : '#16243e')};
	cursor: pointer;
	transition: color 0.3s ease;
	font-weight: 400;
	letter-spacing: 1px;

	a {
		color: inherit;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	&:hover {
		color: rgb(167, 196, 250);
	}
`;

const StyledNavRight = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
`;

const StyledButton = styled.button`
	border: none;
	background-color: white;
	border-radius: 20px;
	padding: 0.4rem 1.5rem;
	font-family: 'Montserrat', sans-serif;
	font-weight: 500;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 1rem;
	transition: background-color 0.3s ease;
	color: #16243e;
	font-size: 0.75rem;
	text-decoration: none;

	&:hover {
		background-color: rgb(167, 196, 250);
	}

	&.button-nav {
		background-color: #16243e;
		color: white;

		&:hover {
			background-color: rgb(167, 196, 250);
		}

		&.scrolled {
			background-color: white;
			color: #16243e;

			&:hover {
				background-color: rgb(167, 196, 250);
				color: white;
			}

			img.img-nav {
				filter: invert(0) brightness(1);
			}
		}
	}

	img {
		width: 1.2rem;
		height: 1.2rem;

		&.img-nav {
			filter: invert(1) brightness(2);
		}
	}

	@media (max-width: 768px) {
		padding: 0.6rem 1.2rem;
		font-size: 0.9rem;
		gap: 0.8rem;
		border-radius: 18px;

		img {
			width: 1.2rem !important;
			height: 1.2rem !important;
		}
	}
`;

export default ResponsiveNavbar;
