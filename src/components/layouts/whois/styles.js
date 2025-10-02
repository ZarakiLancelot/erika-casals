import styled from 'styled-components';
import { StyledTitle } from '../../pages/home/styles';

const StyledInfoContainer = styled.div`
	width: 80%;
	height: 100%;
	margin: 0 auto;
	padding: 2rem 0;

	@media (max-width: 1500px) {
		width: 90%;
	}

	@media (max-width: 1100px) {
		width: 95%;
		padding: 1rem 0;
		height: auto;
	}

	@media (max-width: 480px) {
		width: 100%;
		padding: 0.5rem 0;
	}
`;

const StyledInfoContent = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2rem;
	margin: auto;
	position: relative;
	margin-top: 1.2rem;

	@media (max-width: 1500px) {
		padding: 1.5rem;
	}

	@media (max-width: 1100px) {
		flex-direction: column;
		padding: 1rem;
		margin-top: 0;
		position: static;
		gap: 2rem;
	}

	@media (max-width: 480px) {
		padding: 0.5rem;
		gap: 1.5rem;
	}
`;

const StyledInfoDiv = styled.div`
	flex: 1;
	display: flex;

	&:nth-child(2) {
		position: absolute;
		flex-direction: column;
		top: 50%;
		left: 40%;
		right: 0;
		transform: translateY(-50%);
		background-color: rgb(255, 255, 255);
		padding: 1rem 4rem;
		z-index: 2;
		padding-bottom: 4rem;
	}

	img {
		width: 45%;
		object-fit: cover;
	}

	${StyledTitle} {
		width: 100%;
		height: fit-content;
		font-size: 3rem;
		font-weight: 500;
		color: black;
		display: flex;
		justify-content: space-between;
		align-items: center;

		img {
			width: 8rem;
			height: 8rem;
		}
	}

	@media (max-width: 1500px) {
		&:nth-child(2) {
			/* left: 35%; */
			padding: 1rem 3rem;
			padding-bottom: 3rem;
		}

		${StyledTitle} {
			font-size: 2.5rem;

			img {
				width: 6rem;
				height: 6rem;
			}
		}
	}

	@media (max-width: 1100px) {
		flex: none;
		width: 100%;

		&:nth-child(1) {
			order: 1;
		}

		&:nth-child(2) {
			order: 2;
			position: static;
			transform: none;
			background-color: white;
			padding: 2rem 1.5rem;
			margin-top: -3rem;
			/* border-radius: 12px; */
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
			z-index: 2;
		}

		img {
			width: 100%;
			max-width: 400px;
			margin: 0 auto;
		}

		${StyledTitle} {
			font-size: 2.2rem;
			flex-direction: column;
			gap: 1rem;
			text-align: center;

			img {
				width: 5rem;
				height: 5rem;
			}
		}
	}

	@media (max-width: 480px) {
		&:nth-child(2) {
			padding: 1.5rem 1rem;
			margin-top: -2rem;
		}

		img {
			max-width: 320px;
		}

		${StyledTitle} {
			font-size: 1.8rem;

			img {
				width: 4rem;
				height: 4rem;
			}
		}
	}

	@media (max-width: 360px) {
		&:nth-child(2) {
			padding: 1rem 0.8rem;
		}

		${StyledTitle} {
			font-size: 1.6rem;

			img {
				width: 3.5rem;
				height: 3.5rem;
			}
		}
	}
`;

const StyledDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	height: 100%;
	font-weight: 400;
	font-size: 1.1rem;
	color: #6b6b6b;
	line-height: 1.7;
	margin: 0;

	@media (max-width: 1500px) {
		font-size: 1rem;
		line-height: 1.6;
	}

	@media (max-width: 1100px) {
		font-size: 0.95rem;
		line-height: 1.6;
		text-align: left;
	}

	@media (max-width: 480px) {
		font-size: 0.9rem;
		line-height: 1.5;
	}

	@media (max-width: 360px) {
		font-size: 0.85rem;
	}
`;

const StyledNumbersContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 2rem;
	margin-top: 2rem;

	@media (max-width: 1100px) {
		flex-direction: column;
		gap: 2.5rem;
		margin-top: 3rem;
	}

	@media (max-width: 480px) {
		gap: 2rem;
		margin-top: 2rem;
	}
`;

const StyledNumbersContent = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	flex: 1;
	gap: 10px;

	@media (max-width: 1100px) {
		flex: none;
		width: 100%;
		max-width: 300px;
	}
`;

const StyledNumber = styled.div`
	font-family: 'Space Grotesk', sans-serif;
	font-weight: 700;
	font-size: 3rem;
	font-weight: 500;
	color: black;

	@media (max-width: 1500px) {
		font-size: 2.5rem;
	}

	@media (max-width: 1100px) {
		font-size: 2.8rem;
	}

	@media (max-width: 480px) {
		font-size: 2.2rem;
	}

	@media (max-width: 360px) {
		font-size: 2rem;
	}
`;

const StyledNumberDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-weight: 400;
	font-size: 1.2rem;
	color: #6b6b6b;
	text-align: center;
	margin: 0;

	@media (max-width: 1500px) {
		font-size: 1.1rem;
	}

	@media (max-width: 1100px) {
		font-size: 1rem;
	}

	@media (max-width: 480px) {
		font-size: 0.95rem;
	}

	@media (max-width: 360px) {
		font-size: 0.9rem;
	}
`;

export {
	StyledInfoContainer,
	StyledInfoDiv,
	StyledDescription,
	StyledInfoContent,
	StyledTitle,
	StyledNumbersContainer,
	StyledNumbersContent,
	StyledNumber,
	StyledNumberDescription
};
