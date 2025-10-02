import styled from 'styled-components';
import Marquee from 'react-fast-marquee';

const MarqueeContainer = styled.div`
	width: 100%;
	background-color: #16243e;
	padding: 2rem 0;
	border-top: 1px solid #e9ecef;
	border-bottom: 1px solid #e9ecef;

	@media (max-width: 768px) {
		padding: 1.5rem 0;
	}

	@media (max-width: 480px) {
		padding: 1rem 0;
	}
`;

const MarqueeItem = styled.div`
	flex-shrink: 0;
	width: 200px;
	height: 150px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	transition: transform 0.3s ease;
	margin-right: 2rem;

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
		width: 180px;
		height: 120px;
		margin-right: 1.5rem;
	}

	@media (max-width: 480px) {
		width: 160px;
		height: 100px;
		margin-right: 1rem;
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

	return (
		<MarqueeContainer>
			<Marquee gradient={false} speed={40} pauseOnHover={true} autoFill={true}>
				{certificates.map(certificate => (
					<MarqueeItem key={certificate.id}>
						<img src={certificate.src} alt={certificate.alt} />
					</MarqueeItem>
				))}
			</Marquee>
		</MarqueeContainer>
	);
};

export default CertificatesMarquee;
