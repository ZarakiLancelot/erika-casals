import styled from 'styled-components';

const StyledFooterContainer = styled.footer`
	width: 100%;
	background-color: #16243e;
	display: flex;
	flex-direction: column;
	height: 100vh;
`;

const StyledTopSection = styled.div`
	width: 100%;
	height: 50%;
	background-image: url('/images/image-footer.png');
	background-size: 100% cover;
	background-position: right bottom;
	background-repeat: no-repeat;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 0 10%;
	border-bottom: 1px solid #34495e;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		/* background: rgba(44, 62, 80, 0.8); */
		z-index: 1;
	}
`;

const StyledTopContent = styled.div`
	position: relative;
	z-index: 2;
	color: white;
	max-width: 600px;
`;

const StyledTitle = styled.h2`
	width: 100%;
	font-family: 'Space Grotesk', sans-serif;
	font-size: 3rem;
	font-weight: 500;
	color: white;
	margin-bottom: 1.5rem;
	line-height: 1.2;

	@media (max-width: 768px) {
		font-size: 2rem;
	}
`;

const StyledDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-size: 1rem;
	font-weight: 400;
	color: #bdc3c7;
	line-height: 1.6;
	margin-bottom: 2rem;
`;

const StyledContactButton = styled.button`
	background-color: white;
	color: black;
	padding: 12px 46px;
	border-radius: 25px;
	font-family: 'Montserrat', sans-serif;
	font-size: 1.1rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	border: none;
	display: flex;
	align-items: center;
	gap: 0.8rem;

	&:hover {
		background-color: rgb(167, 196, 250);
		color: #2c3e50;
	}

	img {
		width: 1.5rem;
	}
`;

const StyledBottomSection = styled.div`
	width: 90%;
	height: 50%;
	padding: 3rem 5%;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin: 0 auto;

	@media (max-width: 768px) {
		flex-direction: column;
		gap: 2rem;
		height: auto;
		padding: 3rem 5%;
	}
`;

const StyledLeftBottom = styled.div`
	display: flex;
	flex-direction: column;
	gap: 3rem;
	max-width: 400px;
`;

const StyledBottomDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-size: 0.9rem;
	font-weight: 400;
	color: #bdc3c7;
	line-height: 1.6;
`;

const StyledSocialIcons = styled.div`
	display: flex;
	gap: 1rem;
	margin-top: 1rem;
`;

const StyledSocialIcon = styled.a`
	width: 50px;
	height: 50px;
	background-color: transparent;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	transition: all 0.3s ease;
	text-decoration: none;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

	&:hover {
		background-color: white;
		color: #2c3e50;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	svg {
		width: 22px;
		height: 22px;
	}
`;

const StyledRightBottom = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const StyledQuickLinksTitle = styled.h4`
	font-family: 'Space Grotesk', sans-serif;
	font-size: 1.5rem;
	font-weight: 400;
	color: white;
	margin-bottom: 1rem;
`;

const StyledQuickLinks = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;
`;

const StyledQuickLink = styled.a`
	font-family: 'Montserrat', sans-serif;
	font-size: 1rem;
	color: #bdc3c7;
	text-decoration: none;
	transition: color 0.3s ease;

	&:hover {
		color: white;
	}
`;

const StyledCopyright = styled.div`
	width: 100%;
	background-color: #2c3e50;
	padding: 1rem 5%;
	border-top: 1px solid #34495e;
	text-align: center;
`;

const StyledCopyrightText = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-size: 0.8rem;
	color: #7f8c8d;
	margin: 0;
`;

export {
	StyledFooterContainer,
	StyledTopSection,
	StyledTopContent,
	StyledTitle,
	StyledDescription,
	StyledContactButton,
	StyledBottomSection,
	StyledLeftBottom,
	StyledBottomDescription,
	StyledSocialIcons,
	StyledSocialIcon,
	StyledRightBottom,
	StyledQuickLinksTitle,
	StyledQuickLinks,
	StyledQuickLink,
	StyledCopyright,
	StyledCopyrightText
};
