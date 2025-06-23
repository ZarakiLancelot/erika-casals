import styled from 'styled-components';

const StyledContainer = styled.div`
	width: 100%;
	background-color: white;
	display: flex;
	justify-content: center;
`;

const StyledContent = styled.div`
	width: 85%;
	display: flex;
	flex-direction: column;
	padding: 4rem 2rem;
	gap: 1rem;

	@media (max-width: 768px) {
		width: 95%;
		padding: 2rem 1rem;
	}

	@media (max-width: 480px) {
		width: 100%;
		padding: 1.5rem 0.5rem;
	}
`;

const StyledTitle = styled.h2`
	font-family: 'Space Grotesk', sans-serif;
	font-weight: 500;
	font-size: 2.5rem;
	color: black;

	@media (max-width: 768px) {
		font-size: 2rem;
		text-align: center;
	}

	@media (max-width: 480px) {
		font-size: 1.8rem;
	}
`;

const StyledDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-weight: 300;
	font-size: 1rem;
	color: #6b6b6b;
	line-height: 1.7;
	max-width: 650px;

	@media (max-width: 768px) {
		text-align: center;
		max-width: 100%;
		font-size: 0.95rem;
	}

	@media (max-width: 480px) {
		font-size: 0.9rem;
		line-height: 1.6;
	}
`;

const StyledGridContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, 1fr);
	row-gap: 4rem;
	column-gap: 8rem;
	margin-top: 2rem;
	justify-content: center;

	@media (max-width: 1024px) {
		column-gap: 4rem;
		row-gap: 3rem;
	}

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
		grid-template-rows: auto;
		row-gap: 2.5rem;
		column-gap: 0;
		margin-top: 1.5rem;
	}

	@media (max-width: 480px) {
		row-gap: 2rem;
		margin-top: 1rem;
	}
`;

const StyledServiceCard = styled.div`
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	transition: transform 0.3s ease;
	gap: 1.2rem;

	&:hover {
		transform: translateY(-5px);
	}

	@media (max-width: 768px) {
		align-items: center;
		text-align: center;
		gap: 1rem;
	}

	@media (max-width: 480px) {
		gap: 0.8rem;
	}
`;

const StyledServiceTitle = styled.h3`
	font-family: 'Space Grotesk', sans-serif;
	font-weight: 500;
	font-size: 1.8rem;
	color: black;
	margin-top: 10px;

	@media (max-width: 768px) {
		font-size: 1.6rem;
		margin-top: 5px;
	}

	@media (max-width: 480px) {
		font-size: 1.4rem;
		margin-top: 0;
	}
`;

const StyledServiceDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-weight: 300;
	font-size: 1rem;
	color: #6b6b6b;
	line-height: 1.5;
	max-width: 450px;

	@media (max-width: 768px) {
		max-width: 100%;
		font-size: 0.95rem;
	}

	@media (max-width: 480px) {
		font-size: 0.9rem;
		line-height: 1.4;
	}
`;

const StyledServiceIcon = styled.img`
	width: 100%;
	height: auto;
	object-fit: contain;

	/* @media (max-width: 768px) {
		max-width: 300px;
		width: 80%;
	}

	@media (max-width: 480px) {
		max-width: 250px;
		width: 90%;
	} */
`;

const StyledServiceButton = styled.a`
	width: fit-content;
	display: block;
	font-family: 'Space Grotesk', sans-serif;
	font-weight: 500;
	color: black;
	text-decoration: none;
	padding-bottom: 0.3rem;
	border-bottom: 1px solid rgb(209, 209, 209);
	transition: all 0.3s ease;

	&:hover {
		border-bottom-color: black;
	}

	@media (max-width: 768px) {
		align-self: center;
		font-size: 0.95rem;
	}

	@media (max-width: 480px) {
		font-size: 0.9rem;
	}
`;

export {
	StyledContainer,
	StyledContent,
	StyledTitle,
	StyledDescription,
	StyledGridContainer,
	StyledServiceCard,
	StyledServiceTitle,
	StyledServiceDescription,
	StyledServiceIcon,
	StyledServiceButton
};
