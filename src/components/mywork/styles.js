import styled from 'styled-components';

const StyledContainer = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #16243e;
	padding: 2rem 0;

	@media (max-width: 768px) {
		padding: 1rem 0;
	}
`;

const StyledContent = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	@media (max-width: 768px) {
		width: 95%;
	}

	@media (max-width: 480px) {
		width: 100%;
	}
`;

const StyledTitle = styled.h1`
	width: 100%;
	font-family: 'Space Grotesk', sans-serif;
	font-weight: 500;
	font-size: 3rem;
	margin-top: 2rem;
	padding: 2rem;
	border-top: 1px solid #333333;
	border-bottom: 1px solid #333333;
	color: white;
	padding-left: 10rem;

	@media (max-width: 1200px) {
		font-size: 2.5rem;
		padding-left: 6rem;
	}

	@media (max-width: 768px) {
		font-size: 2.2rem;
		padding: 2rem 2rem;
		text-align: center;
		margin-top: 1rem;
	}

	@media (max-width: 480px) {
		font-size: 1.8rem;
		padding: 1.5rem 1rem;
		margin-top: 0.5rem;
	}

	@media (max-width: 360px) {
		font-size: 1.6rem;
	}
`;

const StyledCardContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	padding: 0 9rem;
	height: 500px;

	@media (max-width: 1200px) {
		padding: 0 4rem;
		height: auto;
		min-height: 450px;
	}

	@media (max-width: 768px) {
		flex-direction: column;
		padding: 0 2rem;
		height: auto;
		gap: 0;
	}

	@media (max-width: 480px) {
		padding: 0 1rem;
	}
`;

const StyledCard = styled.div`
	flex: 1;
	height: 100%;
	padding: 3rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	flex-wrap: wrap;
	gap: 30px;
	border-left: 1px solid #333333;
	border-right: 1px solid #333333;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #29364d;
	}

	@media (max-width: 1200px) {
		padding: 2.5rem 2rem;
		gap: 25px;
	}

	@media (max-width: 768px) {
		flex: none;
		width: 100%;
		height: auto;
		min-height: 300px;
		padding: 2.5rem 2rem;
		border-left: none;
		border-right: none;
		border-top: 1px solid #333333;
		border-bottom: 1px solid #333333;
		justify-content: flex-start;
		gap: 20px;

		&:first-child {
			border-top: none;
		}

		&:last-child {
			border-bottom: none;
		}
	}

	@media (max-width: 480px) {
		padding: 2rem 1.5rem;
		min-height: 280px;
		gap: 18px;
	}

	@media (max-width: 360px) {
		padding: 1.5rem 1rem;
		min-height: 260px;
		gap: 15px;
	}
`;

const StyledCardIcon = styled.img`
	width: 4rem;
	height: 4rem;
`;

const StyledCardTitle = styled.h2`
	font-family: 'Space Grotesk', sans-serif;
	font-weight: 500;
	font-size: 1.6rem;
	height: 4rem;
	color: white;
`;

const StyledCardDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-weight: 300;
	font-size: 1.2rem;
	color: white;
	height: 7rem;
`;

export {
	StyledContainer,
	StyledContent,
	StyledTitle,
	StyledCardContainer,
	StyledCard,
	StyledCardIcon,
	StyledCardTitle,
	StyledCardDescription
};
