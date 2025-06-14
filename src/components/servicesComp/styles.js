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
`;

const StyledTitle = styled.h2`
	font-family: 'Space Grotesk', sans-serif;
	font-weight: 500;
	font-size: 2.5rem;
	color: black;
`;

const StyledDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-weight: 300;
	font-size: 1rem;
	color: #6b6b6b;
	line-height: 1.7;
	max-width: 650px;
`;

const StyledGridContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, 1fr);
	row-gap: 4rem;
	column-gap: 8rem;
	margin-top: 2rem;
	justify-content: center;
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
`;

const StyledServiceTitle = styled.h3`
	font-family: 'Space Grotesk', sans-serif;
	font-weight: 500;
	font-size: 1.8rem;
	color: black;
	margin-top: 10px;
`;

const StyledServiceDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-weight: 300;
	font-size: 1rem;
	color: #6b6b6b;
	line-height: 1.5;
	max-width: 450px;
`;

const StyledServiceIcon = styled.img`
	width: 100%;
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
