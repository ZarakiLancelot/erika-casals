import styled from 'styled-components';

const StyledContainer = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;

	@media (max-width: 768px) {
		height: auto;
		min-height: 100vh;
		background-position: right center;
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

const StyledContentContainer = styled.div`
	width: 100%;
	height: 100%;
	margin: 0 auto;
`;

const StyledContentDiv = styled.div`
	display: flex;
	justify-content: ${props => (props.reverse ? 'flex-end' : 'flex-start')};
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

const StyledPropertyDiv = styled.div`
	width: 52%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: rgb(255, 255, 255);
	padding: 3rem 3rem;
	position: relative;
	z-index: 2;
	order: ${props => (props.reverse ? 2 : 1)};

	@media (max-width: 768px) {
		width: 100%;
		max-width: 500px;
		order: 2;
		padding: 2rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	@media (max-width: 480px) {
		padding: 1.5rem;
		max-width: 100%;
	}
`;

const StyledImageDiv = styled.div`
	position: absolute;
	top: 0;
	right: ${props => (props.reverse ? 'auto' : '0')};
	left: ${props => (props.reverse ? '0' : 'auto')};
	width: 55%;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	order: ${props => (props.reverse ? 1 : 2)};

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (max-width: 768px) {
		position: relative;
		width: 100%;
		max-width: 400px;
		height: 300px;
		overflow: hidden;
		order: 1;
		top: auto;
		right: auto;
		left: auto;

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

const StyledPropertyText = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-weight: 400;
	font-size: 1.1rem;
	color: #6b6b6b;
	line-height: 1.7;
	margin-bottom: 2rem;

	@media (max-width: 768px) {
		font-size: 1rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
		text-align: left;
	}

	@media (max-width: 480px) {
		font-size: 0.95rem;
		line-height: 1.5;
		margin-bottom: 1rem;
	}
`;

const StyledPropertyInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1rem;

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

const StyledPropertyAvatar = styled.img`
	width: 70px;
	height: 70px;
	border-radius: 50%;
	object-fit: cover;

	@media (max-width: 480px) {
		width: 60px;
		height: 60px;
	}
`;

const StyledPropertyName = styled.h4`
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

const StyledPropertyLocation = styled.p`
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

const StyledViewButton = styled.button`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 1rem 2rem;
	background-color: rgba(255, 255, 255, 0.75);
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
		padding: 0.8rem 1.5rem;
		font-size: 1rem;
		border-radius: 25px;
	}

	@media (max-width: 480px) {
		padding: 0.7rem 1.2rem;
		font-size: 0.9rem;
		border-radius: 20px;
	}
`;

export {
	StyledContainer,
	StyledContent,
	StyledTitle,
	StyledFlexContainer,
	StyledContentContainer,
	StyledContentDiv,
	StyledImageDiv,
	StyledPropertyDiv,
	StyledPropertyText,
	StyledPropertyInfo,
	StyledPropertyName,
	StyledPropertyLocation,
	StyledPropertyAvatar,
	StyledViewButton
};
