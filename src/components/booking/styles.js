import styled from 'styled-components';

const StyledContainer = styled.div`
	width: 100%;
	min-height: 100vh;
	background: linear-gradient(to bottom, #ffffff 50%, transparent 50%);
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2rem 0;

	@media (max-width: 768px) {
		min-height: auto;
	}
`;

const StyledContent = styled.div`
	width: 90%;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	/* gap: 1rem; */
`;

const StyledTitle = styled.h1`
	font-family: 'Space Grotesk', sans-serif;
	font-size: 4rem;
	font-weight: 400;
	color: #333;
	margin: 0;
	line-height: 1.2;

	@media (max-width: 768px) {
		font-size: 2rem;
	}
`;

const StyledSubtitle = styled.h2`
	font-family: 'Space Grotesk', sans-serif;
	font-size: 4rem;
	font-weight: 400;
	color: #333;
	margin: 0;
	position: relative;
	margin-bottom: 40px;

	&::after {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 0;
		right: 0;
		height: 3px;
		background-color: #333;
	}

	@media (max-width: 768px) {
		font-size: 1.5rem;
	}
`;

const StyledImageContainer = styled.div`
	width: 65%;
	/* max-width: 500px;
	height: 250px; */
	margin: 1rem 0;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (max-width: 768px) {
		width: 100%;
		height: 200px;
		img {
			object-fit: contain;
		}
	}
`;

const StyledWhatsAppButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	background-color: white;
	border-radius: 50px;
	padding: 0.8rem 2rem;
	cursor: pointer;
	margin-top: 1rem;
	transition: all 0.3s ease;

	&:hover {
		background-color: rgb(167, 196, 250);
		transform: translateY(-2px);
	}
`;

const StyledWhatsAppText = styled.span`
	font-family: 'Montserrat', sans-serif;
	font-size: 1rem;
	font-weight: 500;
	color: #333;
	transition: color 0.3s ease;

	@media (max-width: 768px) {
		font-size: 0.9rem;
	}
`;

const StyledWhatsAppIcon = styled.div`
	width: 24px;
	height: 24px;
	display: flex;
	justify-content: center;
	align-items: center;

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
`;

export {
	StyledContainer,
	StyledContent,
	StyledTitle,
	StyledSubtitle,
	StyledImageContainer,
	StyledWhatsAppButton,
	StyledWhatsAppText,
	StyledWhatsAppIcon
};
