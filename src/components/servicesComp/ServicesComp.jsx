import { Link } from 'react-router-dom';
import { useContentfulProperties } from '../../hooks/useContentfulProperties';
import {
	StyledContainer,
	StyledContent,
	StyledDescription,
	StyledGridContainer,
	StyledServiceButton,
	StyledServiceCard,
	StyledServiceDescription,
	StyledServiceIcon,
	StyledServiceTitle,
	StyledTitle
} from './styles';

const ServicesComp = () => {
	const { properties } = useContentfulProperties();

	const hasFloridaSale = properties.some(p => p.propertyZone === 'Florida' && p.type === 'En venta');
	const hasFloridaRent = properties.some(p => p.propertyZone === 'Florida' && p.type === 'En alquiler');
	const hasCostaeSale = properties.some(p => p.propertyZone === 'Costa' && p.type === 'En venta');
	const hasCostaeRent = properties.some(p => p.propertyZone === 'Costa' && p.type === 'En alquiler');

	return (
		<StyledContainer>
			<StyledContent>
				<StyledTitle>Servicios</StyledTitle>
				<StyledDescription>
					Te ayudo a vender y alquilar con total confianza, tanto en España como
					en Florida. Propiedades seleccionadas, atención personalizada y
					acompañamiento en cada paso.
				</StyledDescription>
				<StyledGridContainer>
					<StyledServiceCard>
						<StyledServiceIcon src='/images/sales.png' alt='En venta' />
						<StyledServiceTitle>En venta</StyledServiceTitle>
						<StyledServiceDescription>
							Propiedades exclusivas listas para entrar a vivir o invertir con
							rentabilidad.
						</StyledServiceDescription>
						<Link to='/sales'>
							<StyledServiceButton as='span'>Ver proyectos</StyledServiceButton>
						</Link>
					</StyledServiceCard>
					<StyledServiceCard>
						<StyledServiceIcon src='/images/rent.png' alt='En alquiler' />
						<StyledServiceTitle>En alquiler</StyledServiceTitle>
						<StyledServiceDescription>
							Propiedades exclusivas listas para entrar a vivir o invertir con
							rentabilidad.
						</StyledServiceDescription>
						<Link to='/rent'>
							<StyledServiceButton as='span'>Ver proyectos</StyledServiceButton>
						</Link>
					</StyledServiceCard>
					<StyledServiceCard>
						<StyledServiceIcon src='/images/miami.png' alt='Florida' />
						<StyledServiceTitle>Florida</StyledServiceTitle>
						<StyledServiceDescription>
							Vivir en Florida es una declaración de estilo de vida. Te muestro
							las zonas que realmente valen la pena.
						</StyledServiceDescription>
						{(hasFloridaSale || hasFloridaRent) && (
							<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
								{hasFloridaSale && (
									<Link to='/sales?location=Florida'>
										<StyledServiceButton as='span' style={{ fontSize: '12px', padding: '8px 12px' }}>
											Venta
										</StyledServiceButton>
									</Link>
								)}
								{hasFloridaRent && (
									<Link to='/rent?location=Florida'>
										<StyledServiceButton as='span' style={{ fontSize: '12px', padding: '8px 12px' }}>
											Alquiler
										</StyledServiceButton>
									</Link>
								)}
							</div>
						)}
					</StyledServiceCard>
					<StyledServiceCard>
						<StyledServiceIcon src='/images/costa.png' alt='Costa Española' />
						<StyledServiceTitle>Costa Española</StyledServiceTitle>
						<StyledServiceDescription>
							A orillas del Mediterráneo hay más que sol: hay hogares con alma.
						</StyledServiceDescription>
						{(hasCostaeSale || hasCostaeRent) && (
							<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
								{hasCostaeSale && (
									<Link to='/sales?location=Costa Española'>
										<StyledServiceButton as='span' style={{ fontSize: '12px', padding: '8px 12px' }}>
											Venta
										</StyledServiceButton>
									</Link>
								)}
								{hasCostaeRent && (
									<Link to='/rent?location=Costa Española'>
										<StyledServiceButton as='span' style={{ fontSize: '12px', padding: '8px 12px' }}>
											Alquiler
										</StyledServiceButton>
									</Link>
								)}
							</div>
						)}
					</StyledServiceCard>
				</StyledGridContainer>
			</StyledContent>
		</StyledContainer>
	);
};

export default ServicesComp;
