import {
	StyledContainer,
	StyledContent,
	StyledTitle,
	StyledSubtitle,
	StyledImageContainer,
	StyledWhatsAppButton,
	StyledWhatsAppIcon,
	StyledWhatsAppText
} from './styles';

const Booking = () => {
	return (
		<StyledContainer>
			<StyledContent>
				<StyledTitle>Hazlo bien desde el principio.</StyledTitle>
				<StyledSubtitle>Empieza hoy</StyledSubtitle>
				<StyledImageContainer>
					<img src='/images/booking-photo.png' alt='Vista panorámica' />
				</StyledImageContainer>

				<StyledWhatsAppButton
					as={'a'}
					href='https://wa.me/34655981758'
					target='_blank'
					rel='noopener noreferrer'
				>
					<StyledWhatsAppText>
						Agenda una llamada conmigo por WhatsApp
					</StyledWhatsAppText>
					<StyledWhatsAppIcon>
						<img src='/icons/whatsapp-icon.png' alt='WhatsApp' />
					</StyledWhatsAppIcon>
				</StyledWhatsAppButton>
			</StyledContent>
		</StyledContainer>
	);
};

export default Booking;
