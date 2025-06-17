import styled from 'styled-components';

const StyledContainer = styled.div`
	width: 100%;
	background-color: rgb(255, 255, 255);
	padding: 4rem 0;

	@media (max-width: 768px) {
		padding: 2rem 0;
	}
`;

const StyledContent = styled.div`
	width: 85%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 4rem;

	@media (max-width: 768px) {
		gap: 3rem;
	}
`;

const StyledSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 3rem;
	width: 100%;
`;

const StyledSectionTitle = styled.h2`
	font-family: 'Space Grotesk', sans-serif;
	font-size: 2.5rem;
	font-weight: 700;
	color: #333;
	text-align: center;
	margin: 0;
	padding: 0 2rem;
	margin-bottom: 1rem;

	@media (max-width: 768px) {
		font-size: 2rem;
		padding: 0 1rem;
	}
`;

const StyledImageContainer = styled.div`
	position: relative;
	width: 100%;

	@media (max-width: 768px) {
		height: 300px;
	}
`;

const StyledImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const StyledViewButton = styled.button`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 1rem 2.5rem;
	background-color: rgba(255, 255, 255, 0.74);
	color: black;
	border: none;
	border-radius: 30px;
	font-family: 'Space Grotesk', sans-serif;
	font-size: 1.1rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	z-index: 3;
	backdrop-filter: blur(5px);

	&:hover {
		background-color: rgb(255, 255, 255);
		transform: translate(-50%, -50%) scale(1.05);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
	}

	&:active {
		transform: translate(-50%, -50%) scale(0.95);
	}

	@media (max-width: 768px) {
		padding: 0.8rem 2rem;
		font-size: 1rem;
	}
`;

const StyledDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-size: 1.1rem;
	line-height: 1.8;
	color: #6b6b6b;

	@media (max-width: 768px) {
		font-size: 1rem;
		line-height: 1.6;
		padding: 0 1rem;
	}
`;

export {
	StyledContainer,
	StyledContent,
	StyledSection,
	StyledSectionTitle,
	StyledImageContainer,
	StyledImage,
	StyledViewButton,
	StyledDescription
};
