import styled from 'styled-components';

const StyledContainer = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	background: #f8f9fa;
	position: relative;

	@media (max-width: 768px) {
		height: auto;
		min-height: 100vh;
	}
`;

const StyledContent = styled.div`
	width: 90%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;
	padding: 5rem 2rem;

	@media (max-width: 768px) {
		width: 95%;
		padding: 3rem 1rem;
		gap: 1.5rem;
	}

	@media (max-width: 480px) {
		width: 100%;
		padding: 2rem 0.5rem;
	}
`;

const StyledTitle = styled.h1`
	font-family: 'Space Grotesk', sans-serif;
	font-size: 2.5rem;
	font-weight: 600;
	text-align: center;
	color: #333;

	@media (max-width: 768px) {
		font-size: 2rem;
	}

	@media (max-width: 480px) {
		font-size: 1.8rem;
	}
`;

const StyledFlexContainer = styled.div`
	width: 100%;
	height: 100%;
`;

const StyledSliderContainer = styled.div`
	width: 100%;
	height: 100%;
	margin: 0 auto;
`;

const StyledSliderContent = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 2rem;
	margin: auto;
	margin-top: 1.2rem;
	position: relative;
	height: 100%;
	padding-bottom: 5rem;

	@media (max-width: 768px) {
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		height: auto;
		gap: 2rem;
		padding-bottom: 3rem;
	}

	@media (max-width: 480px) {
		padding: 0.5rem;
		gap: 1.5rem;
	}
`;

const StyledTestimonialDiv = styled.div`
	width: 52%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: rgb(255, 255, 255);
	padding: 3rem 3rem;
	position: relative;
	z-index: 2;
	height: 450px;

	@media (max-width: 768px) {
		width: 100%;
		max-width: 500px;
		height: auto;
		padding: 2rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		order: 2;
	}

	@media (max-width: 480px) {
		padding: 1.5rem;
		max-width: 100%;
	}
`;

const StyledImageDiv = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	width: 55%;
	/* height: 100%; */
	z-index: 1;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 1;
		transform: scale(1);
		transition: opacity 0.3s ease, transform 0.3s ease;

		&.fade-out {
			opacity: 0;
			transform: scale(0.95);
		}
	}

	@media (max-width: 768px) {
		position: relative;
		width: 100%;
		max-width: 400px;
		height: 300px;
		overflow: hidden;
		order: 1;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	@media (max-width: 480px) {
		height: 250px;
		max-width: 100%;
	}
`;

const StyledTestimonialText = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-weight: 400;
	font-size: 1.1rem;
	color: #6b6b6b;
	line-height: 1.7;
	margin-bottom: 2rem;
	opacity: 1;
	transform: translateX(0);
	transition: opacity 0.3s ease, transform 0.3s ease;

	&.fade-out {
		opacity: 0;
		transform: translateX(-20px);
	}

	@media (max-width: 768px) {
		font-size: 1rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	@media (max-width: 480px) {
		font-size: 0.95rem;
		line-height: 1.5;
		margin-bottom: 1rem;
	}
`;

const StyledClientInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1rem;
	opacity: 1;
	transform: translateX(0);
	transition: opacity 0.3s ease, transform 0.3s ease;

	&.fade-out {
		opacity: 0;
		transform: translateX(-20px);
	}

	@media (max-width: 768px) {
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	@media (max-width: 480px) {
		flex-direction: column;
		text-align: center;
		gap: 0.5rem;
	}
`;

const StyledClientAvatar = styled.img`
	width: 70px;
	height: 70px;
	border-radius: 50%;
	object-fit: cover;

	@media (max-width: 480px) {
		width: 60px;
		height: 60px;
	}
`;

const StyledClientName = styled.h4`
	font-family: 'Space Grotesk', sans-serif;
	font-weight: 600;
	font-size: 1.1rem;
	color: #333;
	margin: 0;

	@media (max-width: 768px) {
		font-size: 1rem;
	}

	@media (max-width: 480px) {
		font-size: 0.95rem;
	}
`;

const StyledClientLocation = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-weight: 400;
	font-size: 0.9rem;
	color: #6b6b6b;
	margin: 0;

	@media (max-width: 768px) {
		font-size: 0.85rem;
	}

	@media (max-width: 480px) {
		font-size: 0.8rem;
	}
`;

const StyledNavigationButton = styled.button`
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background-color: #333;
	color: white;
	border: none;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.2rem;
	transition: all 0.3s ease;

	&:hover {
		background-color: #555;
		transform: scale(1.1);
	}

	&:active {
		transform: scale(0.95);
	}

	@media (max-width: 768px) {
		width: 50px;
		height: 50px;
		font-size: 1rem;
	}

	@media (max-width: 480px) {
		width: 45px;
		height: 45px;
		font-size: 0.9rem;
	}
`;

const StyledNavigationContainer = styled.div`
	display: flex;
	gap: 1rem;
	margin-top: 2rem;
	position: absolute;
	bottom: -80px;
	left: 2rem;
	z-index: 3;

	@media (max-width: 768px) {
		position: relative;
		bottom: auto;
		left: auto;
		justify-content: center;
		margin-top: 1.5rem;
	}

	@media (max-width: 480px) {
		gap: 0.8rem;
		margin-top: 1rem;
	}
`;

export {
	StyledContainer,
	StyledContent,
	StyledTitle,
	StyledFlexContainer,
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
};
