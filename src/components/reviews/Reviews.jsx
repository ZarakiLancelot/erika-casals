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
			text: 'Working with x was an absolute pleasure. Their team not only understood our vision but exceeded our expectations in every aspect. From conceptualization to execution, they demonstrated unparalleled professionalism, creativity, and attention to detail. Our project in New York City is now a testament to their expertise and commitment to excellence.',
			clientName: 'Jane Doe',
			clientLocation: 'Brooklyn, New York',
			avatar: '/images/review-photo.png'
		},
		{
			id: 2,
			text: 'Exceptional service and outstanding results. The team demonstrated incredible expertise throughout the entire process. They delivered beyond our expectations and made our dream home a reality.',
			clientName: 'Carlos Martinez',
			clientLocation: 'Miami, Florida',
			avatar: '/images/review-photo.png'
		},
		{
			id: 3,
			text: 'Professional, reliable, and extremely knowledgeable. Working with this team was the best decision we made for our property sale. Highly recommended!',
			clientName: 'Sofia Rodriguez',
			clientLocation: 'Barcelona, España',
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
