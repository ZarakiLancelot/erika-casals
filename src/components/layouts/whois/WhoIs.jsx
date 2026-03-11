import { StyledTitle } from '../../pages/home/styles';
import {
	StyledDescription,
	StyledInfoContainer,
	StyledInfoContent,
	StyledInfoDiv,
	StyledNumber,
	StyledNumberDescription,
	StyledNumbersContainer,
	StyledNumbersContent
} from './styles';

const WhoIs = () => {
	return (
		<StyledInfoContainer>
			<StyledInfoContent>
				<StyledInfoDiv>
					<img src='/images/erika.jpeg' alt='Who is Erika Casals' />
				</StyledInfoDiv>
				<StyledInfoDiv>
					<StyledTitle>
						Quién es Erika Casals
						<img src='/images/logo-whois.png' alt='' />
					</StyledTitle>
					<StyledDescription>
						<b>
							No publico casas. Acompaño a personas a vender y comprar su propiedad con
							claridad, estrategia y confianza.
						</b>
						<br />
						<br />
						Llevo más de 20 años ayudando a propietarios a cerrar ventas
						existosas. Porque vender bien no es cuestión de suerte, es cuestión
						de experiencia, presentación y de atraer al comprador adecuado.
						<br />
						<br />
						Mis clientes no solo quieren vender. Quieren hacerlo con seguridad,
						evitar errores, ahorrar tiempo y proteger el valor de lo que han
						construido.
						<br />
						<br />Y eso{' '}
						<b>
							no se logra en un portal de anuncios. Se logra con acompañamiento
							real, visión de mercado y compromiso profesional.
						</b>
					</StyledDescription>
				</StyledInfoDiv>
			</StyledInfoContent>
			<StyledNumbersContainer>
				<StyledNumbersContent>
					<StyledNumber>3000+</StyledNumber>
					<StyledNumberDescription>Proyectos exitosos</StyledNumberDescription>
				</StyledNumbersContent>
				<StyledNumbersContent>
					<StyledNumber>2500+</StyledNumber>
					<StyledNumberDescription>
						Clientes satisfechos
					</StyledNumberDescription>
				</StyledNumbersContent>
				<StyledNumbersContent>
					<StyledNumber>100%</StyledNumber>
					<StyledNumberDescription>
						Satisfacción de clientes
					</StyledNumberDescription>
				</StyledNumbersContent>
			</StyledNumbersContainer>
		</StyledInfoContainer>
	);
};

export default WhoIs;
