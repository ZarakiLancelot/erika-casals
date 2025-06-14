import styled from 'styled-components';

const StyledContainer = styled.div`
	width: 100%;
	background-color: #f8f8f8;
	padding: 4rem 0;
`;

const StyledContent = styled.div`
	width: 90%;
	max-width: 1200px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 3rem;
`;

const StyledHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 2rem;

	@media (max-width: 768px) {
		flex-direction: column;
		gap: 1rem;
	}
`;

const StyledTitle = styled.h2`
	font-family: 'Space Grotesk', sans-serif;
	font-size: 2.5rem;
	font-weight: 600;
	color: #333;
	margin: 0 0 1rem 0;

	@media (max-width: 768px) {
		font-size: 2rem;
	}
`;

const StyledDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-size: 1.1rem;
	font-weight: 400;
	color: #6b6b6b;
	line-height: 1.6;
	margin: 0;
	max-width: 500px;

	@media (max-width: 768px) {
		font-size: 1rem;
	}
`;

const StyledInstagramIcon = styled.div`
	width: 60px;
	height: 60px;
	color: #333;
	flex-shrink: 0;

	svg {
		width: 100%;
		height: 100%;
	}

	@media (max-width: 768px) {
		width: 50px;
		height: 50px;
	}
`;

const StyledSliderContainer = styled.div`
	position: relative;
	width: 100%;
	overflow: hidden;
`;

const StyledSliderWrapper = styled.div`
	display: flex;
	gap: 1rem;
	transform: translateX(${props => -props.currentSlide * (100 / 3 + 1)}%);
	transition: transform 0.5s ease;
	width: 100%;

	@media (max-width: 768px) {
		transform: translateX(${props => -props.currentSlide * (100 + 2)}%);
	}
`;

const StyledReelItem = styled.div`
	flex: 0 0 calc(33.333% - 0.75rem);
	aspect-ratio: 9/16;
	position: relative;
	border-radius: 12px;
	overflow: hidden;
	cursor: pointer;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: none;
		pointer-events: auto;

		/* Ocultar scrollbars */
		scrollbar-width: none;
		-ms-overflow-style: none;
		&::-webkit-scrollbar {
			display: none;
		}
	}

	.reel-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
		padding: 2rem 1rem 1rem;
		color: white;

		span {
			font-family: 'Montserrat', sans-serif;
			font-size: 0.9rem;
			font-weight: 600;
			text-transform: uppercase;
			line-height: 1.2;
		}
	}

	&:hover {
		transform: translateY(-5px);
		transition: transform 0.3s ease;
	}

	@media (max-width: 768px) {
		flex: 0 0 calc(100% - 1rem);
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
`;

const StyledNavigationContainer = styled.div`
	display: flex;
	gap: 1rem;
	justify-content: flex-start;
	margin-top: 1rem;
	position: relative;
	z-index: 10;
	padding: 1rem;
`;

export {
	StyledContainer,
	StyledContent,
	StyledHeader,
	StyledTitle,
	StyledDescription,
	StyledInstagramIcon,
	StyledSliderContainer,
	StyledSliderWrapper,
	StyledReelItem,
	StyledNavigationButton,
	StyledNavigationContainer
};
