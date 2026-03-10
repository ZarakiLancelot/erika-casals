import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

/**
 * FichaPage — Maneja los enlaces de ficha que Inmovilla envía desde su CRM.
 *
 * Inmovilla construye los enlaces con este formato:
 *   https://erikacasals.com/ficha/index.php?codigo=13731_350914
 *                                                    ↑agencia  ↑id propiedad (cod_ofer)
 *
 * Dos comportamientos posibles (configurable con la variable de entorno):
 *
 *   OPCIÓN A (por defecto): Mostrar la ficha oficial de Inmovilla en un iframe.
 *     → Los datos son 100% tiempo real (vienen de los servidores de Inmovilla).
 *     → El visitante ve el diseño nativo de Inmovilla dentro de la web de Erika.
 *
 *   OPCIÓN B: Redirigir a la página de propiedad propia del sitio.
 *     → Útil si el cod_ofer de Inmovilla coincide con el propertyId interno.
 *     → Activar con: VITE_FICHA_MODE=redirect en las variables de entorno de Vercel.
 */
const FICHA_MODE = import.meta.env.VITE_FICHA_MODE || 'iframe'; // 'iframe' | 'redirect'
const NUMAGENCIA = import.meta.env.VITE_INMOVILLA_NUMAGENCIA || '';

const FichaPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const codigo = searchParams.get('codigo') || '';

	// Extraer numagencia y cod_ofer del parámetro codigo
	// Formato: "13731_350914" → numagencia=13731, codOfer=350914
	const underscoreIndex = codigo.indexOf('_');
	const numagencia = underscoreIndex > -1
		? codigo.substring(0, underscoreIndex)
		: (NUMAGENCIA || '');
	const codOfer = underscoreIndex > -1
		? codigo.substring(underscoreIndex + 1)
		: codigo;

	useEffect(() => {
		// Si el modo es redirect y tenemos un cod_ofer válido,
		// redirigir a la página interna de la propiedad.
		if (FICHA_MODE === 'redirect' && codOfer) {
			navigate(`/property/${codOfer}`, { replace: true });
		}
	}, [codOfer, navigate]);

	// Código inválido
	if (!codigo || !codOfer) {
		return (
			<div style={styles.errorContainer}>
				<h2>Propiedad no encontrada</h2>
				<p>El enlace no contiene un código de propiedad válido.</p>
				<button onClick={() => navigate('/')} style={styles.button}>
					Volver al inicio
				</button>
			</div>
		);
	}

	// Modo redirect: mostrar loading mientras React Router procesa la navegación
	if (FICHA_MODE === 'redirect') {
		return (
			<div style={styles.loadingContainer}>
				<p>Cargando propiedad...</p>
			</div>
		);
	}

	// Modo iframe (por defecto): mostrar ficha oficial de Inmovilla en tiempo real
	const iframeUrl =
		`https://crm.inmovilla.com/new/app/escaparatecliente/panelpropietario/ficha.php` +
		`?idioma=1&codOfer=${codOfer}&numagencia=${numagencia}&datosAgencia=${numagencia}&formato=ficha`;

	return (
		<div style={styles.fullscreen}>
			<iframe
				src={iframeUrl}
				title={`Propiedad ${codOfer}`}
				style={styles.iframe}
				frameBorder="0"
				allowFullScreen
				scrolling="auto"
				allow="camera *; microphone *"
				sandbox="allow-scripts allow-modals allow-top-navigation allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation allow-orientation-lock allow-popups-to-escape-sandbox allow-downloads"
			/>
		</div>
	);
};

const styles = {
	fullscreen: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		overflow: 'hidden',
		background: '#fff'
	},
	iframe: {
		width: '100%',
		height: '100%',
		border: 'none',
		display: 'block'
	},
	errorContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '60vh',
		gap: '1rem',
		fontFamily: 'sans-serif',
		color: '#333',
		padding: '2rem'
	},
	loadingContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '60vh',
		fontFamily: 'sans-serif',
		color: '#666'
	},
	button: {
		padding: '0.75rem 1.5rem',
		background: '#2c5f8a',
		color: '#fff',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		fontSize: '1rem'
	}
};

export default FichaPage;
