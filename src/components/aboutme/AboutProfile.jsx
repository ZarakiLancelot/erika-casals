import { StyledTitle } from '../pages/home/styles';
import {
	StyledDescription,
	StyledInfoContainer,
	StyledInfoContent,
	StyledInfoDiv,
	ContactInfo,
	ContactItem,
	ProfileText,
	ProfileHighlight,
	SocialLinks,
	SocialButton,
	WhatsAppButton
} from './styles';

const AboutProfile = () => {
	return (
		<StyledInfoContainer>
			<StyledInfoContent>
				<StyledInfoDiv>
					<img src='/images/erika.jpeg' alt='Erika Casals' />
				</StyledInfoDiv>
				<StyledInfoDiv>
					<StyledTitle style={{ fontSize: '50px', marginBottom: '0px' }}>
						Erika Casals
						<img src='/images/logo-erika-casals-whois.png' alt='' />
					</StyledTitle>

					<ContactInfo>
						<ContactItem>
							<img src='/icons/sms-edit.png' alt='' /> erika@erikacasals.com
						</ContactItem>
						<ContactItem>
							<img src='/icons/call.png' alt='' /> +34 655 98 17 58
						</ContactItem>
						<SocialLinks>
							<SocialButton
								as={'a'}
								href='https://www.facebook.com/erika.casals.3'
								target='_blank'
								rel='noopener noreferrer'
							>
								<img src='/icons/facebook-icon.png' alt='' />
							</SocialButton>
							<SocialButton
								as='a'
								href='https://www.instagram.com/erikacasals/'
								target='_blank'
								rel='noopener noreferrer'
							>
								<img src='/icons/instagram-icon.png' alt='' />
							</SocialButton>
							<SocialButton
								as='a'
								href='https://www.linkedin.com/in/erikacasals/'
								target='_blank'
								rel='noopener noreferrer'
							>
								<img src='/icons/linkedin.png' alt='' />
							</SocialButton>
							<SocialButton
								as='a'
								href='https://www.youtube.com/@erikacasals'
								target='_blank'
								rel='noopener noreferrer'
							>
								<svg
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='#16243e'
									style={{ transition: 'fill 0.3s ease' }}
								>
									<path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
								</svg>
							</SocialButton>
							<SocialButton
								as='a'
								href='https://www.tiktok.com/@erikacasals'
								target='_blank'
								rel='noopener noreferrer'
							>
								<svg
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='#16243e'
									style={{ transition: 'fill 0.3s ease' }}
								>
									<path d='M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' />
								</svg>
							</SocialButton>
						</SocialLinks>
					</ContactInfo>

					<StyledDescription>
						<ProfileText>
							Soy Erika Casals, asesora inmobiliaria con más de 20 años de
							experiencia ayudando a personas a vender o encontrar su hogar
							ideal.
						</ProfileText>

						<ProfileText>
							Durante estas dos décadas he aprendido que lo más importante no es
							solo cerrar una operación, sino hacerlo bien con claridad,
							seguridad y acompañamiento de principio a fin.
						</ProfileText>

						<ProfileText>
							Me implico en cada proyecto como si fuera propio, explicando cada
							paso de forma sencilla, sin tecnicismos ni promesas vacías.
						</ProfileText>

						<ProfileHighlight>
							Lo que te digo, se cumple. Siempre.
						</ProfileHighlight>

						<ProfileText>
							Trabajo desde la honestidad, la transparencia y el compromiso real
							con quienes confían en mí. Y eso es precisamente lo que marca la
							diferencia.
						</ProfileText>
					</StyledDescription>

					<WhatsAppButton
						as='a'
						href='https://wa.me/34655981758'
						target='_blank'
						rel='noopener noreferrer'
					>
						Hablemos ahora por WhatsApp{' '}
						<img src='/icons/whatsapp-icon.png' alt='' />
					</WhatsAppButton>
				</StyledInfoDiv>
			</StyledInfoContent>

			{/* <StyledNumbersContainer>
				<StyledNumbersContent>
					<StyledNumber>3000+</StyledNumber>
					<StyledNumberDescription>Proyectos exitosos</StyledNumberDescription>
				</StyledNumbersContent>
				<StyledNumbersContent>
					<StyledNumber>2500+</StyledNumber>
					<StyledNumberDescription>
						Clientes satisfechos
					</StyledNumberDescription>
				</StyledNumbersContent>
				<StyledNumbersContent>
					<StyledNumber>20+</StyledNumber>
					<StyledNumberDescription>Años de experiencia</StyledNumberDescription>
				</StyledNumbersContent>
			</StyledNumbersContainer> */}
		</StyledInfoContainer>
	);
};

export default AboutProfile;
