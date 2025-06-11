import styled from 'styled-components';

const StyledContainer = styled.div`
	width: 100%;
	height: 100vh;
	background: url(./images/dark-background.png) no-repeat;
	background-position: 100% 0;
	background-size: cover;

	@media (max-width: 768px) {
		height: auto;
		min-height: 100vh;
		background-position: right center;
	}
`;

const StyledNavbar = styled.nav`
	color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 3rem 0;

	@media (max-width: 768px) {
		padding: 1.5rem 1rem;
		flex-direction: column;
		gap: 1rem;
	}
`;

const StyledNavLeft = styled.div`
	flex: 1;
`;

const StyledButton = styled.button`
	border: none;
	background-color: white;
	border-radius: 20px;
	padding: 0.4rem 1.5rem;
	font-family: 'Montserrat', sans-serif;
	font-weight: 500;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 1rem;
	transition: background-color 0.3s ease;
	justify-self: center;

	&:hover {
		background-color: rgb(167, 196, 250);
	}

	@media (max-width: 768px) {
		padding: 0.6rem 1.2rem;
		font-size: 0.9rem;
		gap: 0.8rem;
		border-radius: 18px;

		img {
			width: 1.2rem !important;
			height: 1.2rem !important;
		}
	}

	@media (max-width: 480px) {
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
		gap: 0.6rem;
	}
`;

const StyledNavCenter = styled.ul`
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 2;
	text-align: center;
	gap: 2rem;

	@media (max-width: 768px) {
		gap: 1rem;
		flex-wrap: wrap;
		order: 2;
	}
`;

const StyledNavLi = styled.li`
	list-style: none;
	color: white;
	cursor: pointer;
	transition: color 0.3s ease;
	font-weight: 300;
	letter-spacing: 1px;

	&:hover {
		color: rgb(167, 196, 250);
	}

	@media (max-width: 768px) {
		font-size: 0.9rem;
	}
`;

const StyledNavRight = styled.div`
	flex: 1;

	@media (max-width: 768px) {
		order: 1;
		flex: none;
	}
`;

const StyledContent = styled.div`
	width: 90%;
	height: 85%;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	align-items: center;

	@media (max-width: 768px) {
		flex-direction: column;
		height: auto;
		width: 95%;
		padding: 2rem 0;
		gap: 2rem;
	}
`;

const StyledFlexContainer = styled.div`
	flex: 1;
	position: relative;

	&:nth-child(2) {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		flex: 2;
	}

	${StyledButton} {
		padding: 0.8rem 2.2rem;
		font-size: 1.2rem;
		border-radius: 30px;

		img {
			width: 2rem;
			height: 2rem;
		}
	}

	@media (max-width: 768px) {
		flex: none;
		width: 100%;

		&:nth-child(2) {
			order: 2;
			gap: 1.5rem;
			padding: 0 1rem;
		}

		&:nth-child(1) {
			order: 1;
		}

		&:nth-child(3) {
			order: 3;
		}

		${StyledButton} {
			padding: 0.7rem 2rem;
			font-size: 1rem;

			img {
				width: 1.5rem;
				height: 1.5rem;
			}
		}
	}
`;

const StyledTitle = styled.h1`
	font-family: 'Space Grotesk', sans-serif;
	font-size: 3.5rem;
	font-weight: 400;
	letter-spacing: 1px;
	color: white;
	text-align: center;

	@media (max-width: 768px) {
		font-size: 2.5rem;
		line-height: 1.2;
		margin: 0;
	}

	@media (max-width: 480px) {
		font-size: 2rem;
	}
`;

const StyledDescription = styled.p`
	width: 50%;
	font-size: 1rem;
	color: white;
	font-family: 'Montserrat', sans-serif;
	font-weight: 300;
	text-align: center;
	margin-top: 1rem;
	letter-spacing: 1px;
	line-height: 2rem;

	@media (max-width: 768px) {
		width: 90%;
		font-size: 0.95rem;
		line-height: 1.8rem;
		margin-top: 0.5rem;
	}

	@media (max-width: 480px) {
		width: 100%;
		font-size: 0.9rem;
		line-height: 1.6rem;
	}
`;

const StyledImage = styled.img`
	width: 100%;
	min-width: 300px;

	@media (max-width: 768px) {
		min-width: 250px;
		max-width: 100%;
		height: auto;
	}

	@media (max-width: 480px) {
		min-width: 200px;
	}
`;

export {
	StyledContainer,
	StyledNavbar,
	StyledNavLeft,
	StyledButton,
	StyledNavCenter,
	StyledNavLi,
	StyledNavRight,
	StyledContent,
	StyledFlexContainer,
	StyledTitle,
	StyledImage,
	StyledDescription
};
