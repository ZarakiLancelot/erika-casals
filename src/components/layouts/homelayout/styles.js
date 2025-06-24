import styled from 'styled-components';

const StyledWrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	background-color: #f0f0f0;
	overflow-x: hidden; /* Evitar scroll horizontal durante las animaciones */
`;

// Componente para mejorar las transiciones
const AnimatedOutletWrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	position: relative;

	/* Asegurar que las animaciones sean fluidas */
	will-change: transform, opacity;
	backface-visibility: hidden;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
`;

export { StyledWrapper, AnimatedOutletWrapper };
