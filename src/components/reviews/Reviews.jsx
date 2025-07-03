import { useState } from 'react';
import {
	StyledContainer,
	StyledContent,
	StyledFlexContainer,
	StyledTitle,
	StyledSliderContainer,
	StyledSliderContent,
	StyledImageDiv,
	StyledTestimonialDiv,
	StyledTestimonialText,
	StyledClientInfo,
	StyledClientName,
	StyledClientLocation,
	StyledNavigationButton,
	StyledNavigationContainer,
	StyledClientAvatar
} from './styles';

const Reviews = () => {
	const [currentTestimonial, setCurrentTestimonial] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const testimonials = [
		{
			id: 1,
			text: 'Erika es una gran profesional, nos ha ayudado y guiado en todo el proceso de venta de nuestra casa, mostrándose muy amable y comprensiva. Se nota desde el primer momento que tiene una gran expeciencia. Es realmente eficaz y resolutiva, transmite seguridad y conafianza. Estamos muy agradecidos y la recomendamos absolutamente.',
			clientName: 'Usuario de Instagram',
			clientLocation: 'Madrid, España',
			avatar: '/images/review-photo.png'
		},
		{
			id: 2,
			text: 'Erika es una gran profesiuonal y muy cercana. Estaba muy confundida a la hora de elegir una vivienda, y ella me asesoró y ayudó (con gran paciencia), a elegir la vivienda ideal para mí. Fue bastante rápido todo, porque además me ayudo incluso con el papeleo. Y ahora estoy feliz en mi nueva casa. Sin lugar a duda recomiendo a Erika al 100%. Ya no hay profesionales como ella.',
			clientName: 'Usuario de Google',
			clientLocation: 'Madrid, España',
			avatar: '/images/review-photo.png'
		},
		{
			id: 3,
			text: 'No tengo palabras de agradecimiento hacia Erika, inmejorable su profesionalidad y trato. He conseguido lo que buscaba además de aclararme todas las dudas que me han ido surgiendo en cuanto a los papeleos ella se ha ocupado de todo. Gracias Erika por todo, me lo has hecho todo muy fácil.',
			clientName: 'Alicia García P.',
			clientLocation: 'Madrid, España',
			avatar: '/images/review-photo.png'
		},
		{
			id: 4,
			text: 'Gracias al buen trabajo de Erika hemos conseguido llevar a buen puerto la venta de la casa, después de un proceso con algunas dificultades.',
			clientName: 'Pablo R.',
			clientLocation: 'Madrid, España',
			avatar: '/images/review-photo.png'
		},
		{
			id: 5,
			text: 'Qué buen trabajo estás haciendo Erika, me encantan tus publicaciones!!',
			clientName: 'Usuario de Instagram',
			clientLocation: 'Madrid, España',
			avatar: '/images/review-photo.png'
		},
		{
			id: 6,
			text: 'Totalmente recomendada. Necesitaba un apartamento urgente en una semana y me solucionaron el problema. Erika es muy cercana y atenta en todo momento, una gran profesional, estuvo dispuesta incluso en los días festivos, algo que de verdad me sorprendió gratamente. Gracias, si algún día necesito de nuevo algo por Madrid no dudaré en contactar contigo. Un besico.',
			clientName: 'Cristina S.',
			clientLocation: 'Madrid, España',
			avatar: '/images/review-photo.png'
		},
		{
			id: 7,
			text: 'Trato excelente, disponibilidad inmediata para resolver dudas. Seriedad. Buen equipo de trabajo. Gracias Erika y equipo.',
			clientName: 'Laura M.',
			clientLocation: 'Madrid, España',
			avatar: '/images/review-photo.png'
		},
		{
			id: 8,
			text: 'Excelente, me gusta lo que haces y cómo lo haces. Yo hoy puedo decir que tú me inspiraste a entrar en este mundo de los Bienes Raíces!! Lo haces muy bien. 👏👏👏👏',
			clientName: 'Araceli J.',
			clientLocation: 'Madrid, España',
			avatar: '/images/review-photo.png'
		},
		{
			id: 9,
			text: 'Excelente trabajo! Muy profesionales. Me ayudaron a la venta de mi piso desde la negociación hasta la firma. Mis más sinceras felicitaciones a todo el quipo y en especial a Erika.',
			clientName: 'Usuario de Google',
			clientLocation: 'Madrid, España',
			avatar: '/images/review-photo.png'
		}
	];

	const changeTestimonial = newIndex => {
		if (isTransitioning) return;

		setIsTransitioning(true);

		setTimeout(() => {
			setCurrentTestimonial(newIndex);
			setTimeout(() => {
				setIsTransitioning(false);
			}, 50);
		}, 300);
	};

	const nextTestimonial = () => {
		const newIndex =
			currentTestimonial === testimonials.length - 1
				? 0
				: currentTestimonial + 1;
		changeTestimonial(newIndex);
	};

	const prevTestimonial = () => {
		const newIndex =
			currentTestimonial === 0
				? testimonials.length - 1
				: currentTestimonial - 1;
		changeTestimonial(newIndex);
	};

	const currentData = testimonials[currentTestimonial];

	return (
		<StyledContainer>
			<StyledContent>
				<StyledTitle>Nuestros clientes satisfechos</StyledTitle>
				<StyledFlexContainer>
					<StyledSliderContainer>
						<StyledSliderContent>
							{' '}
							<StyledTestimonialDiv>
								<StyledTestimonialText
									className={isTransitioning ? 'fade-out' : ''}
								>
									{currentData.text}
								</StyledTestimonialText>
								<StyledClientInfo className={isTransitioning ? 'fade-out' : ''}>
									<StyledClientAvatar
										src={currentData.avatar}
										alt={currentData.clientName}
									/>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
											gap: '0.5rem',
											height: '100%'
										}}
									>
										<StyledClientName>
											{currentData.clientName}
										</StyledClientName>
										<StyledClientLocation>
											{currentData.clientLocation}
										</StyledClientLocation>
									</div>
								</StyledClientInfo>
								<StyledNavigationContainer>
									<StyledNavigationButton onClick={prevTestimonial}>
										←
									</StyledNavigationButton>
									<StyledNavigationButton onClick={nextTestimonial}>
										→
									</StyledNavigationButton>
								</StyledNavigationContainer>
							</StyledTestimonialDiv>
							<StyledImageDiv>
								<img src='/images/review-photo.png' alt='Interior design' />
							</StyledImageDiv>
						</StyledSliderContent>
					</StyledSliderContainer>
				</StyledFlexContainer>
			</StyledContent>
		</StyledContainer>
	);
};

export default Reviews;
