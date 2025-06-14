import styled from 'styled-components';

const StyledContainer = styled.div`
	width: 100%;
	/* height: 65vh; */
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #16243e;
`;

const StyledContent = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	/* gap: 1.3rem; */
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
`;

const StyledCardContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	/* gap: 2rem; */
	padding: 0 9rem;
	height: 500px;
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
