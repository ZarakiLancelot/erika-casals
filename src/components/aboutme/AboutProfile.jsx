import { StyledTitle } from '../pages/home/styles';
import {
	StyledDescription,
	StyledInfoContainer,
	StyledInfoContent,
	StyledInfoDiv,
	StyledNumber,
	StyledNumberDescription,
	StyledNumbersContainer,
	StyledNumbersContent,
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
					<img src='/images/who-is-image.png' alt='Erika Casals' />
				</StyledInfoDiv>
				<StyledInfoDiv>
					<StyledTitle style={{ fontSize: '50px', marginBottom: '0px' }}>
						Erika Casals
						<img src='/images/logo-whois.png' alt='' />
					</StyledTitle>

					<ContactInfo>
						<ContactItem>
							<img src='/icons/sms-edit.png' alt='' /> erikacasals@gmail.com
						</ContactItem>
						<ContactItem>
							<img src='/icons/call.png' alt='' /> +34 655 89 17 36
						</ContactItem>
						<SocialLinks>
							<SocialButton>
								<img src='/icons/facebook-icon.png' alt='' />
							</SocialButton>
							<SocialButton>
								<img src='/icons/instagram-icon.png' alt='' />
							</SocialButton>
							<SocialButton>
								<img src='/icons/linkedin.png' alt='' />
							</SocialButton>
						</SocialLinks>
					</ContactInfo>

					<StyledDescription>
						<ProfileText>
							Soy Erika Casals, representante inmobiliaria con más de 20 años de
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

					<WhatsAppButton>
						Hablemos ahora por WhatsApp{' '}
						<img src='/icons/whatsapp-icon.png' alt='' />
					</WhatsAppButton>
				</StyledInfoDiv>
			</StyledInfoContent>

			<StyledNumbersContainer>
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
			</StyledNumbersContainer>
		</StyledInfoContainer>
	);
};

export default AboutProfile;
