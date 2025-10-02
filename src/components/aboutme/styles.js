import styled from 'styled-components';
import { StyledTitle } from '../pages/home/styles';

const StyledInfoContainer = styled.div`
	width: 80%;
	margin: 0 auto;
	padding: 2rem 0;

	@media (max-width: 1100px) {
		width: 95%;
		padding: 1.5rem 0;
	}

	@media (max-width: 480px) {
		width: 100%;
		padding: 1rem 0;
	}
`;

const StyledInfoContent = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 50px;
	margin-bottom: 3rem;
	position: relative;

	@media (max-width: 1100px) {
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	@media (max-width: 480px) {
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}
`;

const StyledInfoDiv = styled.div`
	&:first-child {
		flex: 0 0 auto;
		position: relative;
		z-index: 2;
		margin-right: -80px;

		@media (max-width: 1100px) {
			margin-right: 0;
			order: 1;
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}

	&:nth-child(2) {
		flex: 1;
		background-color: white;
		padding: 2rem 3rem 2rem 5rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		min-height: auto;
		gap: 20px;

		@media (max-width: 1100px) {
			order: 2;
			padding: 2rem;
			width: 100%;
			/* max-width: 500px; */
			text-align: center;
		}

		@media (max-width: 480px) {
			padding: 1.5rem;
			max-width: 100%;
		}
	}

	img {
		width: 500px;
		height: auto;
		object-fit: cover;
		display: block;

		@media (max-width: 1100px) {
			width: 100%;
			max-width: 400px;
			height: auto;
		}

		@media (max-width: 480px) {
			max-width: 300px;
		}
	}

	${StyledTitle} {
		width: 100%;
		height: fit-content;
		font-size: 2.5rem;
		font-weight: 500;
		color: black;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;

		@media (max-width: 1100px) {
			font-size: 2rem;
			justify-content: center;
			gap: 1rem;
		}

		@media (max-width: 480px) {
			font-size: 1.8rem;
			flex-direction: column;
			gap: 0.5rem;
		}

		img {
			width: 6rem;
			height: 6rem;

			@media (max-width: 1100px) {
				width: 5rem;
				height: 5rem;
			}

			@media (max-width: 480px) {
				width: 4rem;
				height: 4rem;
			}
		}
	}
`;

const StyledDescription = styled.div`
	font-family: 'Montserrat', sans-serif;
	font-weight: 400;
	font-size: 1rem;
	color: #6b6b6b;
	line-height: 1.6;
	margin-top: 1rem;

	@media (max-width: 1100px) {
		font-size: 0.95rem;
		line-height: 1.5;
		text-align: left;
	}

	@media (max-width: 480px) {
		font-size: 0.9rem;
		line-height: 1.4;
	}
`;

const StyledNumbersContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 3rem;
	margin-top: 2rem;
	padding: 0 2rem;

	@media (max-width: 1100px) {
		gap: 2rem;
		margin-top: 1.5rem;
		padding: 0 1rem;
	}

	@media (max-width: 480px) {
		flex-direction: column;
		gap: 1.5rem;
		margin-top: 1rem;
		padding: 0 0.5rem;
	}
`;

const StyledNumbersContent = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	flex: 1;
	gap: 10px;

	@media (max-width: 480px) {
		flex: none;
		width: 100%;
		max-width: 200px;
	}
`;

const StyledNumber = styled.div`
	font-family: 'Space Grotesk', sans-serif;
	font-weight: 700;
	font-size: 3rem;
	font-weight: 500;
	color: black;

	@media (max-width: 1100px) {
		font-size: 2.5rem;
	}

	@media (max-width: 480px) {
		font-size: 2rem;
	}
`;

const StyledNumberDescription = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-weight: 400;
	font-size: 1.2rem;
	color: #6b6b6b;
	text-align: center;

	@media (max-width: 1100px) {
		font-size: 1.1rem;
	}

	@media (max-width: 480px) {
		font-size: 1rem;
	}
`;

// Componentes adicionales para AboutProfile
const ContactInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;

	@media (max-width: 1100px) {
		align-items: center;
	}
`;

const ContactItem = styled.div`
	font-family: 'Montserrat', sans-serif;
	font-size: 14px;
	font-weight: 600;
	color: #16243e;
	display: flex;
	align-items: center;
	gap: 12px;

	img {
		width: 25px;
		height: 25px;
	}

	@media (max-width: 1100px) {
		justify-content: center;
	}

	@media (max-width: 480px) {
		font-size: 13px;
		gap: 10px;

		img {
			width: 22px;
			height: 22px;
		}
	}
`;

const ProfileText = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-size: 1rem;
	line-height: 1.6;
	color: #6b6b6b;
	margin-bottom: 14px;

	&:last-of-type {
		margin-bottom: 0;
	}

	@media (max-width: 1100px) {
		font-size: 0.95rem;
		line-height: 1.5;
	}

	@media (max-width: 480px) {
		font-size: 0.9rem;
		line-height: 1.4;
		margin-bottom: 12px;
	}
`;

const ProfileHighlight = styled.p`
	font-family: 'Montserrat', sans-serif;
	font-size: 1rem;
	font-weight: 600;
	color: #333;
	margin: 16px 0;
	line-height: 1.6;

	@media (max-width: 1100px) {
		font-size: 0.95rem;
		margin: 14px 0;
	}

	@media (max-width: 480px) {
		font-size: 0.9rem;
		margin: 12px 0;
	}
`;

const SocialLinks = styled.div`
	display: flex;
	padding-top: 20px;
	gap: 6px;
	margin: 6px 0 12px 0;

	@media (max-width: 1100px) {
		justify-content: center;
		padding-top: 15px;
	}

	@media (max-width: 480px) {
		padding-top: 10px;
		gap: 8px;
	}
`;

const SocialButton = styled.button`
	width: 28px;
	height: 28px;
	border-radius: 50%;
	padding: 5px;
	background: transparent;
	border: 1px solid #16243e;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	font-size: 15px;
	transition: all 0.3s ease;

	img {
		width: 100%;
		object-fit: contain;
	}

	svg {
		width: 100%;
		height: 100%;
	}

	&:hover {
		background: #16243e;
		transform: scale(1.1);

		img {
			filter: brightness(0) invert(1);
		}

		svg {
			fill: white !important;
		}
	}

	@media (max-width: 480px) {
		width: 32px;
		height: 32px;
		padding: 6px;
	}
`;

const WhatsAppButton = styled.button`
	background: #16243e;
	color: white;
	border: none;
	padding: 8px 16px;
	border-radius: 30px;
	font-family: 'Montserrat', sans-serif;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	margin-top: 25px;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	gap: 14px;
	align-self: flex-start;
	margin-bottom: 40px;

	img {
		width: 30px;
		height: 30px;
		filter: brightness(0) invert(1);
	}

	&:hover {
		background: #0056b3;
		transform: translateY(-2px);
	}

	@media (max-width: 1100px) {
		align-self: center;
		margin-top: 20px;
		margin-bottom: 30px;
	}

	@media (max-width: 480px) {
		padding: 10px 18px;
		font-size: 13px;
		gap: 12px;
		margin-top: 15px;
		margin-bottom: 25px;

		img {
			width: 25px;
			height: 25px;
		}
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
	StyledNumberDescription,
	ContactInfo,
	ContactItem,
	ProfileText,
	ProfileHighlight,
	SocialLinks,
	SocialButton,
	WhatsAppButton
};
