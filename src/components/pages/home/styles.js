import styled from 'styled-components';

const StyledContainer = styled.div`
	width: 100%;
	height: 100vh;
	background: url(/images/dark-background.png) no-repeat;
	background-position: 100% 0;
	background-size: cover;
	/* overflow-x: hidden; */

	@media (max-width: 1200px) {
		background-position: center right;
	}

	@media (max-width: 768px) {
		height: 100vh;

		background-position: right center;
		background-size: cover;
	}

	@media (max-width: 480px) {
		height: 65vh;
		background-position: 75% center;
	}
`;

const StyledNavbar = styled.nav`
	color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.2rem 0;
	background-color: white;

	@media (max-width: 768px) {
		padding: 1.5rem 1rem;
		flex-direction: column;
		gap: 1rem;
	}
`;

const StyledNavLeft = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;

	img {
		width: 100px;
		height: 100px;
	}
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
	color: #16243e;
	font-size: 0.75rem;

	&:hover {
		background-color: rgb(167, 196, 250);
	}

	&.button-nav {
		background-color: #16243e;
		color: white;

		&:hover {
			background-color: rgb(167, 196, 250);
		}
	}

	img {
		width: 1.2rem;
		height: 1.2rem;

		&.img-nav {
			filter: invert(1) brightness(2);
		}
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
	color: #16243e;
	cursor: pointer;
	transition: color 0.3s ease;
	font-weight: 400;
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
	gap: 3rem;

	@media (max-width: 1200px) {
		width: 95%;
		gap: 2rem;
	}

	@media (max-width: 768px) {
		flex-direction: column;
		height: auto;
		width: 95%;
		padding: 2rem 1rem;
		gap: 3rem;
		min-height: auto;
	}

	@media (max-width: 480px) {
		width: 100%;
		padding: 1.5rem 0.8rem;
		gap: 2.5rem;
	}
`;

const StyledFlexContainer = styled.div`
	flex: 1;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;

	&:nth-child(2) {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		flex: 2;
		z-index: 2;
	}

	&:nth-child(1),
	&:nth-child(3) {
		z-index: 1;
	}

	${StyledButton} {
		padding: 0.8rem 2.2rem;
		font-size: 1.2rem;
		border-radius: 30px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
		}

		img {
			width: 2rem;
			height: 2rem;
		}
	}

	@media (max-width: 1200px) {
		&:nth-child(2) {
			gap: 1.8rem;
		}

		${StyledButton} {
			padding: 0.7rem 2rem;
			font-size: 1.1rem;

			img {
				width: 1.8rem;
				height: 1.8rem;
			}
		}
	}
	@media (max-width: 768px) {
		flex: none;
		width: 100%;

		&:nth-child(2) {
			order: 1;
			gap: 2rem;
			padding: 0 1rem;
			text-align: center;
		}

		&:nth-child(1) {
			display: none;
		}

		&:nth-child(3) {
			order: 3;
			max-width: 400px;
		}

		${StyledButton} {
			padding: 0.8rem 2rem;
			font-size: 1rem;
			border-radius: 25px;

			img {
				width: 1.5rem;
				height: 1.5rem;
			}
		}
	}
	@media (max-width: 480px) {
		&:nth-child(2) {
			gap: 1.5rem;
			padding: 0 0.5rem;
		}

		&:nth-child(1),
		&:nth-child(3) {
			display: none;
		}

		&:nth-child(3) {
			max-width: 300px;
		}

		${StyledButton} {
			padding: 0.7rem 1.8rem;
			font-size: 0.95rem;
			border-radius: 22px;

			img {
				width: 1.4rem;
				height: 1.4rem;
			}
		}
	}

	@media (max-width: 360px) {
		${StyledButton} {
			padding: 0.6rem 1.5rem;
			font-size: 0.9rem;

			img {
				width: 1.3rem;
				height: 1.3rem;
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
	margin: 0;
	line-height: 1.2;

	@media (max-width: 1200px) {
		font-size: 3rem;
	}

	@media (max-width: 768px) {
		font-size: 2.5rem;
		line-height: 1.3;
		letter-spacing: 0.5px;
	}

	@media (max-width: 480px) {
		font-size: 2rem;
		line-height: 1.25;
	}

	@media (max-width: 360px) {
		font-size: 1.8rem;
	}
`;

const StyledDescription = styled.p`
	width: 50%;
	font-size: 1rem;
	color: white;
	font-family: 'Montserrat', sans-serif;
	font-weight: 300;
	text-align: center;
	margin: 1rem 0 0 0;
	letter-spacing: 0.5px;
	line-height: 1.8;

	@media (max-width: 1200px) {
		width: 60%;
		font-size: 0.98rem;
	}

	@media (max-width: 768px) {
		width: 90%;
		font-size: 0.95rem;
		line-height: 1.7;
		margin: 0.8rem 0 0 0;
	}

	@media (max-width: 480px) {
		width: 100%;
		font-size: 0.9rem;
		line-height: 1.6;
		margin: 0.6rem 0 0 0;
	}

	@media (max-width: 360px) {
		font-size: 0.85rem;
		line-height: 1.5;
	}
`;

const StyledImage = styled.img`
	width: 100%;
	height: auto;
	min-width: 300px;
	max-width: 500px;
	object-fit: contain;

	@media (max-width: 1200px) {
		min-width: 280px;
		max-width: 450px;
	}

	@media (max-width: 768px) {
		min-width: 100px;
		max-width: 200px;
		width: 90%;
	}

	@media (max-width: 480px) {
		min-width: 200px;
		max-width: 280px;
		width: 85%;
	}

	@media (max-width: 360px) {
		min-width: 180px;
		max-width: 250px;
		width: 80%;
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
