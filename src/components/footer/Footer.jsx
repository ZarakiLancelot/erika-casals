import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
	StyledFooterContainer,
	StyledTopSection,
	StyledTopContent,
	StyledTitle,
	StyledDescription,
	StyledContactButton,
	StyledBottomSection,
	StyledLeftBottom,
	StyledBottomDescription,
	StyledSocialIcons,
	StyledSocialIcon,
	StyledRightBottom,
	StyledQuickLinksTitle,
	StyledQuickLinks,
	StyledQuickLink
} from './styles';

// Styled components para los modales
const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.7);
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	opacity: ${props => (props.$isVisible ? 1 : 0)};
	transition: opacity 0.3s ease-in-out;
`;

const ModalContent = styled.div`
	background: white;
	border-radius: 8px;
	max-width: 800px;
	max-height: 80vh;
	width: 100%;
	position: relative;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	overflow: hidden;
	transform: ${props =>
		props.$isVisible
			? 'translateY(0) scale(1)'
			: 'translateY(-20px) scale(0.95)'};
	opacity: ${props => (props.$isVisible ? 1 : 0)};
	transition: all 0.3s ease-in-out;
`;

const ModalHeader = styled.div`
	padding: 20px 30px;
	border-bottom: 1px solid #eee;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #f8f9fa;

	h2 {
		margin: 0;
		color: #16243e;
		font-size: 20px;
		font-weight: 600;
	}
`;

const ModalCloseButton = styled.button`
	background: none;
	border: none;
	font-size: 24px;
	color: #666;
	cursor: pointer;
	padding: 0;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.3s ease;

	&:hover {
		background-color: #e9ecef;
		color: #16243e;
	}
`;

const ModalBody = styled.div`
	padding: 30px;
	overflow-y: auto;
	max-height: calc(80vh - 100px);
	line-height: 1.6;

	h3 {
		color: #16243e;
		font-size: 16px;
		font-weight: 600;
		margin: 20px 0 10px 0;

		&:first-child {
			margin-top: 0;
		}
	}

	p {
		margin-bottom: 15px;
		color: #333;
		font-size: 14px;
	}

	ul {
		margin: 10px 0;
		padding-left: 20px;

		li {
			margin-bottom: 5px;
			color: #333;
			font-size: 14px;
		}
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 15px 0;

		th,
		td {
			border: 1px solid #ddd;
			padding: 8px 12px;
			text-align: left;
			font-size: 14px;
		}

		th {
			background-color: #f8f9fa;
			font-weight: 600;
			color: #16243e;
		}
	}

	a {
		color: #16243e;
		text-decoration: underline;

		&:hover {
			color: #2c3e50;
		}
	}
`;

const Footer = () => {
	const [modalType, setModalType] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const openModal = type => {
		setModalType(type);
		setTimeout(() => setIsModalVisible(true), 10); // Pequeño delay para trigger la animación
	};

	const closeModal = () => {
		setIsModalVisible(false);
		setTimeout(() => setModalType(null), 300); // Esperar a que termine la animación
	};

	const handleOverlayClick = e => {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	};

	// Cerrar modal con tecla Escape
	useEffect(() => {
		const handleKeyDown = e => {
			if (e.key === 'Escape' && modalType) {
				closeModal();
			}
		};

		if (modalType) {
			document.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [modalType]);

	const getModalContent = () => {
		switch (modalType) {
			case 'legal':
				return {
					title: 'Aviso Legal y Condiciones Generales de Uso',
					content: (
						<div>
							<h3>1.1 Información del titular del sitio web</h3>
							<p>
								En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios
								de la Sociedad de la Información y de Comercio Electrónico
								(LSSI-CE), se informa que el presente sitio web es titularidad
								de:
							</p>
							<p>
								<strong>Titular:</strong> ERIKA CASALS MORENO
								<br />
								<strong>Domicilio:</strong> Avenida Infante Don Luis 1, Bloque
								1, 3ºC
								<br />
								<strong>Teléfono:</strong> 655 981 758
								<br />
								<strong>Correo electrónico:</strong> erika@erikacasals.com
							</p>

							<h3>1.2 Objeto y condiciones de uso</h3>
							<p>
								El presente sitio web tiene por objeto ofrecer información sobre
								los servicios de intermediación y asesoramiento inmobiliario de
								la titular. El acceso y navegación por este sitio web implica la
								aceptación expresa y sin reservas de las condiciones aquí
								reflejadas.
							</p>
							<p>
								El usuario se compromete a hacer un uso adecuado del sitio y a
								no emplearlo para realizar actividades ilícitas o contrarias a
								la buena fe.
							</p>

							<h3>1.3 Propiedad intelectual e industrial</h3>
							<p>
								Todos los contenidos del sitio web (diseños, textos, imágenes,
								logotipos, software, código fuente, etc.) son propiedad de ERIKA
								CASALS MORENO o de terceros y están protegidos por derechos de
								propiedad intelectual e industrial. Queda prohibida su
								reproducción sin autorización expresa.
							</p>

							<h3>1.4 Responsabilidad</h3>
							<p>
								La titular no garantiza la inexistencia de errores ni la
								disponibilidad continua del sitio web. No se hace responsable de
								los daños derivados del uso del sitio o de los enlaces externos
								que puedan contener.
							</p>

							<h3>1.5 Enlaces externos</h3>
							<p>
								Este sitio puede contener enlaces a sitios web de terceros.
								ERIKA CASALS MORENO no se responsabiliza del contenido,
								políticas o prácticas de dichos sitios.
							</p>

							<h3>1.6 Legislación aplicable y jurisdicción</h3>
							<p>
								Este sitio web se rige por la legislación española. Para la
								resolución de cualquier conflicto se someterá a los Juzgados y
								Tribunales de Madrid, salvo que la normativa en materia de
								consumidores indique otro fuero.
							</p>
						</div>
					)
				};
			case 'privacy':
				return {
					title: 'Política de Privacidad',
					content: (
						<div>
							<h3>2.1 Responsable del tratamiento</h3>
							<p>
								<strong>Nombre:</strong> ERIKA CASALS MORENO
								<br />
								<strong>Dirección:</strong> Avenida Infante Don Luis 1, Bloque
								1, 3ºC
								<br />
								<strong>Teléfono:</strong> 655 981 758
								<br />
								<strong>Correo electrónico:</strong> erika@erikacasals.com
								<br />
								<strong>Delegado de Protección de Datos:</strong> No aplica
							</p>

							<h3>2.2 Finalidades del tratamiento</h3>
							<p>
								Tratamos los datos personales del usuario para las siguientes
								finalidades:
							</p>
							<ul>
								<li>
									Atender solicitudes realizadas mediante el formulario web,
									correo electrónico o por teléfono.
								</li>
								<li>
									Prestación de servicios inmobiliarios, incluyendo visitas,
									asesoramiento, gestión documental, seguimiento y cierre de
									operaciones.
								</li>
								<li>
									Gestión administrativa, contable y fiscal derivada de la
									relación comercial.
								</li>
								<li>Conservación histórica de relaciones comerciales.</li>
								<li>
									Envío de comunicaciones informativas y/o comerciales
									relacionadas con nuestros servicios, si ha prestado su
									consentimiento.
								</li>
							</ul>

							<h3>2.3 Base legal para el tratamiento</h3>
							<ul>
								<li>Ejecución de contrato o medidas precontractuales.</li>
								<li>Consentimiento del interesado.</li>
								<li>Cumplimiento de obligaciones legales.</li>
							</ul>

							<h3>2.4 Plazo de conservación de los datos</h3>
							<p>
								Los datos se conservarán durante el tiempo necesario para
								cumplir con la finalidad para la que se recabaron y durante los
								plazos legalmente exigidos. En caso de consentimiento para
								comunicaciones comerciales, hasta que se revoque dicho
								consentimiento.
							</p>

							<h3>2.5 Destinatarios de los datos</h3>
							<p>
								No se cederán datos a terceros salvo obligación legal o cuando
								sea necesario para la prestación de los servicios (notarías,
								registros, abogados, bancos, colaboradores inmobiliarios, etc.).
							</p>

							<h3>2.6 Derechos del usuario</h3>
							<p>El usuario puede ejercer sus derechos de:</p>
							<ul>
								<li>Acceso</li>
								<li>Rectificación</li>
								<li>Supresión</li>
								<li>Limitación</li>
								<li>Oposición</li>
								<li>Portabilidad</li>
								<li>Retirada del consentimiento</li>
							</ul>
							<p>
								Mediante comunicación dirigida al correo electrónico:
								erika@erikacasals.com
							</p>
							<p>
								Asimismo, puede presentar una reclamación ante la Agencia
								Española de Protección de Datos (
								<a
									href='https://www.aepd.es'
									target='_blank'
									rel='noopener noreferrer'
								>
									www.aepd.es
								</a>
								).
							</p>

							<h3>2.7 Medidas de seguridad</h3>
							<p>
								ERIKA CASALS MORENO ha adoptado las medidas técnicas y
								organizativas adecuadas para garantizar la seguridad, integridad
								y confidencialidad de los datos personales conforme al RGPD y la
								LOPDGDD.
							</p>
						</div>
					)
				};
			case 'cookies':
				return {
					title: 'Política de Cookies',
					content: (
						<div>
							<p>
								El Sitio Web utiliza cookies para mejorar la experiencia de
								navegación, personalizar el contenido y analizar el tráfico.
							</p>

							<h3>¿Qué son las cookies?</h3>
							<p>
								Una cookie es un archivo que se descarga en su dispositivo al
								acceder a determinadas páginas web. Las cookies permiten a una
								página web, entre otras cosas, almacenar y recuperar información
								sobre los hábitos de navegación del usuario.
							</p>

							<h3>Tipos de cookies que utilizamos</h3>
							<table>
								<thead>
									<tr>
										<th>Tipo de cookie</th>
										<th>Finalidad</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Técnicas o necesarias</td>
										<td>
											Permiten la navegación por el sitio web y el uso de sus
											funciones básicas.
										</td>
									</tr>
									<tr>
										<td>De análisis</td>
										<td>
											Permiten cuantificar el número de usuarios y analizar la
											navegación.
										</td>
									</tr>
									<tr>
										<td>De personalización</td>
										<td>
											Recuerdan sus preferencias (idioma, configuración, etc.).
										</td>
									</tr>
									<tr>
										<td>Publicitarias (si procede)</td>
										<td>Permiten la gestión de espacios publicitarios.</td>
									</tr>
								</tbody>
							</table>

							<h3>Gestión de cookies</h3>
							<p>
								Al acceder al sitio web, el usuario puede aceptar, rechazar o
								configurar las cookies mediante el banner de configuración.
							</p>
							<p>
								También puede configurar su navegador para restringir, bloquear
								o eliminar las cookies:
							</p>
							<ul>
								<li>
									<a
										href='https://support.google.com/chrome/answer/95647?hl=es'
										target='_blank'
										rel='noopener noreferrer'
									>
										Google Chrome
									</a>
								</li>
								<li>
									<a
										href='https://support.mozilla.org/es/kb/Borrar%20cookies'
										target='_blank'
										rel='noopener noreferrer'
									>
										Mozilla Firefox
									</a>
								</li>
								<li>
									<a
										href='https://support.apple.com/es-es/guide/safari/sfri11471/mac'
										target='_blank'
										rel='noopener noreferrer'
									>
										Safari
									</a>
								</li>
								<li>
									<a
										href='https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies'
										target='_blank'
										rel='noopener noreferrer'
									>
										Microsoft Edge
									</a>
								</li>
							</ul>
							<p>
								El bloqueo de cookies puede afectar al correcto funcionamiento
								del sitio web.
							</p>

							<h3>Cookies de terceros</h3>
							<p>
								En el sitio web pueden utilizarse cookies de terceros (por
								ejemplo, Google Analytics). El usuario puede consultar sus
								respectivas políticas para más información:
							</p>
							<p>
								<a
									href='https://policies.google.com/technologies/cookies'
									target='_blank'
									rel='noopener noreferrer'
								>
									Google Analytics
								</a>
							</p>
						</div>
					)
				};
			default:
				return null;
		}
	};
	return (
		<StyledFooterContainer>
			{/* Sección superior con imagen de fondo */}
			<StyledTopSection>
				<StyledTopContent>
					<StyledTitle>¿Listo para transformar tu espacio?</StyledTitle>
					<StyledContactButton
						as='a'
						href='https://wa.me/34655981758'
						target='_blank'
						rel='noopener noreferrer'
					>
						Contáctame
						<span>
							<img src='/icons/whatsapp-icon.png' alt='' />
						</span>
					</StyledContactButton>
				</StyledTopContent>
			</StyledTopSection>

			{/* Sección inferior con enlaces y redes sociales */}
			<StyledBottomSection>
				<StyledLeftBottom>
					<StyledDescription>
						Descubre soluciones arquitectónicas inspiradas, adaptadas a tu
						estilo y necesidades únicas.
					</StyledDescription>
					<StyledSocialIcons>
						<StyledSocialIcon
							href='https://www.facebook.com/erika.c.moreno.14'
							target='_blank'
							aria-label='Facebook'
						>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='currentColor'
							>
								<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
							</svg>
						</StyledSocialIcon>
						<StyledSocialIcon
							href='https://www.instagram.com/erikacasals/'
							target='_blank'
							aria-label='Instagram'
						>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='currentColor'
							>
								<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
							</svg>
						</StyledSocialIcon>
						<StyledSocialIcon
							href='https://www.linkedin.com/in/erikacasals'
							target='_blank'
							aria-label='LinkedIn'
						>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='currentColor'
							>
								<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
							</svg>
						</StyledSocialIcon>
						<StyledSocialIcon
							href='https://www.youtube.com/@erikacasals'
							target='_blank'
							aria-label='YouTube'
						>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='currentColor'
							>
								<path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
							</svg>
						</StyledSocialIcon>
						<StyledSocialIcon
							href='https://www.tiktok.com/@erikacasals'
							target='_blank'
							aria-label='TikTok'
						>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='currentColor'
							>
								<path d='M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' />
							</svg>
						</StyledSocialIcon>
					</StyledSocialIcons>
					<StyledBottomDescription>
						© Designed by{' '}
						<a
							href='https://www.wowwebgroup.com/'
							style={{ textDecoration: 'underline' }}
						>
							Wow Web Group
						</a>
						<br />
						<a
							href='#'
							onClick={e => {
								e.preventDefault();
								openModal('legal');
							}}
							style={{
								textDecoration: 'underline',
								color: 'inherit',
								cursor: 'pointer'
							}}
						>
							Aviso legal
						</a>
						{' | '}
						<a
							href='#'
							onClick={e => {
								e.preventDefault();
								openModal('privacy');
							}}
							style={{
								textDecoration: 'underline',
								color: 'inherit',
								cursor: 'pointer'
							}}
						>
							Política de privacidad
						</a>
						{' | '}
						<a
							href='#'
							onClick={e => {
								e.preventDefault();
								openModal('cookies');
							}}
							style={{
								textDecoration: 'underline',
								color: 'inherit',
								cursor: 'pointer'
							}}
						>
							Política de cookies
						</a>
					</StyledBottomDescription>
				</StyledLeftBottom>

				<StyledRightBottom>
					<StyledQuickLinksTitle>Enlaces rápidos</StyledQuickLinksTitle>
					<StyledQuickLinks>
						<StyledQuickLink as={Link} to='/'>Inicio</StyledQuickLink>
						<StyledQuickLink as={Link} to='/servicios'>Servicios</StyledQuickLink>
						<StyledQuickLink as={Link} to='/aboutme'>Sobre mí</StyledQuickLink>
					</StyledQuickLinks>
				</StyledRightBottom>
			</StyledBottomSection>

			{/* Modales con información legal */}
			{modalType && (
				<ModalOverlay onClick={handleOverlayClick} $isVisible={isModalVisible}>
					<ModalContent $isVisible={isModalVisible}>
						<ModalHeader>
							<h2>{getModalContent().title}</h2>
							<ModalCloseButton onClick={closeModal}>&times;</ModalCloseButton>
						</ModalHeader>
						<ModalBody>{getModalContent().content}</ModalBody>
					</ModalContent>
				</ModalOverlay>
			)}
		</StyledFooterContainer>
	);
};

export default Footer;
