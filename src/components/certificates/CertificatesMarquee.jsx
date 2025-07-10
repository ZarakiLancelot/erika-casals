import styled, { keyframes } from 'styled-components';

const scroll = keyframes`
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(calc(-100% / 3));
	}
`;

const MarqueeContainer = styled.div`
	width: 100%;
	overflow: hidden;
	background-color: #16243e;
	padding: 2rem 0;
	border-top: 1px solid #e9ecef;
	border-bottom: 1px solid #e9ecef;
`;

const MarqueeWrapper = styled.div`
	display: flex;
	animation: ${scroll} 25s linear infinite;
	gap: 4rem;
	width: fit-content;
`;

const MarqueeItem = styled.div`
	flex-shrink: 0;
	height: 150px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	transition: transform 0.3s ease;

	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 10px;
	}

	@media (max-width: 768px) {
		height: 120px;
	}

	@media (max-width: 480px) {
		height: 100px;
	}
`;

const CertificatesMarquee = () => {
	const certificates = [
		{ id: 1, src: '/images/certificado-1.png', alt: 'Certificado 1' },
		{ id: 2, src: '/images/certificado-2.png', alt: 'Certificado 2' },
		{ id: 3, src: '/images/certificado-3.png', alt: 'Certificado 3' },
		{ id: 4, src: '/images/certificado-4.png', alt: 'Certificado 4' },
		{ id: 5, src: '/images/certificado-5.png', alt: 'Certificado 5' },
		{ id: 6, src: '/images/certificado-6.png', alt: 'Certificado 6' }
	];

	// Triplicamos los certificados para crear un bucle infinito perfecto
	const multipliedCertificates = [
		...certificates,
		...certificates,
		...certificates
	];

	return (
		<MarqueeContainer>
			<MarqueeWrapper>
				{multipliedCertificates.map((certificate, index) => (
					<MarqueeItem key={`${certificate.id}-${index}`}>
						<img src={certificate.src} alt={certificate.alt} />
					</MarqueeItem>
				))}
			</MarqueeWrapper>
		</MarqueeContainer>
	);
};

export default CertificatesMarquee;
