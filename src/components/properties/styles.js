import styled from 'styled-components';

// Navegación
export const StyledNavbar = styled.nav`
	color: white;
	display: flex;
	background-color: #16243e;
	justify-content: space-between;
	align-items: center;
	padding: 3rem 0;
	position: relative;
	z-index: 10;

	@media (max-width: 768px) {
		padding: 1.5rem 1rem;
		flex-direction: column;
		gap: 1rem;
	}
`;

export const StyledNavLeft = styled.div`
	flex: 1;
`;

export const StyledNavCenter = styled.ul`
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

export const StyledNavLi = styled.li`
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

export const StyledNavRight = styled.div`
	flex: 1;

	@media (max-width: 768px) {
		order: 1;
		flex: none;
	}
`;

export const StyledButton = styled.button`
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
	font-size: 12px;

	&:hover {
		background-color: rgb(167, 196, 250);
	}

	img {
		width: 1.2rem;
		height: 1.2rem;
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

export const PropertiesContainer = styled.div`
	min-height: 100vh;
	background: #f5f5f5;
	position: relative;
`;

export const ContentWrapper = styled.div`
	position: relative;
	z-index: 2;
	padding: 0;
`;

export const HeaderSection = styled.div`
	font-family: 'Space Grotesk', sans-serif;
	font-weight: 500;
	height: 40vh;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	padding: 0 60px;
	position: relative;
	background: rgba(22, 36, 62, 0.8);

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url('/images/property-title-background.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		z-index: 0;
	}

	&:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 20, 41, 0.7);
		z-index: 1;
	}

	h1 {
		color: white;
		font-size: 4rem;
		font-weight: 300;
		margin: 0;
		padding: 40px 0;
		letter-spacing: 2px;
		text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
		position: relative;
		z-index: 2;

		@media (max-width: 768px) {
			font-size: 2.5rem;
		}
	}
`;

export const MainContainer = styled.div`
	display: flex;
	width: 80%;
	margin: 0 auto;
	gap: 30px;
	padding: 60px 20px 60px 20px;

	@media (max-width: 1024px) {
		flex-direction: column;
		gap: 20px;
	}

	@media (max-width: 768px) {
		width: 100%;
		padding: 40px 10px 40px 10px;
	}

	@media (max-width: 480px) {
		padding: 30px 5px 30px 5px;
	}
`;

export const FilterSidebar = styled.div`
	width: 350px;
	flex-shrink: 0;

	@media (max-width: 1024px) {
		width: 100%;
	}
`;

export const FilterCard = styled.div`
	background: rgba(255, 255, 255, 0.95);
	border-radius: 0;
	padding: 25px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(10px);
`;

export const FilterTitle = styled.h3`
	color: #2c5aa0;
	font-size: 16px;
	font-weight: 600;
	margin: 0 0 20px 0;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

export const FilterTabs = styled.div`
	display: flex;
	background: #f8f9fa;
	border-radius: 0;
	margin-bottom: 25px;
	overflow: hidden;
`;

export const FilterTab = styled.button`
	flex: 1;
	padding: 12px 16px;
	border: none;
	background: ${props => (props.active ? '#2c5aa0' : 'transparent')};
	color: ${props => (props.active ? 'white' : '#666')};
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: ${props => (props.active ? '#2c5aa0' : '#e9ecef')};
	}
`;

export const FilterGroup = styled.div`
	margin-bottom: 20px;

	&:last-child {
		margin-bottom: 0;
	}
`;

export const FilterLabel = styled.label`
	display: block;
	color: #333;
	font-size: 14px;
	font-weight: 500;
	margin-bottom: 8px;
`;

export const FilterSelect = styled.select`
	width: 100%;
	padding: 12px;
	border: 1px solid #ddd;
	border-radius: 0;
	font-size: 14px;
	background: white;
	color: #333;

	&:focus {
		outline: none;
		border-color: #2c5aa0;
		box-shadow: 0 0 0 2px rgba(44, 90, 160, 0.1);
	}
`;

export const FilterInput = styled.input`
	width: 100%;
	padding: 12px;
	border: 1px solid #ddd;
	border-radius: 0;
	font-size: 14px;

	&:focus {
		outline: none;
		border-color: #2c5aa0;
		box-shadow: 0 0 0 2px rgba(44, 90, 160, 0.1);
	}
`;

export const PriceRangeGroup = styled.div`
	display: flex;
	gap: 10px;
	align-items: center;
`;

export const PriceInput = styled(FilterInput)`
	flex: 1;
`;

export const PriceSeparator = styled.span`
	color: #666;
	font-size: 14px;
`;

export const PropertiesSection = styled.div`
	flex: 1;
	min-width: 0;
`;

export const ResultsHeader = styled.div`
	background: rgba(255, 255, 255, 0.95);
	border-radius: 0;
	padding: 20px 25px;
	margin-bottom: 20px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(10px);
`;

export const ResultsCount = styled.h2`
	color: #2c5aa0;
	font-size: 18px;
	font-weight: 600;
	margin: 0;
`;

export const PropertiesGrid = styled.div`
	display: flex;
	flex-direction: column;
	gap: 15px;
`;

export const PropertyCard = styled.div`
	background: white;
	border-radius: 0;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	cursor: pointer;
	display: flex;
	height: 280px;

	&:hover {
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
	}

	@media (max-width: 768px) {
		flex-direction: column;
		height: auto;
	}
`;

export const PropertyImage = styled.div`
	width: 360px;
	height: 280px;
	background-image: url(${props => props.src});
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	position: relative;
	flex-shrink: 0;

	@media (max-width: 768px) {
		width: 100%;
		height: 200px;
		flex-shrink: 0;
	}
`;

// Loader para imágenes
export const ImageLoader = styled.div`
	width: 360px;
	height: 280px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: loading 1.5s infinite;
	position: relative;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;

	@keyframes loading {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	&::after {
		content: '';
		width: 40px;
		height: 40px;
		border: 3px solid #e0e0e0;
		border-top: 3px solid #2c5aa0;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		width: 100%;
		height: 200px;
		flex-shrink: 0;
	}
`;

export const PropertyContent = styled.div`
	padding: 20px 25px;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;

	@media (max-width: 768px) {
		padding: 15px 20px;
		min-height: 200px;
	}
`;

export const PropertyTitle = styled.h3`
	font-family: 'Space Grotesk', sans-serif;
	color: rgb(0, 0, 0);
	font-size: 18px;
	font-weight: 600;
	margin: 0 0 10px 0;
	line-height: 1.3;

	@media (max-width: 768px) {
		font-size: 16px;
		margin: 0 0 8px 0;
	}
`;

export const PropertyPrice = styled.div`
	font-family: 'Space Grotesk', sans-serif;
	color: #16243e;
	font-size: 18px;
	font-weight: 400;
	margin-bottom: 10px;
	display: flex;
	align-items: baseline;
	gap: 10px;

	span {
		color: #16243e;
		font-size: 1rem;
		font-weight: normal;
	}

	@media (max-width: 768px) {
		font-size: 16px;
		margin-bottom: 8px;
		flex-wrap: wrap;
		gap: 5px;

		span {
			font-size: 0.9rem;
		}
	}
`;

export const PropertyDescription = styled.p`
	font-family: 'Space Grotesk', sans-serif;
	color: #6b6b6b;
	font-size: 15px;
	line-height: 1.5;
	margin: 0 0 15px 0;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	flex: 1;

	@media (max-width: 768px) {
		font-size: 14px;
		line-height: 1.4;
		margin: 0 0 12px 0;
		-webkit-line-clamp: 2;
	}
`;

export const PropertyBottom = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: auto;
`;

export const PropertyFeatures = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	color: #666;
	font-size: 12px;

	@media (max-width: 768px) {
		gap: 6px;
		flex-wrap: wrap;
	}
`;

export const PropertyFeature = styled.span`
	font-family: 'Space Grotesk', sans-serif;
	/* background: #f8f9fa; */
	align-self: last baseline;
	font-weight: 400;
	border-radius: 0;
	font-size: 14px;
	color: #16243e;

	@media (max-width: 768px) {
		font-size: 13px;
	}
`;

export const PropertyIcon = styled.div`
	position: absolute;
	top: 20px;
	right: 20px;
	width: 36px;
	height: 36px;
	background: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	font-size: 16px;
	color: #666;

	&:before {
		content: '🏠';
	}

	@media (max-width: 768px) {
		top: 15px;
		right: 15px;
		width: 32px;
		height: 32px;
		font-size: 14px;
	}
`;

export const LoadingSpinner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200px;
	color: #16143e;
	font-size: 18px;

	&:after {
		content: '';
		width: 40px;
		height: 40px;
		border: 4px solid rgba(99, 99, 99, 0.4);
		border-top: 4px solid #16143e;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-left: 20px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

export const ErrorMessage = styled.div`
	text-align: center;
	padding: 40px;
	color: #ff6b6b;
	font-size: 18px;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 8px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

export const EmptyState = styled.div`
	text-align: center;
	padding: 60px 20px;
	color: white;

	h3 {
		font-size: 24px;
		margin-bottom: 16px;
	}

	p {
		font-size: 16px;
		opacity: 0.8;
	}
`;
