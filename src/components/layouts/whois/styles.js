import styled from 'styled-components';
import { StyledTitle } from '../../pages/home/styles';

const StyledInfoContainer = styled.div`
	width: 80%;
	height: 100%;
	margin: 0 auto;
`;

const StyledInfoContent = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2rem;
	margin: auto;
	position: relative;
	margin-top: 1.2rem;
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
		/* height: 60%; */
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
`;

const StyledDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	height: 100%;
	font-weight: 400;
	font-size: 1.1rem;
	color: #6b6b6b;
	line-height: 1.7;
`;

const StyledNumbersContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 2rem;
	margin-top: 2rem;
`;

const StyledNumbersContent = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	flex: 1;
	gap: 10px;
`;

const StyledNumber = styled.div`
	font-family: 'Space Grotesk', sans-serif;
	font-weight: 700;
	font-size: 3rem;
	font-weight: 500;
	color: black;
`;

const StyledNumberDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-weight: 400;
	font-size: 1.2rem;
	color: #6b6b6b;
	text-align: center;
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
